
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Heart,
  Trophy,
  Star,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  Award,
  Flame
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

interface Buddy {
  id: string;
  name: string;
  level: number;
  compatibility: number;
  workoutStyle: string;
  goals: string[];
  avatar: string;
}

export const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const posts: Post[] = [
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "👩‍💼",
      content: "Just hit a new PR on deadlifts! 🎉 185lbs x 5 reps. The form correction AI really helped me perfect my technique. Feeling stronger every day!",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      category: "Achievement"
    },
    {
      id: "2",
      author: "Mike Rodriguez",
      avatar: "🧔‍♂️",
      content: "Week 3 of my transformation journey. The progress tracker is incredible - seeing 8% fat loss already! Who else is tracking their photos?",
      image: "progress-photo.jpg",
      likes: 45,
      comments: 12,
      timestamp: "4 hours ago",
      category: "Progress"
    },
    {
      id: "3",
      author: "Emma Wilson",
      avatar: "👩‍🔬",
      content: "Looking for a workout buddy for morning sessions (6-8 AM). Love cardio and strength training. Who's in? 💪",
      likes: 18,
      comments: 15,
      timestamp: "6 hours ago",
      category: "Buddy Request"
    }
  ];

  const buddyMatches: Buddy[] = [
    {
      id: "1",
      name: "Alex Johnson",
      level: 12,
      compatibility: 94,
      workoutStyle: "Strength Training",
      goals: ["Muscle Gain", "Weight Loss"],
      avatar: "🏋️‍♂️"
    },
    {
      id: "2",
      name: "Lisa Park",
      level: 8,
      compatibility: 87,
      workoutStyle: "HIIT & Cardio",
      goals: ["Endurance", "Fat Loss"],
      avatar: "🏃‍♀️"
    },
    {
      id: "3",
      name: "David Kim",
      level: 15,
      compatibility: 82,
      workoutStyle: "Powerlifting",
      goals: ["Strength", "Competition"],
      avatar: "💪"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Emma Wilson", xp: 15420, streak: 28, badge: "🏆" },
    { rank: 2, name: "Alex Johnson", xp: 14850, streak: 25, badge: "🥈" },
    { rank: 3, name: "Sarah Chen", xp: 14320, streak: 22, badge: "🥉" },
    { rank: 4, name: "You", xp: 12450, streak: 18, badge: "⭐" },
    { rank: 5, name: "Mike Rodriguez", xp: 11890, streak: 15, badge: "🔥" }
  ];

  const handleNewPost = () => {
    if (newPostContent.trim()) {
      // Add new post logic
      setNewPostContent("");
      setShowNewPost(false);
    }
  };

  return (
    <div className="lg:ml-64 p-6 pt-20 lg:pt-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl p-6 border border-pink-500/30 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-white mb-2">Community Hub</h2>
        <p className="text-gray-300">Connect, share, and motivate each other</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-black/40 backdrop-blur-sm rounded-xl p-2 border border-purple-500/30">
        {[
          { id: "feed", label: "Feed", icon: MessageCircle },
          { id: "buddies", label: "Find Buddies", icon: Users },
          { id: "leaderboard", label: "Leaderboard", icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Feed Tab */}
      {activeTab === "feed" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[calc(100vh-200px)]">
          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-full pr-2">
            {/* New Post */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <Button
                    onClick={() => setShowNewPost(true)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800 justify-start"
                  >
                    What's your fitness win today?
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    📸 Photo
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    🏆 Achievement
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    💪 Workout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <Card key={post.id} className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{post.author}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{post.timestamp}</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-200 mb-4 leading-relaxed">{post.content}</p>

                  {post.image && (
                    <div className="mb-4 bg-gray-800 rounded-lg h-48 flex items-center justify-center">
                      <span className="text-gray-400">📸 Progress Photo</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button size="sm" variant="ghost" className="text-gray-300 hover:text-red-400 hover:bg-red-500/10">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-300 hover:text-purple-400">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Posts</span>
                  <span className="text-white font-bold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Likes Received</span>
                  <span className="text-white font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Buddies</span>
                  <span className="text-white font-bold">8</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Trending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {["#TransformationTuesday", "#PRFriday", "#WorkoutBuddy", "#FitnessMotivation"].map((tag) => (
                    <div key={tag} className="text-purple-400 text-sm hover:text-purple-300 cursor-pointer">
                      {tag}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Buddies Tab */}
      {activeTab === "buddies" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by workout style, goals..."
                className="pl-10 bg-black/40 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buddyMatches.map((buddy) => (
              <Card key={buddy.id} className="bg-black/40 border-purple-500/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">{buddy.avatar}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{buddy.name}</h3>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      Level {buddy.level}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400 font-bold">{buddy.compatibility}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-gray-300 text-sm">
                      <strong>Style:</strong> {buddy.workoutStyle}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {buddy.goals.map((goal) => (
                        <Badge key={goal} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <Users className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Weekly Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    user.name === "You"
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                      : "bg-gray-800/40 hover:bg-gray-700/40"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-black">
                      {user.rank}
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name}</div>
                      <div className="text-gray-400 text-sm flex items-center space-x-2">
                        <span>{user.xp.toLocaleString()} XP</span>
                        <span>•</span>
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span>{user.streak} days</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl">{user.badge}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🔥", title: "Fire Starter", desc: "7-day streak" },
                  { icon: "💪", title: "Iron Will", desc: "50 workouts" },
                  { icon: "📸", title: "Progress Pro", desc: "Weekly photos" },
                  { icon: "🤝", title: "Social Butterfly", desc: "5 buddies" },
                  { icon: "⭐", title: "Motivator", desc: "100 likes given" },
                  { icon: "🏆", title: "Champion", desc: "Top 3 weekly" }
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3 text-center group hover:scale-105 transition-transform"
                  >
                    <div className="text-2xl mb-2 group-hover:animate-bounce">{achievement.icon}</div>
                    <div className="text-white text-xs font-medium">{achievement.title}</div>
                    <div className="text-gray-400 text-xs">{achievement.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-black/90 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your fitness journey, achievements, or ask for advice..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
              />
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  📸 Add Photo
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  🏷️ Add Tags
                </Button>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowNewPost(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleNewPost}
                  disabled={!newPostContent.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
