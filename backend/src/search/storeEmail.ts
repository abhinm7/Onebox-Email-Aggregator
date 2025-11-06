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
    document: email,
    // refresh: "wait_for", // uncomment for immediate searchability (slower)
  });
  console.log(`📨 Indexed email: ${email.subject} (${email.category})`);
}
