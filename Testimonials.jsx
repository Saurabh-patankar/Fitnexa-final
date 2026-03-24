

import AnimatedSection from "./AnimatedSection";
// src/components/Testimonials.jsx
export default function Testimonials() {
    const testimonials = [
      {
        name: "Ravi Singh",
        feedback: "FitNexa made managing my gym effortless! The QR check-in and trainer calendar are game changers.",
        role: "Gym Owner, Mumbai"
      },
      {
        name: "Aarti Desai",
        feedback: "I love the personalized workout tracking. I never miss a session now!",
        role: "Fitness Enthusiast"
      },
      {
        name: "Imran Sheikh",
        feedback: "AI trainer feedback helped me correct my posture. This is the future of fitness!",
        role: "Student & Powerlifter"
      }
    ];
  
    return (
        <AnimatedSection>
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">What Our Users Say</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <p className="text-gray-700 italic">"{t.feedback}"</p>
              <div className="mt-4 text-sm text-gray-600">
                <strong>{t.name}</strong> <br />
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </section>
      </AnimatedSection>
    );
  }
  