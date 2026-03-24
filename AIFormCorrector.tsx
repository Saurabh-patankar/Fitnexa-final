
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  Play,
  Pause,
  RotateCcw,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export const AIFormCorrector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentExercise, setCurrentExercise] = useState("Squat");
  const [repCount, setRepCount] = useState(0);
  const [postureScore, setPostureScore] = useState(85);
  const [showFeedback, setShowFeedback] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exercises = ["Squat", "Push-up", "Deadlift", "Plank", "Bicep Curl"];
  
  const postureAnalysis = {
    kneeAlignment: { score: 90, status: "good", message: "Knees tracking well over toes" },
    backPosition: { score: 75, status: "warning", message: "Slight forward lean detected" },
    hipDepth: { score: 95, status: "excellent", message: "Perfect hip depth achieved" },
    footPlacement: { score: 80, status: "good", message: "Feet could be slightly wider" }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "good": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "warning": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "poor": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate rep counting
    const interval = setInterval(() => {
      setRepCount(prev => prev + 1);
      // Beep animation simulation
    }, 3000);
    
    // Stop after 30 seconds for demo
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(interval);
    }, 30000);
  };

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">AI Form Corrector</h2>
        <p className="text-gray-300">Real-time posture analysis and form correction using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Camera Feed */}
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>Live Analysis</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <select 
                  value={currentExercise}
                  onChange={(e) => setCurrentExercise(e.target.value)}
                  className="bg-gray-800 text-white text-sm rounded border border-gray-600 px-2 py-1"
                >
                  {exercises.map(exercise => (
                    <option key={exercise} value={exercise}>{exercise}</option>
                  ))}
                </select>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
                  {currentExercise}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera viewport */}
            <div className="relative aspect-video bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
              
              {/* Skeleton overlay simulation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Simple stick figure representation */}
                  <div className="w-2 h-8 bg-cyan-400 rounded-full mx-auto mb-2"></div>
                  <div className="w-12 h-2 bg-cyan-400 rounded-full mb-2"></div>
                  <div className="w-2 h-12 bg-cyan-400 rounded-full mx-auto mb-2"></div>
                  <div className="flex justify-center space-x-4">
                    <div className="w-2 h-8 bg-cyan-400 rounded-full"></div>
                    <div className="w-2 h-8 bg-cyan-400 rounded-full"></div>
                  </div>
                  
                  {/* Pose points */}
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                  <div className="absolute top-8 left-1/2 w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                </div>
              </div>

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-red-500/30">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-300 text-sm font-medium">Recording</span>
                </div>
              )}

              {/* Rep counter */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-500/30">
                <div className="text-cyan-300 text-sm">Reps</div>
                <div className="text-2xl font-bold text-white">{repCount}</div>
              </div>

              {/* Posture score */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-500/30">
                <div className="text-cyan-300 text-sm">Form Score</div>
                <div className={`text-2xl font-bold ${getScoreColor(postureScore)}`}>
                  {postureScore}%
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                }`}
              >
                {isRecording ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Analysis
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>

              <Button
                onClick={() => setRepCount(0)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  // Handle file upload for analysis
                  console.log("File uploaded for analysis");
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="space-y-6">
          {/* Real-time Feedback */}
          {showFeedback && (
            <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span>Real-time Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-300 font-medium">Form Adjustment</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Keep your chest up and engage your core. Slightly wider stance recommended.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-medium">Good Form!</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Excellent depth achieved. Maintain this position for optimal results.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Analysis */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Posture Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(postureAnalysis).map(([key, analysis]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}%
                      </span>
                      <Badge className={`text-xs border ${getStatusColor(analysis.status)}`}>
                        {analysis.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={analysis.score} className="h-2 bg-gray-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        analysis.score >= 90 
                          ? "bg-gradient-to-r from-green-400 to-emerald-400"
                          : analysis.score >= 70
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                            : "bg-gradient-to-r from-red-400 to-red-500"
                      }`}
                    />
                  </Progress>
                  <p className="text-gray-400 text-xs">{analysis.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievement */}
          {postureScore >= 95 && (
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm animate-pulse">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Perfect Form! 🎉</h3>
                <p className="text-gray-300 text-sm">
                  Outstanding technique! Keep up the excellent work.
                </p>
                {/* Confetti effect would be triggered here */}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
