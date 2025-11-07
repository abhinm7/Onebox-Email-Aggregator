// --- Represents a minimal email document stored in Elasticsearch ---
export interface EmailDocument {
  from: string;
  subject: string;
  body: string;
  date: string;        
  category: string;
  account: string;
  folder: string;
  messageId?: string; 
}

// --- Represents the raw email parsed from IMAP + Mailparser ---
export interface ParsedEmail {
  from: string;
  subject: string;
  body: string;
  date: Date;
  category?: string;
  messageId?: string; 
}

// --- Represents a simplified IMAP message with just what we need ---
export interface ImapMessage {
  envelope?: {
    from?: { address?: string }[];
    subject?: string;
    date?: Date;
  };
  source?: Buffer;
}

// --- For webhook notifications ---
export interface WebhookEmailPayload {
  from: string;
  subject: string;
  category: string;
  body: string;
}

export interface AccountConfig {
  id: string; //
  user: string;
  pass: string;
}