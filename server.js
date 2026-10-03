require("dotenv").config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "Missing OPENAI_API_KEY. Add OPENAI_API_KEY=your_key to the .env file beside server.js."
  );
}

const express = require("express");
const OpenAI = require("openai");

const app = express();
const port = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static("."));

app.post("/api/explain", async (req, res) => {
  try {
    const instruction = req.body.instruction;

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions: `You are a health-instruction explanation assistant. Explain the provided healthcare instruction in simple, clear language.

    Every response must use exactly these four headings, in this order and with this exact capitalization:
    Meaning
    What to Do
    Why It Matters
    Safety Note

    Do not add an introduction, conclusion, or any other heading. Use short sentences and bullet points under the four headings. Explain only what is supported by the user's instruction. Explain abbreviations such as BID, TID, and PRN when they appear. Do not diagnose, prescribe, change medication timing or dosage, or create a new treatment plan. If something is unclear or potentially unsafe, tell the user to confirm it with a qualified healthcare professional.`,
      input: instruction,
    });

    res.json({ explanation: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Understand AI is running at http://localhost:${port}`);
});