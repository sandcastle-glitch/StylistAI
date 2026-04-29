import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateImage } from "./hf.js";
import { enhancePrompt } from "./groq.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("User prompt:", prompt);
    console.log("HF key exists:", !!process.env.HF_API_KEY);
    console.log("HF key starts with:", process.env.HF_API_KEY?.slice(0, 3));

    const enhanced = await enhancePrompt(prompt);
    console.log("Enhanced prompt:", enhanced);

    const image = await generateImage(enhanced);
    console.log("Image generated successfully");

    res.json({
      enhanced,
      image,
    });
  } catch (err) {
    console.error("BACKEND ERROR:");
    console.error(err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});