
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Calendar, 
  Target, 
  Flame,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";

const motivationalQuotes = [
  "The body achieves what the mind believes.",
  "Strength doesn't come from comfort zones.",
  "Your only limit is your mind.",
  "Champions train, losers complain.",
  "Push yourself because no one else will."
];

export const Dashboard = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [streak, setStreak] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const workoutTasks = [
    { task: "Warm-up (10 min)", completed: true },
    { task: "Chest Press 3x12", completed: true },
    { task: "Squats 4x15", completed: false },
    { task: "Deadlifts 3x10", completed: false },
    { task: "Cool-down (10 min)", completed: false },
  ];

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Alex! 💪</h2>
            <p className="text-gray-300">Ready to crush your fitness goals today?</p>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-gray-300">day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">{streak}</p>
                <p className="text-orange-400 text-sm">🔥 On fire!</p>
              </div>
              <Flame className="w-12 h-12 text-orange-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Membership</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">23</p>
                <p className="text-green-400 text-sm">days left</p>
              </div>
              <Calendar className="w-12 h-12 text-green-400 group-hover:animate-bounce" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Goal Progress</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">78%</p>
                <p className="text-blue-400 text-sm">Almost there!</p>
              </div>
              <Target className="w-12 h-12 text-blue-400 group-hover:animate-spin" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total XP</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">2,450</p>
                <p className="text-purple-400 text-sm">Level 8</p>
              </div>
              <Trophy className="w-12 h-12 text-purple-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Motivational Quote Carousel */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>💡</span>
              <span>Daily Motivation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <p className="text-xl text-gray-200 italic mb-4 animate-fade-in">
                "{motivationalQuotes[currentQuote]}"
              </p>
              <div className="flex justify-center space-x-2">
                {motivationalQuotes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentQuote ? "bg-purple-400" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Workout */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Today's Workout</span>
              </div>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                Upper Body
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workoutTasks.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  item.completed 
                    ? "bg-green-500/20 border border-green-500/30" 
                    : "bg-gray-800/40 border border-gray-600/30 hover:bg-gray-700/40"
                }`}
              >
                <CheckCircle
                  className={`w-5 h-5 ${
                    item.completed ? "text-green-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`flex-1 ${
                    item.completed 
                      ? "text-green-300 line-through" 
                      : "text-gray-200"
                  }`}
                >
                  {item.task}
                </span>
              </div>
            ))}
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white mt-4 group">
              Start Workout
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Monthly Goals Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Workout Days (18/25)</span>
              <span className="text-purple-400">72%</span>
            </div>
            <Progress value={72} className="h-3 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500" />
            </Progress>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Weight Goal (8/10 kg)</span>
              <span className="text-blue-400">80%</span>
            </div>
            <Progress value={80} className="h-3 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500" />
            </Progress>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Protein Intake (95/100g)</span>
              <span className="text-green-400">95%</span>
            </div>
            <Progress value={95} className="h-3 bg-gray-800">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500" />
            </Progress>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
