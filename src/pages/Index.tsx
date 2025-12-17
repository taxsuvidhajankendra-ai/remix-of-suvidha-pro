import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className={cn(
        "transition-all duration-300",
        "lg:ml-[260px]"
      )}>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection !== "dashboard" && (
            <div className="p-6">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Module
                </h2>
                <p className="text-muted-foreground">
                  This section is under development. Check back soon!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
