export type EmailCategory =
  | "Interested"
  | "Meeting Booked"
  | "Not Interested"
  | "Out of Office"
  | "Spam"
  | "General / Newsletter" // Added for clarity
  | "Uncategorized";

// utility function to get typed object keys
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}


export function keywordContentClassify(content: string): EmailCategory {
  if (!content || content.trim().length === 0) return "Uncategorized";

  // Use a wider replacement pattern to normalize punctuation and special characters
  const normalized = content.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

  const categoryKeywords: Record<EmailCategory, string[]> = {
    Interested: ["interested", "let’s talk", "lets talk", "keen", "excited", "proceed", "next step", "schedule a chat"],
    "Meeting Booked": ["meeting", "calendar", "zoom link", "interview schedule", "discussion time", "confirmed", "booked"],
    "Not Interested": ["not interested", "decline", "position filled", "unsubscribe", "reject", "not a fit", "no longer"],
    "Out of Office": ["out of office", "on vacation", "away from work", "auto reply", "will return", "no access to email"],
    "General / Newsletter": [
      "newsletter", "update", "updates", "announcement", "confirm", "verify",
      "subscription", "security", "alert", "receipt", "invoice", "welcome",
      "digest", "new post", "password", "reset", "shipping", "delivered",
      "order", "notification"
    ],
    Spam: ["lottery", "promotion", "discount", "buy now", "limited offer", "sale", "free offer", "urgent claim", "click here", "unclaimed prize"],
    Uncategorized: [],
  };

  const scores: Record<EmailCategory, number> = {
    Interested: 0,
    "Meeting Booked": 0,
    "Not Interested": 0,
    "Out of Office": 0,
    "General / Newsletter": 0,
    Spam: 0,
    Uncategorized: 0,
  };

  // Count keyword hits
  for (const [category, keywords] of Object.entries(categoryKeywords) as [
    EmailCategory,
    string[],
  ][]) {
    for (const keyword of keywords) {
      // Use word boundary (\b) for better accuracy
      const pattern = new RegExp(`\\b${keyword}\\b`, "i");
      if (pattern.test(normalized)) scores[category] += 1;
    }
  }

  // Find the category with the highest score
  const bestCategory = typedKeys(scores).reduce((best, current) => {
    return scores[current] > scores[best] ? current : best;
  }, "Uncategorized" as EmailCategory);

  // Only return a category if the score is greater than 0
  if (scores[bestCategory] > 0) {
    return bestCategory;
  }

  return "Uncategorized";
}