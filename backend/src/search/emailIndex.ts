import { elasticClient } from "../configs/elasticClient";

export async function createEmailIndex() {
  const exists = await elasticClient.indices.exists({ index: "emails" });
  if (exists) {
    console.log("ℹ️ Index already exists, skipping creation.");
    return;
  }

  await elasticClient.indices.create({
    index: "emails",
    body: {
      mappings: {
        properties: {
          from: { type: "keyword" },
          subject: { type: "text" },
          body: { type: "text" },
          date: { type: "date" }, // <-- important
          category: { type: "keyword" },
          account: { type: "keyword" },
          folder: { type: "keyword" }
        },
      },
      settings: {
        refresh_interval: "1s"
      }
    }
  });
  console.log(" Email index ready");
}
