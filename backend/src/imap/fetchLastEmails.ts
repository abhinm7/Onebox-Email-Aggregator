import { connectToImap } from "./imapClient";
import { processAndStoreEmail } from "./processEmail";
import { AccountConfig } from "./types";

export async function fetchLastEmails(account: AccountConfig) {
  const imap = await connectToImap(account);

  try {
    await imap.mailboxOpen("INBOX");

    // fetch upto 30 days emails
    const since = new Date();
    since.setDate(since.getDate() - 30);

    console.log(`Fetching emails since: ${since.toDateString()} for account: ${account.id}`);

    const searchCriteria = { since };
    const messages: number[] | false = await imap.search(searchCriteria);

    if (!messages || messages.length === 0) {
      console.log(`No emails found since ${since.toDateString()} for account ${account.id}.`);
      return;
    }

    console.log(`Processing ${messages.length} emails for account: ${account.id}...`);

    for await (const message of imap.fetch(messages, { envelope: true, source: true })) {
      await processAndStoreEmail(message, account.id);
    }
  } catch (error) {
    console.error(`Error during initial fetch for ${account.id}:`, error);
  } finally {
    // Close the connection after the one-time batch job.
    await imap.close();
    console.log(`Connection closed for batch fetch on ${account.id}`);
  }
}