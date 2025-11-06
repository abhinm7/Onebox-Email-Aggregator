import { simpleParser } from "mailparser";
import { categorizeEmail } from "../ai/emailCategorizer";
import { notifyInterestedEmail } from "../utils/notifier";
import { storeEmailInSearch } from "../search/storeEmail";
import { cleanEmailBody } from "../lib/emailParser";
import { ImapMessage, EmailDocument } from "./types";

export async function processAndStoreEmail(message: ImapMessage): Promise<void> {
    if (!message.envelope || !message.source) return;   

    const from = message.envelope.from?.[0]?.address || "(unknown)";
    const subject = message.envelope.subject || "(No Subject)";
    const date = message.envelope.date || new Date();

    const parsed = await simpleParser(message.source);
    const messageId = parsed.messageId || undefined;
    const text = typeof parsed.text === "string" ? parsed.text.trim() : "";
    const html = typeof parsed.html === "string" ? parsed.html.trim() : "";
    const rawText = text || html || undefined;
    const body = cleanEmailBody(rawText);

    const category = await categorizeEmail(subject, body);

    const emailData: EmailDocument = {
        from,
        subject,
        body,
        date: date.toISOString(),
        category,
        account: process.env.EMAIL_USER || "gmail",
        folder: "INBOX",
        messageId,
    };

    await storeEmailInSearch(emailData);

    if (category === "Interested" && process.env.WEBHOOK_URL) {
        notifyInterestedEmail({ from, subject, category, body });
    }

    console.log(`📨 Indexed email: ${subject} (${category})`);
}
