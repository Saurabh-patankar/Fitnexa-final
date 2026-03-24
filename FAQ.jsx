import { useState } from "react";

function FAQ() {
  const faqs = [
    {
      question: "Can I pause my membership anytime?",
      answer: "Yes! You can pause or resume your plan anytime from the dashboard.",
    },
    {
      question: "Do you offer plans for travelers?",
      answer: "Yes, we offer 1-day and 1-week traveler passes.",
    },
    {
      question: "Is there an AI coach included?",
      answer: "Yes, the AI coach helps correct posture and gives custom recommendations.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 bg-gray-100 dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer"
            onClick={() => toggle(index)}
          >
            <h3 className="text-lg font-semibold text-pink-600">{faq.question}</h3>
            {openIndex === index && (
              <p className="text-gray-700 dark:text-gray-300 mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
