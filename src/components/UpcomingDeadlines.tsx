import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  daysLeft: number;
  progress: number;
  type: string;
}

const deadlines: Deadline[] = [
  {
    id: "1",
    title: "GSTR-3B Filing",
    dueDate: "Dec 20, 2024",
    daysLeft: 3,
    progress: 75,
    type: "GST"
  },
  {
    id: "2",
    title: "GSTR-1 Filing",
    dueDate: "Dec 25, 2024",
    daysLeft: 8,
    progress: 45,
    type: "GST"
  },
  {
    id: "3",
    title: "TDS Return Q3",
    dueDate: "Jan 15, 2025",
    daysLeft: 29,
    progress: 20,
    type: "TDS"
  },
  {
    id: "4",
    title: "Advance Tax Q4",
    dueDate: "Mar 15, 2025",
    daysLeft: 88,
    progress: 0,
    type: "Income Tax"
  },
];

export function UpcomingDeadlines() {
  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "text-destructive";
    if (daysLeft <= 7) return "text-warning";
    return "text-muted-foreground";
  };

  const getProgressColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "bg-destructive";
    if (daysLeft <= 7) return "bg-warning";
    return "bg-primary";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
        <button className="text-sm text-primary font-medium hover:underline">
          View Calendar
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {deadlines.map((deadline, index) => (
          <div
            key={deadline.id}
            className={cn(
              "p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">{deadline.title}</p>
                <p className="text-xs text-muted-foreground">{deadline.type}</p>
              </div>
              <div className="text-right">
                <p className={cn("font-semibold", getUrgencyColor(deadline.daysLeft))}>
                  {deadline.daysLeft} days
                </p>
                <p className="text-xs text-muted-foreground">{deadline.dueDate}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{deadline.progress}%</span>
              </div>
              <Progress 
                value={deadline.progress} 
                className="h-2"
                indicatorClassName={getProgressColor(deadline.daysLeft)}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
