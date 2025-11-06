import { elasticClient } from "../configs/elasticClient";

/**
 * Deletes emails older than `days` days.
 * Uses ES range query with `now-30d/d` style.
 */

export async function deleteEmailsOlderThan(days: number) {
  const resp = await elasticClient.deleteByQuery({
    index: "emails",
    body: {
      query: {
        range: {
          date: {
            lt: `now-${days}d/d`, // strictly older than N days (day-rounded)
          },
        },
      },
    },
    refresh: true, // reflect deletions immediately in searches
    conflicts: "proceed", // ignore version conflicts if any
  });

  console.log(`🧹 Retention cleanup: removed ${resp.deleted} docs older than ${days} days`);
}
