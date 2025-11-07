import { Client } from "@elastic/elasticsearch";
import { configDotenv } from "dotenv";

configDotenv();

export const elasticClient = new Client({
  node: process.env.ELASTIC_URL || "http://localhost:9200",
});
