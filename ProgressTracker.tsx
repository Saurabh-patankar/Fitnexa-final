
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Calendar,
  TrendingUp,
  User,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface ProgressPhoto {
  id: string;
  date: string;
  type: "front" | "side" | "back";
  url: string;
  analysis: {
    muscleGain: number;
    fatLoss: number;
    postureScore: number;
    verified: boolean;
  };
}

export const ProgressTracker = () => {
  const [selectedView, setSelectedView] = useState("front");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [identityWarning, setIdentityWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progressPhotos: ProgressPhoto[] = [
    {
      id: "1",
      date: "2024-01-01",
      type: "front",
      url: "/placeholder-photo.jpg",
      analysis: {
        muscleGain: 85,
        fatLoss: 72,
        postureScore: 88,
        verified: true
      }
    },
    {
      id: "2",
      date: "2024-01-08",
      type: "front",
      url: "/placeholder-photo.jpg",
      analysis: {
        muscleGain: 87,
        fatLoss: 75,
        postureScore: 90,
        verified: true
      }
    },
    {
      id: "3",
      date: "2024-01-15",
      type: "front",
      url: "/placeholder-photo.jpg",
      analysis: {
        muscleGain: 90,
        fatLoss: 78,
        postureScore: 92,
        verified: true
      }
    }
  ];

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate face recognition check
      setTimeout(() => {
        const isVerified = Math.random() > 0.2; // 80% success rate for demo
        if (!isVerified) {
          setIdentityWarning(true);
          setTimeout(() => setIdentityWarning(false), 5000);
        } else {
          // Process and add photo
          console.log("Photo verified and processed");
          setShowUpload(false);
        }
      }, 2000);
    }
  };

  const views = ["front", "side", "back"];
  const currentPhotos = progressPhotos.filter(photo => photo.type === selectedView);

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl p-6 border border-indigo-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">Progress Selfie Tracker</h2>
        <p className="text-gray-300">Track your transformation with AI-powered analysis</p>
      </div>

      {/* Identity Warning */}
      {identityWarning && (
        <Card className="bg-red-500/20 border-red-500/30 backdrop-blur-sm animate-bounce">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
              <div>
                <h3 className="text-red-300 font-bold">Identity Verification Failed</h3>
                <p className="text-red-200 text-sm">
                  Face not recognized. Please ensure you're the account holder taking the photo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Photo Timeline */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Progress Timeline</CardTitle>
              <div className="flex space-x-2">
                {views.map((view) => (
                  <Button
                    key={view}
                    size="sm"
                    variant={selectedView === view ? "default" : "outline"}
                    onClick={() => setSelectedView(view)}
                    className={
                      selectedView === view
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Photo Carousel */}
            <div className="relative">
              <div className="aspect-[3/4] bg-gray-900 rounded-lg border-2 border-gray-700 overflow-hidden">
                {currentPhotos.length > 0 ? (
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl">📸</div>
                    </div>
                    
                    {/* Photo overlay info */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-500/30">
                      <div className="text-purple-300 text-xs">
                        {new Date(currentPhotos[currentPhotoIndex]?.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {currentPhotos[currentPhotoIndex]?.analysis.verified ? (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-yellow-400" />
                        )}
                        <span className="text-xs text-gray-300">
                          {currentPhotos[currentPhotoIndex]?.analysis.verified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Navigation arrows */}
                    {currentPhotos.length > 1 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                          disabled={currentPhotoIndex === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => setCurrentPhotoIndex(Math.min(currentPhotos.length - 1, currentPhotoIndex + 1))}
                          disabled={currentPhotoIndex === currentPhotos.length - 1}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No photos yet</p>
                      <p className="text-gray-500 text-sm">Upload your first {selectedView} view photo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo indicators */}
              {currentPhotos.length > 1 && (
                <div className="flex justify-center space-x-2 mt-3">
                  {currentPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentPhotoIndex ? "bg-purple-400" : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <Button
              onClick={() => setShowUpload(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Photo
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="space-y-6">
          {/* Progress Metrics */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Progress Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPhotos.length > 0 && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Muscle Gain</span>
                      <span className="text-green-400 font-bold">
                        {currentPhotos[currentPhotoIndex]?.analysis.muscleGain}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentPhotos[currentPhotoIndex]?.analysis.muscleGain}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Fat Loss</span>
                      <span className="text-blue-400 font-bold">
                        {currentPhotos[currentPhotoIndex]?.analysis.fatLoss}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentPhotos[currentPhotoIndex]?.analysis.fatLoss}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Posture Score</span>
                      <span className="text-purple-400 font-bold">
                        {currentPhotos[currentPhotoIndex]?.analysis.postureScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentPhotos[currentPhotoIndex]?.analysis.postureScore}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Photo Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300">This Week</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      Complete ✓
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">3/3 angles captured</p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-300">Next Week</span>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Reminder set for Jan 22</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identity Verification */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Identity Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-green-300 font-medium">Account Verified</div>
                  <div className="text-gray-400 text-sm">
                    Face recognition active for photo validation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-black/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Upload Progress Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">
                  Upload {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Face recognition will verify your identity automatically
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={() => setShowUpload(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
