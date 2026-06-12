"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [serverError, setServerError] = useState("");
  const { login } = useAuth(); const { addToast } = useToast(); const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) as any });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    const result = await login(data.email, data.password);
    if (result.error) { setServerError(result.error); return; }
    addToast("Welcome back", "success"); router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {serverError && <div style={{ padding: "10px 14px", borderRadius: 6, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: 13, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif" }}>{serverError}</div>}
      <Input label="Email" type="email" placeholder="Enter your email" error={errors.email?.message} {...register("email")} />
      <Input label="Password" type="password" placeholder="Enter your password" error={errors.password?.message} {...register("password")} />
      <button type="submit" disabled={isSubmitting} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.1)", color: "#2dd4bf", fontSize: 14, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", fontWeight: 500, cursor: "pointer", width: "100%", transition: "all 0.15s ease" }}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
      <p style={{ fontSize: 13, color: "#6b6b80", textAlign: "center", fontFamily: "DM Sans, system-ui, -apple-system, sans-serif", margin: 0 }}>
        Don't have an account? <Link href="/register" style={{ color: "#2dd4bf", textDecoration: "none", fontWeight: 500 }}>Create one</Link>
      </p>
    </form>
  );
}
