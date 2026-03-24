import { useEffect, useState } from "react";
import axios from "../utils/api";
import FeatureCard from "../components/FeatureCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Calendar,
  CreditCard,
  Bolt,
  BrainCircuit,
  Flame,
  BadgePercent,
  Camera,
  Star,
  Users,
  ClipboardList,
  Stethoscope,
  Lightbulb,
} from "lucide-react";

const features = [
  { icon: Dumbbell, title: "Custom Memberships Plans" },
  { icon: Calendar, title: "Trainer Availability" },
  { icon: CreditCard, title: "Offline Payments" },
  { icon: Bolt, title: "Streak Tracking" },
  {
    icon: BrainCircuit,
    title: "AI Fitness Advice",
    description: "Boost your metabolism with HIIT sessions 5x a week",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Keep bashing towards your goals",
  },
  {
    icon: BadgePercent,
    title: "Referral & Discount Tools",
    description: "Engage with top fitness influencers",
  },
  {
    icon: Camera,
    title: "Progress Selfies",
    description: "Track your transformation",
  },
  {
    icon: Star,
    title: "Influencer Features",
    description: "Engage with fitness creators",
  },
  {
    icon: ClipboardList,
    title: "Community Challenges",
    description: "Participate in FitNexa events",
  },
  {
    icon: Stethoscope,
    title: "Health Integration",
    description: "Tailor workouts based on medical history",
  },
];

const DashboardHome = () => {
  const [tip, setTip] = useState("");

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const res = await axios.get("/tips/random");
        setTip(res.data.tip || "Stay active and hydrated today!");
      } catch (err) {
        console.error("❌ Failed to fetch smart tip:", err);
      }
    };

    fetchTip();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to FitNexa</h1>
          <p className="text-muted-foreground">Your personal fitness companion</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Premium Member
        </Badge>
      </div>

      {/* Smart Tip Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <CardTitle className="text-lg">Today's Smart Fitness Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-50">{tip}</p>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;