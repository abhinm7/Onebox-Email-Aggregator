import express, { Request, Response } from "express";
import { elasticClient } from "../configs/elasticClient";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    // Matches frontend fetch call
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const account = req.query.account as string | undefined;
    const folder = req.query.folder as string | undefined;

    const must: any[] = [];
    const filters: any[] = [];

    // Full-text search 
    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ["subject", "body", "from"],
          fuzziness: "AUTO",
        },
      });
    }

    // Add '.keyword' to all term filters for exact matching
    if (category) {
      filters.push({ term: { "category.keyword": category } });
    }
    if (account) {
      filters.push({ term: { "account.keyword": account } });
    }
    if (folder) {
      filters.push({ term: { "folder.keyword": folder } });
    }

    // Build the final query
    const query: any = {
      bool: {
        must: must.length > 0 ? must : undefined,
        filter: filters.length > 0 ? filters : undefined,
      },
    };

    // Use 'match_all' if no queries or filters are provided
    const finalQuery =
      must.length > 0 || filters.length > 0 ? query : { match_all: {} };

    // Execute search
    const result = await elasticClient.search({
      index: "emails",
      query: finalQuery,
      size: 50,
      sort: [{ date: "desc" }],
    });

    // Format the results for the frontend
    const emails = result.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...(hit._source as Record<string, any>),
    }));

    const total = (result.hits.total as any).value || 0;

    res.json({
      total: total,
      count: emails.length,
      results: emails,
    });
  } catch (error) {
    console.error("Search failed:", (error as Error).message);
    res.status(500).json({ error: "Failed to search emails" });
  }
});

export default router;
