import { ImapFlow } from "imapflow";
import dotenv from "dotenv";

dotenv.config();

export async function startImapConnection() {
    const client = new ImapFlow({
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER!,
            pass: process.env.GMAIL_PASS!,
        },
    });

    await client.connect();
    console.log("Connected to Gmail IMAP");

    // Select inbox
    const lock = await client.getMailboxLock("INBOX");
    try {
        console.log("Fetching last 30 days of emails...");
        const since = new Date();
        since.setDate(since.getDate() - 1);

        for await (let message of client.fetch(
            { since },
            { envelope: true, source: true }
        )) {
            if (message.envelope) {
                console.log("From:", message.envelope.from?.[0].address);
                console.log("Subject:", message.envelope.subject,"\n");
                console.log("Date:", message.envelope.date);
            } else {
                console.log("Skipped message without envelope");
            }
        }

    } finally {
        lock.release();
    }

    // Keep connection alive (real-time)
    client.on("exists", (msg) => {
        console.log("New email received!");
    });
}
