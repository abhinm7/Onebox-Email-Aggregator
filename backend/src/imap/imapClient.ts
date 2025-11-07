import { ImapFlow } from "imapflow";
import { AccountConfig } from "./types";

//Connects to the IMAP server for a given account.


export async function connectToImap(config: AccountConfig): Promise<ImapFlow> {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    logger: false,
  });

  await client.connect();
  console.log(`Connected to IMAP for account: ${config.id}`);

  return client;
}
