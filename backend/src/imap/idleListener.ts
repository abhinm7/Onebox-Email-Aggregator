import { connectToImap } from "./imapClient";
import { processAndStoreEmail } from "./processEmail";
import { AccountConfig } from "./types";

export async function startIdleMode(account: AccountConfig) {
  const imap = await connectToImap(account);
  await imap.mailboxOpen("INBOX");

  console.log("IMAP Idle mode started (listening for new emails...)");

  imap.on("exists", async () => {
    try {
      if (!imap.mailbox) return;
      const total = imap.mailbox.exists;

      console.log(`New email detected (Total count: ${total})`);

      const sequence = `${total}:*`;
      for await (const message of imap.fetch(sequence, { envelope: true, source: true })) {
        await processAndStoreEmail(message, account.id);
      }
    } catch (err) {
      console.error("Error processing new mail:", err);
    }
  });

  await imap.idle();
}
