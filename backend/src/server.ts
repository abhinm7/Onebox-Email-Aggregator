import express from "express";
import dotenv from "dotenv";
import { startImapConnection } from "./imap/imapService";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ReachInbox Backend Running ✅");
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
  startImapConnection(); // Start IMAP sync on startup
});
