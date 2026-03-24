
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="container mx-auto text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Welcome to the Future</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Create Amazing
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Experiences
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into stunning reality with our cutting-edge solutions. 
            Built for modern businesses who demand excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group transition-all duration-300 hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/50">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
                <div className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                <div className="h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
              </div>
              <div className="text-left">
                <div className="h-4 bg-slate-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded mb-3 w-1/2"></div>
                <div className="h-4 bg-blue-200 rounded mb-3 w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
