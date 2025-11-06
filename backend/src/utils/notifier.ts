import axios from "axios";

export async function notifyInterestedEmail({
  from,
  subject,
  category,
  body,
}: {
  from: string;
  subject: string;
  category: string;
  body: string;
}) {
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const webhookUrl = process.env.WEBHOOK_URL;

  const snippet = body.substring(0, 250);

  const slackMessage = {
    attachments: [
      {
        color:
          category === "Interested"
            ? "#36a64f"
            : category === "Meeting Booked"
            ? "#439FE0"
            : category === "Not Interested"
            ? "#a30200"
            : "#808080",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `📬 New ${category} Email`,
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*From:*\n${from}` },
              { type: "mrkdwn", text: `*Subject:*\n${subject}` },
              { type: "mrkdwn", text: `*Category:*\n${category}` },
            ],
          },
          { type: "divider" },
          { type: "section", text: { type: "mrkdwn", text: `💬 *Snippet:*\n${snippet}` } },
        ],
      },
    ],
  };

  try {
    if (slackUrl) {
      await axios.post(slackUrl, slackMessage, { timeout: 8000 });
      console.log("✅ Sent Slack notification");
    }
  } catch (err) {
    console.warn("⚠️ Slack notification failed:", (err as Error).message);
  }

  try {
    if (webhookUrl) {
      await axios.post(
        webhookUrl,
        { from, subject, category, preview: snippet },
        { timeout: 8000 }
      );
      console.log(" Sent Webhook notification");
    }
  } catch (err) {
    console.warn(" Webhook notification failed:", (err as Error).message);
  }
}
