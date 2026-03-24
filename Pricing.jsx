import AnimatedSection from "./AnimatedSection";

function PricingPlans() {
    const plans = [
      {
        name: "Basic",
        price: "₹499",
        features: ["Gym Access", "1 Trainer Session", "Progress Tracker"],
        button: "Get Started",
      },
      {
        name: "Pro",
        price: "₹999",
        features: ["Gym + Cardio Access", "Weekly Trainer Guidance", "Custom Diet Plans", "Progress Reports"],
        button: "Join Pro",
      },
      {
        name: "Elite",
        price: "₹1999",
        features: ["All Access + VIP Support", "Unlimited Sessions", "Smart AI Tracking", "Health Reports", "24x7 Chat Support"],
        button: "Go Elite",
      },
    ];
  
    return (
        <AnimatedSection>
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 dark:bg-gray-900" id="pricing">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Simple pricing for every level of fitness enthusiast
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="border rounded-2xl p-6 shadow-lg bg-gray-50 dark:bg-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-pink-600">{plan.price}/mo</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {plan.features.map((feature, index) => (
                  <li key={index}>✅ {feature}</li>
                ))}
              </ul>
              <button className="mt-6 w-full bg-pink-600 text-white py-2 rounded-xl hover:bg-pink-700">
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
     </AnimatedSection>
    );
  }
  
  export default PricingPlans;
  