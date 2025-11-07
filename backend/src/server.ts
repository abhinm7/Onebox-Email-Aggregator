import express from "express";
import dotenv from "dotenv";
import { createEmailIndex } from "./search/emailIndex";
import { AccountConfig, fetchLastEmails, startIdleMode } from "./imap";
import { deleteEmailsOlderThan } from "./search/retention";
import searchRoutes from "./routes/searchRoutes";
import cors from "cors";

dotenv.config();

const ACCOUNTS: AccountConfig[] = [
  {
    id: process.env.EMAIL_USER_1!,
    user: process.env.EMAIL_USER_1!,
    pass: process.env.EMAIL_PASS_1!,
  },
  {
    id: process.env.EMAIL_USER_2!,
    user: process.env.EMAIL_USER_2!,
    pass: process.env.EMAIL_PASS_2!,
  },
];

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 4000;

(async () => {
  await createEmailIndex();
  await deleteEmailsOlderThan(1);
  
  const startupPromises = ACCOUNTS.flatMap(account => [
    fetchLastEmails(account), // Initial fetch for Account
    startIdleMode(account),   // Real-time listener for Account
  ]);
})();

app.use("/", searchRoutes);
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
