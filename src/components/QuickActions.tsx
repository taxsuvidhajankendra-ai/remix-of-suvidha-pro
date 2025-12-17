import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Video, 
  Calculator, 
  FileSearch, 
  UserPlus,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    id: "upload-bill",
    label: "Upload Bill",
    description: "AI-powered categorization",
    icon: Upload,
    color: "primary"
  },
  {
    id: "schedule-call",
    label: "Schedule CA Call",
    description: "Book consultation",
    icon: Video,
    color: "accent"
  },
  {
    id: "calculate-tax",
    label: "Tax Calculator",
    description: "Quick estimates",
    icon: Calculator,
    color: "success"
  },
  {
    id: "verify-gst",
    label: "Verify GSTIN",
    description: "Instant verification",
    icon: FileSearch,
    color: "warning"
  },
  {
    id: "add-client",
    label: "Add Client",
    description: "New registration",
    icon: UserPlus,
    color: "primary"
  },
] as const;

const colorMap = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  success: "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground",
  warning: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground",
};

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto py-3 px-4 group hover:bg-secondary",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors",
                colorMap[action.color]
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
