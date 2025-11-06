import express, { Request, Response } from "express";
import { elasticClient } from "../configs/elasticClient";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
    try {
        const query = (req.query.query as string) || "";
        const category = req.query.category as string | undefined;
        const account = req.query.account as string | undefined;
        const folder = req.query.folder as string | undefined;

        // Elasticsearch query body
        const esQuery: any = {
            bool: {
                must: query
                    ? [
                        {
                            multi_match: {
                                query,
                                fields: ["subject", "body"],
                                fuzziness: "AUTO", // allows small typos
                            },
                        },
                    ]
                    : [],
                filter: [],
            },
        };

        // Apply filters (optional)
        if (category) esQuery.bool.filter.push({ term: { category } });
        if (account) esQuery.bool.filter.push({ term: { account } });
        if (folder) esQuery.bool.filter.push({ term: { folder } });

        // Execute search
        const result = await elasticClient.search({
            index: "emails",
            query: esQuery,
        });

        const emails = result.hits.hits.map((hit) => ({
            id: hit._id,
            ...(hit._source as Record<string, any>),
        }));

        res.json({
            total: result.hits.total,
            count: emails.length,
            results: emails,
        });
    } catch (error) {
        console.error("Search failed:", error);
        res.status(500).json({ error: "Failed to search emails" });
    }
});

export default router;
