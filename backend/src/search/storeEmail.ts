import { elasticClient } from "../configs/elasticClient";
import { EmailDocument } from "../imap/types";
import crypto from "crypto";

export async function storeEmailInSearch(email: EmailDocument): Promise<void> {
  // Create stable unique ID — message-id preferred, else hash fallback
  const uniqueId =
    email.messageId ||
    crypto.createHash("sha256").update(email.subject + email.date + email.from).digest("hex");

  await elasticClient.index({
    index: "emails",
    id: uniqueId,
    document: email,
  });
}
