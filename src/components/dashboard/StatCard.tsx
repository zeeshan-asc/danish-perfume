import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accentColor?: string;
  className?: string;
}

export default function StatCard({ label, value, icon: Icon, accentColor, className }: StatCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-5 card-lift", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] tracking-[0.2em] uppercase font-serif" style={{ color: "#7a7068" }}>{label}</span>
        {Icon && <Icon size={15} style={{ color: accentColor || "#b49c60", opacity: 0.7 }} />}
      </div>
      <p className="text-3xl font-serif tracking-wide tabular-nums" style={{ color: accentColor || "#e6dcc8" }}>
        {value}
      </p>
    </div>
  );
}
