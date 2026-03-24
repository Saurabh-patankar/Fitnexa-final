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
                <p className="text-gray-400 text-sm">Total Workouts</p>
                <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">156</p>
                <p className="text-purple-400 text-sm">This month</p>
              </div>
              <Trophy className="w-12 h-12 text-purple-400 group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <Card className="lg:col-span-2 bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Today's Workout Plan</span>
              <Badge variant="secondary" className="ml-auto">Upper Body</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workoutTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  task.completed 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-600 text-gray-400"
                }`}>
                  {task.completed && <CheckCircle className="w-4 h-4" />}
                </div>
                <span className={`flex-1 ${task.completed ? "text-gray-400 line-through" : "text-white"}`}>
                  {task.task}
                </span>
              </div>
            ))}
            <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Start Workout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Motivation Card */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Daily Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl mb-4">💪</div>
              <p className="text-gray-300 italic text-lg leading-relaxed">
                "{motivationalQuotes[currentQuote]}"
              </p>
              <div className="mt-4 flex justify-center space-x-1">
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
      </div>

      {/* Progress Section */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Workout Goal</span>
                <span>5/7 days</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Calorie Burn</span>
                <span>2,450/3,000</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Steps</span>
                <span>8,500/10,000</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 