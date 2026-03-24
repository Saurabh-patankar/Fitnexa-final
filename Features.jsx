import AnimatedSection from "./AnimatedSection";

const features = [
    {
      title: "AI Fitness Advisor",
      description: "Get personalized workout and diet guidance using smart AI.",
      icon: "🧠"
    },
    {
      title: "Membership Flexibility",
      description: "Pause, renew, or customize memberships anytime.",
      icon: "📆"
    },
    {
      title: "WhatsApp Receipts",
      description: "Instant payment receipts and notifications via WhatsApp.",
      icon: "🧾"
    },
    {
      title: "Smart Attendance",
      description: "QR + GPS + FaceScan check-ins with streak tracking.",
      icon: "📊"
    },
    {
      title: "In-App Support",
      description: "Live chat with AI or human help for quick resolutions.",
      icon: "💬"
    }
  ];
  
  function Features() {
    return (
        <AnimatedSection>
      <section id="features" className="bg-gray-100 py-16 px-6">
        <h2 className="text-4xl font-bold text-center mb-10">FitNexa Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      </AnimatedSection>
    );
  }
  
  export default Features;
  