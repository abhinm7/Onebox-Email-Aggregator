import { simpleParser } from "mailparser";
import { categorizeEmail } from "../ai/emailCategorizer";
import { notifyInterestedEmail } from "../utils/notifier";
import { storeEmailInSearch } from "../search/storeEmail";

export async function fetchLatestEmails(client: any) {
    // Open the main INBOX
    const mailbox = await client.mailboxOpen("INBOX");

    const total = mailbox.exists;

    if (total === 0) {
        console.log("No emails found.");
        return;
    }

    // Calculate the range for the last 10 emails
    const rangeStart = Math.max(1, total - 1);
    const sequence = `${rangeStart}:*`;

    console.log(`Fetching last ${total - rangeStart + 1} emails...`);

    for await (const message of client.fetch(sequence, { envelope: true, source: true })) {
        if (!message.envelope) continue;

        const from = message.envelope.from?.[0].address;
        const subject = message.envelope.subject || "";
        const date = message.envelope.date;

        const parsed = await simpleParser(message.source);
        const body =
            parsed.text && typeof parsed.text === "string" && parsed.text.trim()
                ? parsed.text.trim()
                : parsed.html && typeof parsed.html === "string"
                    ? parsed.html.replace(/<[^>]*>?/gm, "").trim()
                    : "(No body)";


        // console.log("\nFrom:", from);
        console.log("Subject:", subject);
        // console.log("Date:", date);
        // console.log("Body:", body.substring(0, 200), "...");

        // AI categorize
        const category = await categorizeEmail(subject, body);
        console.log("Category:", category);

        await storeEmailInSearch({
            from: from || "(unknown)",
            subject,
            body,
            date: (date ?? new Date()).toISOString(),
            category,
            account: process.env.EMAIL_USER || "gmail",
            folder: "INBOX",
        });

        // Optional webhook
        if (category === "Interested" && process.env.WEBHOOK_URL) {
            notifyInterestedEmail({ from, subject, category, body });
            console.log("📡 Webhook sent for Interested email!");
        }

        console.log("");
    }
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    // await sleep(2000); 
}
