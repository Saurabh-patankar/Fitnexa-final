import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { QRCheckIn } from "@/components/QRCheckIn";
import { Membership } from "@/components/Membership";
import { Payments } from "@/components/Payments";
import { AIFormCorrector } from "@/components/AIFormCorrector";
import { ProgressTracker } from "@/components/ProgressTracker";
import { Community } from "@/components/Community";
import { WorkoutTimer } from "@/components/WorkoutTimer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "checkin":
        return <QRCheckIn />;
      case "membership":
        return <Membership />;
      case "payments":
        return <Payments />;
      case "ai-form":
        return <AIFormCorrector />;
      case "progress":
        return <ProgressTracker />;
      case "community":
        return <Community />;
      case "timer":
        return <WorkoutTimer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="transition-all duration-500 ease-in-out">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index; 