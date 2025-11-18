// ai-backend/server.js
// Backend API for FitMind-style AI chat. This is YOUR part of the team project.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());           // allow requests from frontend
app.use(express.json());   // parse JSON bodies

// --- OpenAI client ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple health-check route
app.get("/", (req, res) => {
  res.send("FitMind-style AI backend is running ✅");
});

// MAIN AI ROUTE
// POST /api/chat
// body: { "message": "user text" }
// response: { "reply": "ai text" }
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message is required and must be a string." });
    }

    // System prompt: fitness-focused, like FitMind AI
    const systemPrompt = `
      You are FitMind AI, a fitness-focused chatbot.
      - Help with workouts, training plans, reps/sets, and exercise technique.
      - Give nutrition and diet guidance for different body goals.
      - Provide motivation, mindset tips, and habit-building advice.
      - Keep answers under 200 words, clear and beginner-friendly.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 400 // ~200 words
    });

    const aiReply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Something went wrong while talking to the AI.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`FitMind-style AI backend listening on port ${PORT}`);
});
