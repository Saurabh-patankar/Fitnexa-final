
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Dumbbell,
  Coffee,
  CheckCircle
} from "lucide-react";

interface WorkoutSet {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
  restTime: number;
  completed: boolean;
}

export const WorkoutTimer = () => {
  const [currentTime, setCurrentTime] = useState(60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [restDurations] = useState([30, 60, 90, 120, 180]);
  const [selectedRestTime, setSelectedRestTime] = useState(60);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const workoutSets: WorkoutSet[] = [
    { id: "1", exercise: "Bench Press", reps: 12, weight: 185, restTime: 90, completed: false },
    { id: "2", exercise: "Incline Dumbbell Press", reps: 10, weight: 65, restTime: 75, completed: false },
    { id: "3", exercise: "Chest Flyes", reps: 12, weight: 35, restTime: 60, completed: false },
    { id: "4", exercise: "Push-ups", reps: 15, weight: 0, restTime: 45, completed: false },
  ];

  const [sets, setSets] = useState(workoutSets);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (soundEnabled) {
      // Play completion sound
      playNotificationSound();
    }
    
    // Mark current set as completed
    const updatedSets = [...sets];
    if (updatedSets[currentSetIndex]) {
      updatedSets[currentSetIndex].completed = true;
      setSets(updatedSets);
    }

    // Show completion animation
    setTimeout(() => {
      if (currentSetIndex < sets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
        setTimeRemaining(sets[currentSetIndex + 1]?.restTime || 60);
      }
    }, 2000);
  };

  const playNotificationSound = () => {
    // Simulate sound - in real app, this would play an actual audio file
    console.log("🔊 Timer complete!");
  };

  const startTimer = (duration?: number) => {
    const time = duration || selectedRestTime;
    setCurrentTime(time);
    setTimeRemaining(time);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(currentTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentTime - timeRemaining) / currentTime) * 100;
  };

  const currentSet = sets[currentSetIndex];
  const completedSets = sets.filter(set => set.completed).length;

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl p-6 border border-orange-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">Workout Timer</h2>
        <p className="text-gray-300">Smart rest timer with audio and visual cues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timer Display */}
        <Card className="bg-black/40 border-orange-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Timer className="w-5 h-5" />
                <span>Rest Timer</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Timer Display */}
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgb(75, 85, 99)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#timerGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={552.64}
                    strokeDashoffset={552.64 * (1 - getProgressPercentage() / 100)}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-orange-300 text-sm">
                      {isActive ? "Rest Time" : "Ready"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer completed animation */}
              {timeRemaining === 0 && (
                <div className="animate-bounce">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Rest Complete!</h3>
                  <p className="text-gray-300">Ready for your next set</p>
                </div>
              )}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() => startTimer()}
                disabled={isActive}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
              
              <Button
                onClick={pauseTimer}
                disabled={!isActive}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              
              <Button
                onClick={resetTimer}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Quick Timer Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {restDurations.map((duration) => (
                <Button
                  key={duration}
                  size="sm"
                  variant={selectedRestTime === duration ? "default" : "outline"}
                  onClick={() => {
                    setSelectedRestTime(duration);
                    if (!isActive) {
                      setTimeRemaining(duration);
                      setCurrentTime(duration);
                    }
                  }}
                  className={
                    selectedRestTime === duration
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {duration < 60 ? `${duration}s` : `${duration / 60}m`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout Progress */}
        <div className="space-y-6">
          {/* Current Set */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Dumbbell className="w-5 h-5" />
                <span>Current Set</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentSet ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{currentSet.exercise}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Reps:</span>
                        <span className="text-white font-bold ml-2">{currentSet.reps}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-white font-bold ml-2">
                          {currentSet.weight > 0 ? `${currentSet.weight}lbs` : "Bodyweight"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Set Progress</span>
                    <span className="text-purple-400 font-bold">
                      {currentSetIndex + 1} of {sets.length}
                    </span>
                  </div>
                  <Progress value={((currentSetIndex + 1) / sets.length) * 100} className="h-2 bg-gray-800">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                  </Progress>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">Workout Complete! 🎉</h3>
                  <p className="text-gray-300">Great job finishing all sets!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workout Overview */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Today's Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sets.map((set, index) => (
                  <div
                    key={set.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                      index === currentSetIndex
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                        : set.completed
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-gray-800/40 border border-gray-600/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {set.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : index === currentSetIndex ? (
                        <div className="w-5 h-5 bg-purple-400 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                      )}
                      <div>
                        <div className={`font-medium ${set.completed ? "text-green-300" : "text-white"}`}>
                          {set.exercise}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {set.reps} reps × {set.weight > 0 ? `${set.weight}lbs` : "bodyweight"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Coffee className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{set.restTime}s</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-purple-400 font-bold">
                    {completedSets} / {sets.length} sets completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-black/90 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-white">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-2">Default Rest Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {restDurations.map((duration) => (
                    <Button
                      key={duration}
                      size="sm"
                      variant={selectedRestTime === duration ? "default" : "outline"}
                      onClick={() => setSelectedRestTime(duration)}
                      className={
                        selectedRestTime === duration
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800"
                      }
                    >
                      {duration < 60 ? `${duration}s` : `${duration / 60}m`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sound Notifications</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`border-gray-600 ${
                    soundEnabled ? "text-green-400 hover:bg-green-500/10" : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>

              <Button
                onClick={() => setShowSettings(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
