import { FileText, Check, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  client: string;
  status: "completed" | "pending" | "urgent" | "in-progress";
  time: string;
  type: string;
}

const activities: Activity[] = [
  {
    id: "1",
    title: "GSTR-3B Filed",
    client: "Sharma Enterprises",
    status: "completed",
    time: "2 hours ago",
    type: "GST"
  },
  {
    id: "2",
    title: "ITR Draft Pending Approval",
    client: "Gupta Trading Co.",
    status: "pending",
    time: "4 hours ago",
    type: "ITR"
  },
  {
    id: "3",
    title: "MSME Registration",
    client: "Patel Industries",
    status: "in-progress",
    time: "1 day ago",
    type: "Registration"
  },
  {
    id: "4",
    title: "GST Return Overdue",
    client: "Singh & Sons",
    status: "urgent",
    time: "2 days ago",
    type: "GST"
  },
  {
    id: "5",
    title: "Company Registration Complete",
    client: "Tech Innovations Pvt Ltd",
    status: "completed",
    time: "3 days ago",
    type: "Registration"
  },
];

const statusConfig = {
  completed: {
    icon: Check,
    color: "bg-success/10 text-success border-success/20",
    label: "Completed"
  },
  pending: {
    icon: Clock,
    color: "bg-warning/10 text-warning border-warning/20",
    label: "Pending"
  },
  urgent: {
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Urgent"
  },
  "in-progress": {
    icon: Clock,
    color: "bg-primary/10 text-primary border-primary/20",
    label: "In Progress"
  },
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <button className="text-sm text-primary font-medium hover:underline">
          View All
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activities.map((activity, index) => {
            const status = statusConfig[activity.status];
            const StatusIcon = status.icon;
            
            return (
              <div
                key={activity.id}
                className={cn(
                  "flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  status.color.split(" ")[0]
                )}>
                  <StatusIcon className={cn("h-5 w-5", status.color.split(" ")[1])} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">{activity.title}</p>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{activity.client}</p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <Badge className={cn("mb-1", status.color)}>
                    {status.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
