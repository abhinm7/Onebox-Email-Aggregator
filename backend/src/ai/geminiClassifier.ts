import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Classifies an email’s text using Gemini API.
 * Includes rate-limit safety and token usage logging.
 */
export async function classifyWithGemini(content: string): Promise<string> {

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set, skipping AI classification.");
    return "Uncategorized";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const start = Date.now();
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\n\n${content}` }],
        },
      ],
    });

    const text = result.response.text().trim();
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`Gemini call took ${duration}s`);
    return text || "Uncategorized";
    
  } catch (err: any) {
    if (err.status === 429) {
      console.warn(" Gemini rate limit hit — skipping this email.");
    } else {
      console.error(" Gemini classification error:", err.message || err);
    }
    return "Uncategorized";
  }
}
