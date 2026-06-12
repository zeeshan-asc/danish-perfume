#!/usr/bin/env pwsh
$BASE = "http://localhost:3000"
$COOKIE = [System.IO.Path]::GetTempFileName()
$PASS = 0; $FAIL = 0
$user = "tester_$(Get-Random -Max 99999)"
$pass = "TestPass123!"
$id = $null

function pass($n) { $script:PASS++; Write-Host "  + $n" -ForegroundColor Green }
function fail($n, $e) { $script:FAIL++; Write-Host "  - $n : $e" -ForegroundColor Red }
function api($m, $p, $b, $s=200) {
  $u = "$BASE$p"; $params = @{Uri=$u;Method=$m;WebSession=$COOKIE;UseBasicParsing=$true}
  if ($b) { $params["Body"] = ($b|ConvertTo-Json -Compress); $params["ContentType"]="application/json" }
  $r = try { Invoke-WebRequest @params -SkipCertificateCheck -ErrorAction Stop } catch { if ($_.Exception.Response){$_.Exception.Response}else{throw} }
  if ([int]$r.StatusCode -ne $s) { throw "status $([int]$r.StatusCode): $($r.Content)" }
  if ($r.Content) { return ($r.Content|ConvertFrom-Json) }
}

Write-Host "`n--- Perfume Tracker API Test Suite ---" -ForegroundColor Cyan
Write-Host "Base: $BASE`n" -ForegroundColor Gray

try { $d = api POST "/api/auth/register" @{email="$user@test.com";username=$user;password=$pass} 201; if($d.user.email -eq "$user@test.com"){pass "Register"}else{fail "Register" "wrong email"} } catch { fail "Register" $_ }

try { api POST "/api/auth/register" @{email="$user@test.com";username=$user;password=$pass} 201; fail "Reject duplicate" "should have failed" } catch { pass "Reject duplicate" }

try { $d = api POST "/api/auth/login" @{email="$user@test.com";password=$pass} 200; if($d.user.email -eq "$user@test.com"){pass "Login"}else{fail "Login" "wrong email"} } catch { fail "Login" $_ }

try { $d = api GET "/api/auth/me"; if($d.user.email -eq "$user@test.com"){pass "Get /me"}else{fail "Get /me" "wrong email"} } catch { fail "Get /me" $_ }

try { $d = api POST "/api/perfumes" @{name="Test Perfume";brand="Test Brand";seasons=@()} 201; $id = $d.perfume._id; if($d.perfume.name -eq "Test Perfume"){pass "Create perfume (minimal)"}else{fail "Create" "wrong name"} } catch { fail "Create perfume" $_ }

try { $d = api GET "/api/perfumes"; if($d.perfumes.Count -ge 1 -and $d.total -ge 1){pass "List perfumes"}else{fail "List" "empty"} } catch { fail "List perfumes" $_ }

try { $d = api GET "/api/perfumes?search=Test"; if($d.perfumes.Count -ge 1){pass "Search perfumes"}else{fail "Search" "no results"} } catch { fail "Search" $_ }

try { $d = api GET "/api/perfumes?status=Owned"; if($d.perfumes.Count -ge 1 -and $d.total -ge 1){pass "Filter by status"}else{fail "Filter" "empty"} } catch { fail "Filter" $_ }

try { $d = api GET "/api/perfumes/$id"; if($d.perfume._id -eq $id){pass "Get single"}else{fail "Get single" "ID mismatch"} } catch { fail "Get single" $_ }

try { $d = api PATCH "/api/perfumes/$id" @{name="Updated Perfume";rating=8;notes=@{top="Bergamot";heart="Vanilla";base="Musk"}}; if($d.perfume.name -eq "Updated Perfume" -and $d.perfume.rating -eq 8){pass "Update perfume"}else{fail "Update" "values wrong"} } catch { fail "Update" $_ }

try { $d = api DELETE "/api/perfumes/$id"; if($d.message -eq "Perfume deleted"){pass "Delete perfume"}else{fail "Delete" "wrong message"} } catch { fail "Delete" $_ }

try { api GET "/api/perfumes/$id" $null 200; fail "Deleted 404" "should be 404" } catch { pass "Deleted 404" }

try { $t = [System.IO.Path]::GetTempFileName(); $r = try{Invoke-WebRequest @{Uri="$BASE/api/auth/me";Method="GET";WebSession=$t;UseBasicParsing=$true} -SkipCertificateCheck -ErrorAction Stop; $false}catch{[int]$_.Exception.Response.StatusCode -eq 401}; Remove-Item $t -Force; if($r){pass "Unauthenticated /me blocked"}else{fail "Unauthenticated" "wrong status"} } catch { fail "Unauthenticated /me" $_ }

try { api POST "/api/auth/logout" $null 200; pass "Logout" } catch { fail "Logout" $_ }

$TOTAL = $PASS+$FAIL; Write-Host "`n--- $PASS/$TOTAL passed ---" -ForegroundColor $(if($FAIL-eq0){"Green"}else{"Yellow"})
if ($FAIL -gt 0) { Write-Host "  $FAIL failures!" -ForegroundColor Red; exit 1 }
Remove-Item $COOKIE -Force; exit 0
