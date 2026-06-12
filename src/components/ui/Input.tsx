"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; helperText?: string; }

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, helperText, className, type, style, ...props }, ref) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      {label && <div style={{ fontSize: 12, color: "#a0a0b4", marginBottom: 5, fontWeight: 500 }}>{label}</div>}
      <div style={{ position: "relative" }}>
        <input ref={ref} type={isPassword && show ? "text" : type}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.04)",
            border: error ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(255,255,255,0.08)",
            color: "#f0f0f4", borderRadius: 8, padding: "10px 14px", paddingRight: isPassword ? 40 : 14,
            fontSize: 14, fontFamily: "DM Sans, system-ui, -apple-system, sans-serif",
            outline: "none", transition: "all 0.15s ease",
            ...style,
          }}
          onFocus={(e) => { if (!error) e.target.style.borderColor = "rgba(20,184,166,0.4)"; props.onFocus?.(e); }}
          onBlur={(e) => { if (!error) e.target.style.borderColor = "rgba(255,255,255,0.08)"; props.onBlur?.(e); }}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} tabIndex={-1}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#6b6b80", padding: 2 }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <div style={{ fontSize: 11, color: "#f87171", marginTop: 4 }}>{error}</div>}
    </div>
  );
});
Input.displayName = "Input";
export default Input;
