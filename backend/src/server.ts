import express from "express";
import dotenv from "dotenv";
import { ImapFlow } from "imapflow";
import { fetchLatestEmails } from "./imap/imapService";
import { createEmailIndex } from "./search/emailIndex";
import searchRoutes from "./routes/searchRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await createEmailIndex();
  } catch (e) {
    console.error("Failed to ensure email index:", e);
  }
})();

const client = new ImapFlow({
  host: "imap.gmail.com",
  port: 993,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
  logger: false, // removed logs for clean terminal
});

app.use('/', searchRoutes)

app.listen(PORT, async () => {
  console.log(`🚀 Server started on port ${PORT}`);
  await client.connect();
  console.log("✅ Connected to Gmail IMAP");
  await fetchLatestEmails(client);
});
