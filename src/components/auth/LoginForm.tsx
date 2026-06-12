"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Input from "@/components/ui/Input";
import { SprayCan as Spray } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) as any });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");
    const result = await login(data.email, data.password);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    addToast("Welcome back", "success");
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
        placeholder="Enter your password"
        error={errors.password?.message}
        autoComplete="current-password"
        {...register("password")}
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
            Signing in...
          </>
        ) : (
          <>
            <Spray size={16} />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}
