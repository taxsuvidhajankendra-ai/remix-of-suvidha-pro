import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  stats: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
  }[];
  color: "primary" | "accent" | "success" | "warning";
  onClick?: () => void;
}

const colorMap = {
  primary: {
    bg: "bg-primary/10",
    icon: "bg-gradient-hero text-primary-foreground",
    border: "border-primary/20 hover:border-primary/40",
  },
  accent: {
    bg: "bg-accent/10",
    icon: "bg-gradient-accent text-accent-foreground",
    border: "border-accent/20 hover:border-accent/40",
  },
  success: {
    bg: "bg-success/10",
    icon: "bg-gradient-success text-success-foreground",
    border: "border-success/20 hover:border-success/40",
  },
  warning: {
    bg: "bg-warning/10",
    icon: "bg-gradient-warning text-warning-foreground",
    border: "border-warning/20 hover:border-warning/40",
  },
};

export function ServiceCard({ title, description, icon: Icon, stats, color, onClick }: ServiceCardProps) {
  const colors = colorMap[color];

  return (
    <Card 
      className={cn(
        "border-2 transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-card hover:shadow-card-hover",
        colors.border
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl shadow-card", colors.icon)}>
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Service
          </span>
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
