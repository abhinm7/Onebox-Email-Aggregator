export type EmailCategory =
  | "Interested"
  | "Meeting Booked"
  | "Not Interested"
  | "Out of Office"
  | "Spam"
  | "Job"
  | "Uncategorized";

  // utility function to get typed object keys
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}


export function keywordContentClassify(content: string): EmailCategory {
  if (!content || content.trim().length === 0) return "Uncategorized";

  const normalized = content.toLowerCase().replace(/[^\w\s]/g, " ");

  const categoryKeywords: Record<EmailCategory, string[]> = {
    Interested: ["interested", "let’s talk", "lets talk", "keen", "excited", "proceed"],
    "Meeting Booked": ["meeting", "calendar", "zoom", "invite", "interview", "discussion"],
    "Not Interested": ["not interested", "decline", "position filled", "unsubscribe", "reject"],
    "Out of Office": ["out of office", "on vacation", "away from work", "auto reply"],
    Spam: ["lottery", "promotion", "discount", "buy now", "limited offer", "sale"],
    Job: ["hiring", "job offer", "vacancy", "apply now", "shortlisted"],
    Uncategorized: [],
  };

  const scores: Record<EmailCategory, number> = {
    Interested: 0,
    "Meeting Booked": 0,
    "Not Interested": 0,
    "Out of Office": 0,
    Spam: 0,
    Job: 0,
    Uncategorized: 0,
  };

  // Count keyword hits
  for (const [category, keywords] of Object.entries(categoryKeywords) as [
    EmailCategory,
    string[],
  ][]) {
    for (const keyword of keywords) {
      const pattern = new RegExp(`\\b${keyword}\\b`, "i");
      if (pattern.test(normalized)) scores[category] += 1;
    }
  }

  // Use typed keys helper
  const bestCategory = typedKeys(scores).reduce((best, current) => {
    return scores[current] > scores[best] ? current : best;
  }, "Uncategorized" as EmailCategory);

  return bestCategory;
}
