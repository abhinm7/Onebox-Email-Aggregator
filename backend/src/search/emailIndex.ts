import { elasticClient } from "../configs/elasticClient";

export async function createEmailIndex() {
  try {
    const exists = await elasticClient.indices.exists({ index: "emails" });

    if (!exists) {
      await elasticClient.indices.create({
        index: "emails",
        mappings: {
          properties: {
            from: { type: "keyword" },
            subject: { type: "text" },
            body: { type: "text" },
            date: { type: "date" },
            category: { type: "keyword" },
            account: { type: "keyword" },
            folder: { type: "keyword" },
          },
        },
      });
      console.log("✅ Created Elasticsearch index: emails");
    } else {
      console.log("ℹ️ Index already exists, skipping creation.");
    }
  } catch (err) {
    console.error("Failed to ensure email index:", err);
  }
}
