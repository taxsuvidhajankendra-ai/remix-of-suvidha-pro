import { 
  LayoutDashboard, 
  FileText, 
  Calculator, 
  Building2, 
  Shield, 
  Bell, 
  Settings,
  Video,
  Upload,
  Search,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "gst", label: "GST Filing", icon: FileText },
  { id: "itr", label: "ITR Submission", icon: Calculator },
  { id: "audit", label: "Audit Requests", icon: Shield },
  { id: "registrations", label: "Registrations", icon: Building2 },
  { id: "documents", label: "Documents", icon: Upload },
  { id: "consultation", label: "CA Consultation", icon: Video },
];

const bottomNavItems = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[70px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "p-6 border-b border-border flex items-center",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-lg text-foreground">Suvidha Pro</h1>
              <p className="text-xs text-muted-foreground">Tax Kendra Portal</p>
            </div>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-secondary rounded-lg border-0 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-card" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-border space-y-1">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMobileOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-card" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-card"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className={cn("transition-transform", isCollapsed && "rotate-180")}>‹</span>
        </Button>
      </aside>
    </>
  );
}
