import { simpleParser } from "mailparser";
import { categorizeEmail } from "../ai/emailCategorizer";
import axios from "axios";

export async function fetchLatestEmails(client: any) {
    // Open the main INBOX
    const mailbox = await client.mailboxOpen("INBOX");

    // Calculate the range for the last 5 emails
    const total = mailbox.exists;

    if (total === 0) {
        console.log("No emails found.");
        return;
    }

    const rangeStart = Math.max(1, total - 50); // last 3 emails
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
        console.log(" Category:", category);

        // Optional webhook
        if (category === "Interested" && process.env.WEBHOOK_URL) {
            // await axios.post(process.env.WEBHOOK_URL, {
            //     from,
            //     subject,
            //     date,
            //     category,
            //     body: body.substring(0, 300),
            // });
            console.log("📡 Webhook sent for Interested email!");
        }

        console.log("──────────────────────────────");
    }
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    // await sleep(2000); 
}
