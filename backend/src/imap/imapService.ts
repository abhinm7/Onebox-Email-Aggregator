import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { categorizeEmail } from "../ai/emailCategorizer";
import { notifyInterestedEmail } from "../utils/notifier";
import { storeEmailInSearch } from "../search/storeEmail";
import { cleanEmailBody } from "../lib/emailParser";
import dotenv from "dotenv";

dotenv.config();

let client: ImapFlow | null = null;

// --- Connect once and reuse ---
export async function connectToImap() {
    if (client) return client;

    client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
        logger: false,
    });

    await client.connect();
    console.log("✅ Connected to Gmail IMAP");

    return client;
}

// --- Initial Fetch for Last 30 Days ---
export async function fetchLast30DaysEmails() {
    const imap = await connectToImap();
    await imap.mailboxOpen("INBOX");

    const since = new Date();
    since.setDate(since.getDate() - 30);

    console.log(`📅 Fetching emails since: ${since.toDateString()}`);

    const searchCriteria = {
        since,
    };

    const messages: number[] | false = await imap.search(searchCriteria);

    if (!messages || messages.length === 0) {
        console.log("No emails found from the last 30 days.");
        return;
    }

    console.log(`Found ${messages.length} emails from the last 30 days.`);

    for await (const message of imap.fetch(messages, { envelope: true, source: true })) {
        if (!message.envelope || !message.source) continue;

        const from = message.envelope.from?.[0]?.address || "(unknown)";
        const subject = message.envelope.subject || "(No Subject)";
        const date = message.envelope.date || new Date();

        const parsed = await simpleParser(message.source);
        const text = typeof parsed.text === "string" ? parsed.text.trim() : "";
        const html = typeof parsed.html === "string" ? parsed.html.trim() : "";
        const rawText = text || html || undefined;
        const body = cleanEmailBody(rawText);

        const category = await categorizeEmail(subject, body);
        await storeEmailInSearch({
            from,
            subject,
            body,
            date: date.toISOString(),
            category,
            account: process.env.EMAIL_USER || "gmail",
            folder: "INBOX",
        });

        if (category === "Interested" && process.env.WEBHOOK_URL) {
            notifyInterestedEmail({ from, subject, category, body });
        }

        console.log(`📨 Indexed email: ${subject} (${category})`);
    }
}

// --- Real-time Listener ---
export async function startIdleMode() {
    const imap = await connectToImap();
    await imap.mailboxOpen("INBOX");

    console.log("🟢 IMAP Idle mode started (listening for new emails...)");

    imap.on("exists", async () => {
        try {
            if (!imap.mailbox) return;

            const total = imap.mailbox.exists;
            console.log(`New email detected (Total count: ${total})`);

            const sequence = `${total}:*`;
            
            for await (const message of imap.fetch(sequence, { envelope: true, source: true })) {
                if (!message.envelope || !message.source) continue;

                const from = message.envelope.from?.[0]?.address || "(unknown)";
                const subject = message.envelope.subject || "(No Subject)";
                const date = message.envelope.date || new Date();

                const parsed = await simpleParser(message.source);
                const text = typeof parsed.text === "string" ? parsed.text.trim() : "";
                const html = typeof parsed.html === "string" ? parsed.html.trim() : "";
                const rawText = text || html || undefined;
                const body = cleanEmailBody(rawText);

                console.log(`📨 New incoming email: ${subject}`);

                const category = await categorizeEmail(subject, body);
                console.log("🧠 Category:", category);

                await storeEmailInSearch({
                    from,
                    subject,
                    body,
                    date: date.toISOString(),
                    category,
                    account: process.env.EMAIL_USER || "gmail",
                    folder: "INBOX",
                });

                if (category === "Interested" && process.env.WEBHOOK_URL) {
                    notifyInterestedEmail({ from, subject, category, body });
                }
            }
        } catch (err) {
            console.error("⚠️ Error processing new mail:", err);
        }
    });

    await imap.idle();
}
