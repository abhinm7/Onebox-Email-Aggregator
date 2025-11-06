import express from "express";
import dotenv from "dotenv";
import { createEmailIndex } from "./search/emailIndex";
import { fetchLastEmails, startIdleMode } from "./imap";
import { deleteEmailsOlderThan } from "./search/retention";
import searchRoutes from "./routes/searchRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

(async () => {
  await createEmailIndex();
  await deleteEmailsOlderThan(30);
  await fetchLastEmails();
  await startIdleMode();
})();

app.use("/", searchRoutes);
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
