"use client";

import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  currentLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, maxLength, currentLength, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs text-muted-3 uppercase tracking-wider mb-1.5 font-serif">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-input-bg border rounded-lg px-3.5 py-2.5 text-sm text-cream font-serif",
            "placeholder:text-muted-4 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-colors",
            "min-h-[80px] resize-y",
            error ? "border-red-500/50" : "border-input-border",
            className
          )}
          maxLength={maxLength}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error && <p className="text-red-400 text-xs font-serif">{error}</p>}
          {maxLength !== undefined && (
            <p className={cn("text-xs ml-auto font-serif", currentLength !== undefined && currentLength >= maxLength * 0.9 ? "text-red-400" : "text-muted-5")}>
              {currentLength ?? 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
