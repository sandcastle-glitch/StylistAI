import axios from "axios";

export async function generateImage(prompt) {
  try {
    const response = await axios({
      url: "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      data: {
        inputs: prompt,
      },
      responseType: "arraybuffer",
    });

    const contentType = response.headers["content-type"];

    if (!contentType || !contentType.includes("image")) {
      const text = Buffer.from(response.data).toString("utf8");
      throw new Error(`Hugging Face did not return an image: ${text}`);
    }

    const base64 = Buffer.from(response.data).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    if (error.response?.data) {
      const message = Buffer.from(error.response.data).toString("utf8");
      console.error("HF ERROR:", message);
      throw new Error(message);
    }

    throw error;
  }
}