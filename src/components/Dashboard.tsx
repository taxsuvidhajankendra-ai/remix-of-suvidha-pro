import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceScore } from "@/components/ComplianceScore";
import { ServiceCard } from "@/components/ServiceCard";
import { RecentActivity } from "@/components/RecentActivity";
import { QuickActions } from "@/components/QuickActions";
import { UpcomingDeadlines } from "@/components/UpcomingDeadlines";
import { 
  FileText, 
  Calculator, 
  Building2, 
  Shield,
  TrendingUp,
  Users,
  FileCheck,
  IndianRupee
} from "lucide-react";
import { cn } from "@/lib/utils";

const statsCards = [
  {
    label: "Active Clients",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Pending Filings",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: FileText,
  },
  {
    label: "This Month Revenue",
    value: "₹2.4L",
    change: "+18%",
    trend: "up",
    icon: IndianRupee,
  },
  {
    label: "Completed Tasks",
    value: "89",
    change: "+25%",
    trend: "up",
    icon: FileCheck,
  },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Title */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Your complete business compliance at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              className={cn("animate-slide-up")}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <TrendingUp className={cn(
                    "h-4 w-4",
                    stat.trend === "up" ? "text-success" : "text-destructive rotate-180"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Services & Activity */}
        <div className="xl:col-span-2 space-y-6">
          {/* Compliance Score Card */}
          <Card className="animate-scale-in" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ComplianceScore score={78} />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Client Compliance Health
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your clients' overall compliance status is good. 3 clients need immediate attention for GST filings.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-success/10">
                      <p className="text-2xl font-bold text-success">98</p>
                      <p className="text-xs text-muted-foreground">Compliant</p>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10">
                      <p className="text-2xl font-bold text-warning">26</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="p-3 rounded-lg bg-destructive/10">
                      <p className="text-2xl font-bold text-destructive">3</p>
                      <p className="text-xs text-muted-foreground">Overdue</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
              <ServiceCard
                title="GST Filing"
                description="Manage GSTR-1, 3B, 9 returns"
                icon={FileText}
                color="primary"
                stats={[
                  { label: "Due This Week", value: 8 },
                  { label: "Filed This Month", value: 45 },
                ]}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
              <ServiceCard
                title="ITR Submission"
                description="Income tax returns & refunds"
                icon={Calculator}
                color="accent"
                stats={[
                  { label: "In Progress", value: 12 },
                  { label: "Awaiting Approval", value: 6 },
                ]}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
              <ServiceCard
                title="Audit Requests"
                description="Tax audit & compliance audits"
                icon={Shield}
                color="warning"
                stats={[
                  { label: "Active Audits", value: 3 },
                  { label: "Completed", value: 18 },
                ]}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
              <ServiceCard
                title="Registrations"
                description="Company, MSME, DSC, Licenses"
                icon={Building2}
                color="success"
                stats={[
                  { label: "In Progress", value: 7 },
                  { label: "This Quarter", value: 24 },
                ]}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="animate-fade-in" style={{ animationDelay: "700ms" }}>
            <RecentActivity />
          </div>
        </div>

        {/* Right Column - Quick Actions & Deadlines */}
        <div className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
            <QuickActions />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
            <UpcomingDeadlines />
          </div>
        </div>
      </div>
    </div>
  );
}
