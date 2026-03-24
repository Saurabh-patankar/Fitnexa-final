const express = require("express");
const router = express.Router();
const axios = require("axios");

const apiKey = process.env.OPENROUTER_API_KEY;

// 🎯 AI FITNESS ADVICE
router.post("/advice", async (req, res) => {
  const { message } = req.body;
  console.log("📩 AI Advice Request:", message);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `
You are a professional AI Fitness Advisor. Your job is to only answer questions related to:
- workouts
- exercise planning
- diet and nutrition
- muscle recovery
- injuries and rehab
- general gym guidance

❌ If the user asks anything unrelated (like politics, tech, random trivia, jokes), respond with:
"I'm here to help only with fitness-related advice. Let's get back to your health goals!"

Never break character or respond to unrelated queries.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "FitNexa",
        },
      }
    );

    console.log("✅ AI Response:", response.data);
    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenRouter Advice Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI failed to respond" });
  }
});

// 🍽️ AI MEALPLAN GENERATOR
router.post("/mealplan", async (req, res) => {
  const { remaining } = req.body;
  console.log("📥 MealPlan Request:", remaining);
  if (!remaining || typeof remaining.protein !== "number") {
    return res.status(400).json({ message: "Invalid input data", remaining });
  }

  const prompt = `
Given the remaining macros: 
Protein: ${remaining.protein}g, Carbs: ${remaining.carbs}g, Fats: ${remaining.fats}g, 
suggest a single meal that would closely match these targets.

Also give an estimated macro breakdown like this:

Meal: Grilled chicken with rice and veggies  
Protein: 40g  
Carbs: 60g  
Fats: 15g  
Calories: 550

Return only in this exact format.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a fitness nutritionist assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "FitNexa",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    console.log("✅ AI MealPlan Response:", content);

    const match = content.match(/Meal:\s*(.+)\s+Protein:\s*(\d+)\w*\s+Carbs:\s*(\d+)\w*\s+Fats:\s*(\d+)\w*\s+Calories:\s*(\d+)/i);

if (!match) {
  console.error("⚠️ AI response didn't match expected format:", content);
  return res.status(400).json({ message: "AI response format invalid", suggestion: content });
}

const [_, meal, protein, carbs, fats, calories] = match;

res.json({
  suggestion: meal.trim(),
  protein: Number(protein),
  carbs: Number(carbs),
  fats: Number(fats),
  calories: Number(calories),
});
  } catch (err) {
    console.error("❌ OpenRouter MealPlan Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI meal plan failed" });
  }
});

// 🧪 NUTRITION ANALYSIS
router.post("/nutritionanalysis", async (req, res) => {
  const { entries } = req.body;
  console.log("📥 Nutrition Analysis Entries:", entries);

  const formatted = entries
    .map(
      (e) =>
        `• ${e.title}: ${e.description} — ${e.calories} kcal, Protein ${e.protein}g, Carbs ${e.carbs}g, Fats ${e.fats}g`
    )
    .join("\n");

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `
You're a certified dietitian and fitness advisor.

You will receive a list of food entries from a user's daily log. Each item includes macros. Analyze the overall balance and give 2-3 helpful tips.

Keep it brief, friendly, and focused on fitness goals (like protein balance, fiber, calorie limits). Avoid being too medical.`,
          },
          {
            role: "user",
            content: `Here is today's food log:\n\n${formatted}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "FitNexa",
        },
      }
    );

    console.log("✅ AI Nutrition Analysis Response:", response.data);
    res.json({ analysis: response.data.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenRouter Analysis Error:", err.response?.data || err.message);
    res.status(500).json({ message: "AI analysis failed" });
  }
});

module.exports = router;