import { Sun } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} rounded-lg bg-primary flex items-center justify-center shadow-elevated`}>
        <Sun className="h-1/2 w-1/2 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <span className={`${text} font-bold tracking-tight text-foreground`}>LumiPool</span>
    </div>
  );
}
