const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        models:['google/gemini-2.0-flash-exp:free','deepseek/deepseek-r1-0528:free'],
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI code assistant. Return only the code in proper Markdown code block. No explanation.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // optional
          "X-Title": "Syncode Copilot",
        },
      }
    );

    const output = response.data.choices?.[0]?.message?.content;
    res.json({ output });
  } catch (error) {
    console.error("Copilot error:", error.response?.data || error.message);
    res.status(500).json({ error: "Code generation failed." });
  }
});

module.exports = router;
