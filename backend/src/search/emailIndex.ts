import { elasticClient } from "../configs/elasticClient";

/**
 * Create the Elasticsearch index for emails (if not exists)
 */

export async function createEmailIndex() {
  const indexName = "emails";

  // Check if index exists
  const { acknowledged } = await elasticClient.indices.exists({ index: indexName }) as any;
  if (acknowledged) {
    console.log(`ℹ️ Index "${indexName}" already exists`);
    return;
  }

  // Create the index with proper mappings
  await elasticClient.indices.create({
    index: indexName,
    body: {
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
    },
  } as any);

  console.log(`✅ Created Elasticsearch index: ${indexName}`);
}
