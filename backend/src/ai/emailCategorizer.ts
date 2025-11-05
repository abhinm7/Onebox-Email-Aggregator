import axios from "axios";
import dotenv from "dotenv";
import { keywordContentClassify } from "./ruleBasedClassifier";
import { classifyWithGemini } from "./geminiClassifier";
dotenv.config();

/**
 * Categorizes an email into 5 classes using either simple rules or GeminiAPI.
 */

export async function categorizeEmail(subject: string, body?: string) {
    const content = `${subject} ${body || ""}`.toLowerCase();

    const ruleCategory = keywordContentClassify(content);
    if (ruleCategory && ruleCategory !== "Uncategorized") {
        return ruleCategory;
    }

    try {
        const aiCategory = await classifyWithGemini(content);
        return aiCategory || "Uncategorized";
    } catch (err) {
        if (err instanceof Error) {
            console.error("AI categorization failed:", err.message);
        } else {
            console.error("AI categorization failed:", err);
        }
        return "Uncategorized";
    }
}
