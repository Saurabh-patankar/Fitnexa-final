
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  QrCode, 
  Camera, 
  Upload, 
  Calendar,
  Users,
  Trophy,
  Flame,
  CheckCircle
} from "lucide-react";

export const QRCheckIn = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [streak, setStreak] = useState(12);
  const [gymOccupancy, setGymOccupancy] = useState(34);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const attendanceData = [
    { date: "2024-01-01", present: true },
    { date: "2024-01-02", present: true },
    { date: "2024-01-03", present: false },
    { date: "2024-01-04", present: true },
    { date: "2024-01-05", present: true },
    { date: "2024-01-06", present: true },
    { date: "2024-01-07", present: true },
  ];

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // Trigger confetti animation for streak milestone
    if ([3, 5, 7, 14, 21].includes(streak + 1)) {
      // Confetti effect would be triggered here
      console.log("🎉 Streak milestone reached!");
    }
    setStreak(streak + 1);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">QR Check-in & Checkout</h2>
        <p className="text-gray-300">Scan to track your gym visits and maintain your streak</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in Interface */}
        <Card className="bg-black/40 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>Check-in Station</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isCheckedIn ? (
              <>
                {/* QR Scanner Area */}
                <div className="border-2 border-dashed border-blue-500/50 rounded-xl p-8 text-center bg-blue-500/5">
                  <QrCode className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-300 mb-4">Position QR code within the frame</p>
                  <div className="border-2 border-blue-400 rounded-lg w-48 h-48 mx-auto mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 border-2 border-blue-400 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 animate-[slide-down_2s_infinite]"></div>
                  </div>
                </div>

                {/* Alternative Methods */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowCamera(!showCamera)}
                    variant="outline"
                    className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Use Camera
                  </Button>
                  <Button
                    onClick={handleFileUpload}
                    variant="outline"
                    className="flex-1 border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>

                <Button
                  onClick={handleCheckIn}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  Manual Check-in
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleCheckIn();
                    }
                  }}
                />
              </>
            ) : (
              <div className="text-center p-6">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-green-400 mb-2">Checked In! 🎉</h3>
                <p className="text-gray-300 mb-4">Welcome to FitNexa Gym</p>
                <p className="text-sm text-gray-400">Check-in time: {new Date().toLocaleTimeString()}</p>
                <Button
                  onClick={() => setIsCheckedIn(false)}
                  className="mt-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  Check Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats & Progress */}
        <div className="space-y-6">
          {/* Streak Counter */}
          <Card className="bg-black/40 border-orange-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">{streak} Days</h3>
                    <p className="text-orange-300 text-sm">Current Streak</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                  🔥 On Fire!
                </Badge>
              </div>
              
              {/* Next milestone progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Next milestone: 14 days</span>
                  <span className="text-orange-400">{Math.round((streak / 14) * 100)}%</span>
                </div>
                <Progress value={(streak / 14) * 100} className="h-2 bg-gray-800">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full" />
                </Progress>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress Ring */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-lg">Monthly Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="rgb(55, 65, 81)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={351.86}
                      strokeDashoffset={351.86 * (1 - 0.72)}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">72%</div>
                      <div className="text-xs text-gray-400">18/25 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Gym Occupancy */}
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Live Gym Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300">Current Occupancy</span>
                <Badge 
                  variant="secondary" 
                  className={`${
                    gymOccupancy > 70 
                      ? "bg-red-500/20 text-red-300" 
                      : gymOccupancy > 40 
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {gymOccupancy > 70 ? "Busy" : gymOccupancy > 40 ? "Moderate" : "Light"}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{gymOccupancy}/100</div>
              <Progress value={gymOccupancy} className="h-2 bg-gray-800">
                <div className={`h-full rounded-full transition-all duration-500 ${
                  gymOccupancy > 70 
                    ? "bg-gradient-to-r from-red-400 to-red-500" 
                    : gymOccupancy > 40 
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                      : "bg-gradient-to-r from-green-400 to-emerald-400"
                }`} />
              </Progress>
              <p className="text-xs text-gray-400 mt-2">
                Peak hours: 6-8 PM | Best time: 2-4 PM
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Calendar */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Attendance Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-gray-400 text-sm font-medium p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isPresent = Math.random() > 0.3; // Mock attendance data
              const isToday = day === 15;
              
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isToday
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : isPresent
                        ? "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                        : "bg-gray-800/40 text-gray-500 hover:bg-gray-700/40"
                  }`}
                >
                  {day}
                  {isPresent && !isToday && (
                    <div className="absolute w-1 h-1 bg-green-400 rounded-full mt-4"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
              <span className="text-gray-300">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800/40 rounded"></div>
              <span className="text-gray-300">Absent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <span className="text-gray-300">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
