"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { Check, X, SprayCan as Spray } from "lucide-react";

export default function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
  });

  const password = watch("password", "");

  const checks = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Contains uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Contains a number", passed: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");
    const result = await registerUser(
      data.username,
      data.email,
      data.password,
      data.confirmPassword
    );
    if (result.error) {
      setServerError(result.error);
      return;
    }
    addToast("Account created!", "success");
    router.push("/");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      {serverError && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--danger-subtle)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger)",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>!</span> {serverError}
        </div>
      )}

      <Input
        label="Username"
        type="text"
        placeholder="Choose a username"
        error={errors.username?.message}
        autoComplete="username"
        {...register("username")}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        error={errors.password?.message}
        autoComplete="new-password"
        {...register("password")}
      />

      {/* Password strength indicators */}
      {password.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              margin: "0 0 2px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Password Requirements
          </p>
          {checks.map((c) => (
            <div
              key={c.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontFamily: "var(--font-body)",
                color: c.passed ? "var(--success)" : "var(--text-muted)",
                transition: "color 0.2s ease",
              }}
            >
              {c.passed ? <Check size={12} /> : <X size={12} />}
              {c.label}
            </div>
          ))}
        </div>
      )}

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
        {...register("confirmPassword")}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "12px 24px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--accent-border-strong)",
          background: "var(--accent-muted)",
          color: "var(--accent-primary)",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          cursor: isSubmitting ? "not-allowed" : "pointer",
          width: "100%",
          transition: "all var(--duration-fast) var(--ease-out)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? (
          <>
            <span
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(200,164,78,0.2)",
                borderTopColor: "var(--accent-primary)",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
                display: "inline-block",
              }}
            />
            Creating account...
          </>
        ) : (
          <>
            <Spray size={16} />
            Create Account
          </>
        )}
      </button>
    </form>
  );
}
