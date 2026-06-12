"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const { register: registerUser } = useAuth(); const { addToast } = useToast(); const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) as any });
  const password = watch("password", "");

  const checks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Contains uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Contains a number", passed: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    const result = await registerUser(data.username, data.email, data.password, data.confirmPassword);
    if (result.error) { setServerError(result.error); return; }
    addToast("Account created!", "success"); router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {serverError && <div style={{ padding: "10px 14px", borderRadius: 6, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{serverError}</div>}
      <Input label="Username" type="text" placeholder="Choose a username" error={errors.username?.message} {...register("username")} />
      <Input label="Email" type="email" placeholder="Enter your email" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" placeholder="Create a password" error={errors.password?.message} {...register("password")} />
      {password.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {checks.map(c => (
            <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", color: c.passed ? "#34d399" : "#6b6b80" }}>
              {c.passed ? <Check size={11} /> : <X size={11} />} {c.label}
            </div>
          ))}
        </div>
      )}
      <Input label="Confirm Password" type="password" placeholder="Confirm your password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
      <button type="submit" disabled={isSubmitting} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.1)", color: "#2dd4bf", fontSize: 14, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, cursor: "pointer", width: "100%" }}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
      <p style={{ fontSize: 13, color: "#6b6b80", textAlign: "center", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", margin: 0 }}>
        Already have an account? <Link href="/login" style={{ color: "#2dd4bf", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
      </p>
    </form>
  );
}
