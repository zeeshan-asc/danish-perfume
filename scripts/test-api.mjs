#!/usr/bin/env node
// Perfume Tracker API Test Suite
// Tests auth + perfume CRUD with minimal fields (images optional, extra fields not needed)

const BASE = "http://localhost:3000";
let cookie = "";
let perfumeId = null;
let passed = 0, failed = 0;

const user = "tester_" + Math.floor(Math.random() * 99999);
const pass = "TestPass123!";

function ok(name) { passed++; console.log(`  \u2713 ${name}`); }
function nok(name, err) { failed++; console.log(`  \u2717 ${name} \u2014 ${err}`); }

async function api(method, path, body, expectStatus = 200) {
  const opts = { method, headers: { "Content-Type": "application/json" }, redirect: "manual" };
  if (body) opts.body = JSON.stringify(body);
  if (cookie) opts.headers["Cookie"] = cookie;

  const url = BASE + path;
  const res = await fetch(url, opts);
  const data = res.headers.get("content-type")?.includes("json")
    ? await res.json() : await res.text();

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];

  if (res.status !== expectStatus) {
    throw new Error(`Expected ${expectStatus} got ${res.status}: ${typeof data === "string" ? data.substring(0,300) : JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  console.log(`\n--- Perfume Tracker API Test Suite ---`);
  console.log(`Base: ${BASE}\n`);

  // 1. Register (confirmPassword required by schema)
  try {
    const d = await api("POST", "/api/auth/register",
      { email: `${user}@test.com`, username: user, password: pass, confirmPassword: pass }, 201);
    d.data?.user?.email === `${user}@test.com` ? ok("Register") : nok("Register", "wrong email");
  } catch (e) { nok("Register", e.message); }

  // 2. Duplicate register fails
  try {
    await api("POST", "/api/auth/register",
      { email: `${user}@test.com`, username: user, password: pass, confirmPassword: pass }, 201);
    nok("Reject duplicate", "should have failed");
  } catch { ok("Reject duplicate"); }

  // 3. Login
  try {
    const d = await api("POST", "/api/auth/login", { email: `${user}@test.com`, password: pass }, 200);
    d.data?.user?.email === `${user}@test.com` ? ok("Login") : nok("Login", "wrong email");
  } catch (e) { nok("Login", e.message); }

  // 4. Get /me
  try {
    const d = await api("GET", "/api/auth/me");
    d.data?.id ? ok("Get /me") : nok("Get /me", "no id");
  } catch (e) { nok("Get /me", e.message); }

  // 5. Create perfume with MINIMAL fields (just name+brand+seasons — no image, no extras)
  try {
    const d = await api("POST", "/api/perfumes", { name: "Test Perfume", brand: "Test Brand", seasons: [] }, 201);
    perfumeId = d.data?.id;
    if (!perfumeId) throw new Error("No ID returned");
    d.data?.name === "Test Perfume" ? ok("Create perfume (minimal fields)") : nok("Create", "wrong name");
  } catch (e) { nok("Create perfume", e.message); }

  // 6. List
  try {
    const d = await api("GET", "/api/perfumes");
    d.data?.perfumes?.length >= 1 && d.data?.total >= 1 ? ok("List perfumes") : nok("List", "empty");
  } catch (e) { nok("List perfumes", e.message); }

  // 7. Search
  try {
    const d = await api("GET", "/api/perfumes?search=Test");
    d.data?.perfumes?.length >= 1 ? ok("Search perfumes") : nok("Search", "no results");
  } catch (e) { nok("Search", e.message); }

  // 8. Filter by status
  try {
    const d = await api("GET", "/api/perfumes?status=Owned");
    d.data?.perfumes?.length >= 1 && d.data?.total >= 1 ? ok("Filter by status") : nok("Filter", "empty");
  } catch (e) { nok("Filter", e.message); }

  // 9. Get single
  try {
    const d = await api("GET", `/api/perfumes/${perfumeId}`);
    d.data?.id === perfumeId ? ok("Get single perfume") : nok("Get single", "ID mismatch");
  } catch (e) { nok("Get single", e.message); }

  // 10. Update (PUT, not PATCH)
  try {
    const d = await api("PUT", `/api/perfumes/${perfumeId}`,
      { name: "Updated Perfume", rating: 8, notes: { top: "Bergamot", heart: "Vanilla", base: "Musk" } });
    d.data?.name === "Updated Perfume" && d.data?.rating === 8 ? ok("Update perfume") : nok("Update", "values wrong");
  } catch (e) { nok("Update", e.message); }

  // 11. Delete
  try {
    const d = await api("DELETE", `/api/perfumes/${perfumeId}`);
    d.message === "Perfume deleted successfully" ? ok("Delete perfume") : nok("Delete", "wrong message");
  } catch (e) { nok("Delete", e.message); }

  // 12. 404 after delete
  try {
    await api("GET", `/api/perfumes/${perfumeId}`, null, 200);
    nok("Deleted 404", "should be 404");
  } catch { ok("Deleted perfume returns 404"); }

  // 13. Unauthenticated /me returns 401
  try {
    const res = await fetch(`${BASE}/api/auth/me`, { headers: {} });
    res.status === 401 ? ok("Unauthenticated /me blocked") : nok("Unauthenticated", `status ${res.status}`);
  } catch (e) { nok("Unauthenticated", e.message); }

  // 14. Logout
  try {
    await api("POST", "/api/auth/logout", null, 200);
    ok("Logout");
  } catch (e) { nok("Logout", e.message); }

  // Summary
  const total = passed + failed;
  console.log(`\n--- ${passed}/${total} passed ---`);
  if (failed > 0) { console.log(`  ${failed} failures!`); process.exit(1); }
  process.exit(0);
}

main().catch(e => { console.error("Fatal:", e.message); process.exit(1); });
