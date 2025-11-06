import { ImapFlow } from "imapflow";
import dotenv from "dotenv";
dotenv.config();

let client: ImapFlow | null = null;

export async function connectToImap(): Promise<ImapFlow> {
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
