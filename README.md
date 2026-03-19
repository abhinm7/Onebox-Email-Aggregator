# ReachInbox AI Email Aggregator

***This project is an advanced, feature-rich email aggregator designed to synchronize multiple IMAP accounts in real-time. It leverages Elasticsearch for powerful search and filtering, and uses a hybrid AI system (rule-based + Google Gemini) to automatically categorize incoming emails. A simple React frontend provides a "onebox" view to search and filter all processed emails.***

## Features

1. Real-Time Multi-Account IMAP Sync: Connects to multiple Gmail accounts (via App Passwords) using persistent IMAP (IDLE mode) for real-time email detection.

2. Elasticsearch Integration: All processed emails are indexed into an Elasticsearch instance, enabling fast, full-text search.

3. Advanced Filtering: The backend API and frontend UI support filtering emails by keyword, AI category, account, and folder.

4. Hybrid AI Categorization: A sophisticated classification system that uses a fast, local rule-based classifier for common emails (e.g., newsletters, security alerts) and falls back to the Google Gemini API for complex semantic analysis.

5. Notifications: Sends real-time Slack and Webhook notifications for emails categorized as "Interested."

6. React Dashboard: A clean, professional, and type-safe React (Vite + TypeScript) frontend to view, search, and filter all emails from a single interface.

## Tech Stack

**Backend** : `Node.js`, `TypeScript`, `Express.js`

**IMAP Client** : `imapflow`

**Search/Storage** : `Elasticsearch` (running via Docker)

**AI** : `Google Gemini API`

**Frontend** : `React`, `TypeScript`, `Vite`, `Tailwind CSS`

**Notifications** : `Slack Webhooks`, `Axios`

## Local Development Setup

This project is configured to run the backend and frontend services locally on your host machine while connecting to an Elasticsearch instance running in Docker.

### Prerequisites

`Node.js (v20.x or later)`
`npm`
`Docker`

### Step 1: Configure Backend
Navigate to the backend:
```
cd backend
```
Install dependencies:
```
npm install
```
Create Environment File: Create a file named .env in the backend directory and add your credentials. It must include:

### --- Account 1 (Primary) ---
EMAIL_USER_1="your-first-email@gmail.com"
EMAIL_PASS_1="your-gmail-app-password-1"

### --- Account 2 (Secondary) ---
EMAIL_USER_2="your-second-email@gmail.com"
EMAIL_PASS_2="your-gmail-app-password-2" 

### --- Services ---
#### IMPORTANT: Use localhost for local development
ELASTIC_URL="http://localhost:9200" 
GEMINI_API_KEY="your-google-ai-studio-api-key"

### --- Notifications (Optional) ---
WEBHOOK_URL="your-webhook.site-url"
SLACK_WEBHOOK_URL="your-slack-webhook-url"


Step 2: Configure Frontend
1.Navigate to the frontend:
```
cd ../frontend
```

2.Install dependencies:
```npm install
```

3.Install Tailwind (if needed):
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p 
```
Create Environment File: Create a file named .env in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:4000/search
```
Step 3: Run The Application

You will need three separate terminals running simultaneously.

Terminal 1: Start `Elasticsearch` (Docker)

From the project root directory:

#### This starts the Elasticsearch container and exposes it on port 9200
```
docker compose up -d
```

Terminal 2: Start Backend (Local)

From the backend directory:

### This starts the Node.js server with nodemon for hot-reloading
```
npm run dev
```

Wait until you see `"Server started on port 4000"` and `"IMAP Idle mode started..."`.

Terminal 3: Start Frontend (Local)
From the frontend directory:

# This starts the Vite dev server
```
npm run dev
```

You can now access the dashboard at `http://localhost:5173.`

API Endpoint

The primary API endpoint used by the frontend:

`GET /search`: Fetches and filters emails.

Query Parameters:

q (string): Full-text search query.

category (string): Exact category match.

account (string): Exact account email match.

folder (string): Exact folder name match.
