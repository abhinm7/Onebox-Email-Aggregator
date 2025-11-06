import { connectToImap } from "./imapClient";
import { processAndStoreEmail } from "./processEmail";

export async function fetchLastEmails() {
  const imap = await connectToImap();
  await imap.mailboxOpen("INBOX");

  // Adjust range for development (10 days)
  const since = new Date();
  since.setDate(since.getDate() - 10);

  console.log(`📅 Fetching emails since: ${since.toDateString()}`);

  const searchCriteria = { since };
  const messages: number[] | false = await imap.search(searchCriteria);

  if (!messages || messages.length === 0) {
    console.log("📭 No emails found from the last 10 days.");
    return;
  }

    console.log(`⚙️ Development mode: limiting to 10 most recent emails.`);
    messages.splice(0, messages.length - 10);
  

  console.log(`📬 Processing ${messages.length} emails...`);

  for await (const message of imap.fetch(messages, { envelope: true, source: true })) {
    await processAndStoreEmail(message);
  }
}
