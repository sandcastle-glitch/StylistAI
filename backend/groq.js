import axios from "axios";

export async function enhancePrompt(prompt) {
  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an expert fashion stylist AI.

Your job is to convert a user request into a detailed fashion image prompt.

Rules:
- Consider the event and context
- Match appropriate style (formal, casual, conservative, etc.)
- Describe outfit clearly (top, bottom, shoes, accessories)
- Include mood, lighting, and setting
- Keep it under 80 words
- Output ONLY the final image prompt

Example:
Input: "coffee date"
Output: "A stylish woman wearing a beige trench coat, white blouse, fitted jeans, and ankle boots, sitting in a cozy outdoor café, warm sunlight, soft depth of field, editorial fashion photography, realistic, 4k"
`
        },
        {
          role: "user",
          content: `Create a fashion image prompt for: ${prompt}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.choices[0].message.content.trim();
}