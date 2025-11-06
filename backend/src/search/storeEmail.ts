import { elasticClient } from "../configs/elasticClient";

interface EmailDocument {
  from: string;
  subject: string;
  body: string;
  date: string;
  category: string;
  account: string;
  folder: string;
}

export async function storeEmailInSearch(email: EmailDocument) {
  await elasticClient.index({
    index: "emails",
    id: `${email.subject}_${email.date}`, // unique per email
    document: email,
  });

  console.log(`📨 Indexed email: ${email.subject} (${email.category})`);
}
