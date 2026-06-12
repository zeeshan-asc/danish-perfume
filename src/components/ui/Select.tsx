"use client";

import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs text-muted-3 uppercase tracking-wider mb-1.5 font-serif">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full bg-input-bg border rounded-lg px-3.5 py-2.5 text-sm text-cream font-serif",
              "appearance-none focus:outline-none focus:ring-2 focus:ring-gold/40 transition-colors cursor-pointer",
              error ? "border-red-500/50" : "border-input-border",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-bg">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-4 pointer-events-none"
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-1 font-serif">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
