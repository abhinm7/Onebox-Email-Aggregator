export interface Email {
    id: string; 
    from: string;
    subject: string;
    body: string;
    date: string;
    category: string;
    account: string;
    folder: string;
    messageId?: string;
}

export interface Filters {
    category: string;
    account: string;
    folder: string;
}

export const AVAILABLE_CATEGORIES = [
    'Interested', 'Meeting Booked', 'Not Interested', 'Out of Office',
    'Spam', 'General / Newsletter', 'Uncategorized'
];

// NOTE: Replace these with your actual two email addresses for filtering!
export const AVAILABLE_ACCOUNTS = [
    'abhinabhi8796m@gmail.com',
    'iamabhinm@gmail.com'
];

export const AVAILABLE_FOLDERS = ['INBOX'];