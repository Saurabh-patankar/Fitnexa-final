
import { CheckCircle, Zap, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built with performance in mind. Experience blazing-fast load times and smooth interactions."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your data is protected with the highest standards."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team using our advanced collaboration tools and features."
    }
  ];

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Us?</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We combine innovation with reliability to deliver exceptional results that exceed expectations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Business?
              </h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-300" />
                  <span className="text-lg">99.9% Uptime Guarantee</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-300" />
                  <span className="text-lg">24/7 Expert Support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-300" />
                  <span className="text-lg">30-Day Money Back</span>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <div className="text-5xl md:text-6xl font-bold mb-4">10K+</div>
              <div className="text-xl opacity-90">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
