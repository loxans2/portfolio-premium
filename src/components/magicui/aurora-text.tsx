import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export function AuroraText({
  children,
  className,
  colors = [
    "hsl(var(--gold))",
    "hsl(36 90% 70%)",
    "hsl(280 60% 65%)",
    "hsl(190 70% 60%)",
  ],
  speed = 1,
}: AuroraTextProps) {
  const gradient = `linear-gradient(135deg, ${colors.join(", ")})`;

  return (
    <span
      className={cn("relative inline-block", className)}
      style={
        {
          "--aurora-gradient": gradient,
          "--aurora-speed": `${10 / speed}s`,
        } as React.CSSProperties
      }
    >
      <span
        className="relative z-10 bg-[image:var(--aurora-gradient)] bg-[length:200%_auto] bg-clip-text text-transparent animate-aurora"
        style={{ WebkitBackgroundClip: "text" }}
      >
        {children}
      </span>
    </span>
  );
}
