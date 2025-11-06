import dotenv from "dotenv";
import { keywordContentClassify } from "./ruleBasedClassifier";
import { classifyWithGemini } from "./geminiClassifier";
import axios from "axios";

dotenv.config();

/**
 * Categorizes an email into 5 classes using rule-based detection or Gemini API.
 * Includes retry & backoff for Gemini 429 errors and safe fallback.
 */

export async function categorizeEmail(subject: string, body?: string) {
  const content = `${subject} ${body || ""}`.toLowerCase();

  // quick rule-based categorization first
  const ruleCategory = keywordContentClassify(content);
  if (ruleCategory && ruleCategory !== "Uncategorized") {
    return ruleCategory;
  }

  // quick AI Categorization with Retry Logic
  const maxRetries = 3;
  const baseDelay = 1500; // 1.5s base wait between retries
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Add a small delay before every Gemini call (even first one)
      await sleep(800 + Math.random() * 500); // 0.8–1.3s
      const aiCategory = await classifyWithGemini(content);
      if (aiCategory) return aiCategory;

      // If Gemini returns undefined/null
      return "Uncategorized";
    } catch (err: any) {
      attempt++;

      // Handle Gemini API rate limits
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        const waitTime = baseDelay * Math.pow(2, attempt); // exponential backoff
        console.warn(
          `Gemini rate limit hit (attempt ${attempt}/${maxRetries}). Retrying in ${waitTime}ms...`
        );
        await sleep(waitTime);
        continue;
      }
      // Handle other network or unknown errors
      console.error("AI categorization failed:", err.message || err);
      break;
    }
  }
  // Final fallback
  return "Uncategorized";
}

// Helper sleep
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
