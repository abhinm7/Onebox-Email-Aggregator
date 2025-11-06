import { simpleParser } from "mailparser";

export function cleanEmailBody(text?: string): string {
  if (!text) return "(No body)";

  // Remove HTML tags
  let clean = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities (like &#8199;)
  clean = clean.replace(/&#[0-9]+;/g, " ");
  clean = clean.replace(/&[a-z]+;/gi, " ");

  // Remove excessive newlines, spaces, and non-breaking spaces
  clean = clean.replace(/\s+/g, " ").trim();

  // Cut long body text (optional for readability)
  if (clean.length > 1000) clean = clean.substring(0, 1000) + " ...";

  return clean;
}
