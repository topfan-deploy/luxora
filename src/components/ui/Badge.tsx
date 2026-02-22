import { cn } from "@/lib/utils/format";

type BadgeVariant = "gold" | "red" | "green";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold-400/20 text-gold-300 border-gold-400/30",
  red: "bg-red-500/20 text-red-300 border-red-500/30",
  green: "bg-green-500/20 text-green-300 border-green-500/30",
};

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { type BadgeVariant, type BadgeProps };
