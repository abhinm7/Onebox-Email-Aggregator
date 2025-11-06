import axios from "axios";
import { prompt } from "./prompt";
import { log } from "console";

export const classifyWithGemini = async (content: string) => {
    const api_key = process.env.GEMINI_API_KEY;
    if (!api_key) return "Uncategorized";

    try {``
        const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`,
            { contents: [{ parts: [{ text: prompt + content }] }] }
        );
        const category = res.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Uncategorized";
        if(category!="Uncategorized"){
            console.log("gemini call")
        }
        return category;
    } catch (err) {
        console.error("AI categorization failed:", err instanceof Error ? err.message : err);
        return "Uncategorized";
    }
};
