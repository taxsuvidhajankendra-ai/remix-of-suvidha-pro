import { cn } from "@/lib/utils";

interface ComplianceScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ComplianceScore({ score, size = "lg" }: ComplianceScoreProps) {
  const getColor = () => {
    if (score >= 80) return { stroke: "hsl(var(--success))", bg: "bg-success/10", text: "text-success" };
    if (score >= 60) return { stroke: "hsl(var(--warning))", bg: "bg-warning/10", text: "text-warning" };
    return { stroke: "hsl(var(--destructive))", bg: "bg-destructive/10", text: "text-destructive" };
  };

  const getStatus = () => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Attention";
    return "Critical";
  };

  const dimensions = {
    sm: { size: 80, stroke: 6, fontSize: "text-lg" },
    md: { size: 120, stroke: 8, fontSize: "text-2xl" },
    lg: { size: 180, stroke: 12, fontSize: "text-4xl" },
  };

  const d = dimensions[size];
  const radius = (d.size - d.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const colors = getColor();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          width={d.size}
          height={d.size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={d.size / 2}
            cy={d.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={d.stroke}
            className="text-secondary"
          />
          {/* Progress circle */}
          <circle
            cx={d.size / 2}
            cy={d.size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={d.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", d.fontSize, colors.text)}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Score
          </span>
        </div>
      </div>
      
      <div className={cn("px-4 py-1.5 rounded-full text-sm font-medium", colors.bg, colors.text)}>
        {getStatus()}
      </div>
    </div>
  );
}
