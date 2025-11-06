import { elasticClient } from "./configs/elasticClient";


async function test() {
  const info = await elasticClient.info();
  console.log("✅ Connected to Elasticsearch:");
  console.log(info);
}

test().catch(console.error);
