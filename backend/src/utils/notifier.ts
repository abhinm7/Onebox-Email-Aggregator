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
  try {
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    const webhookUrl = process.env.WEBHOOK_URL;

    const snippet = body.substring(0, 250);

    // Slack fancy message with blocks
    const slackMessage = {
      attachments: [
        {
          color:
            category === "Interested"
              ? "#36a64f" // green
              : category === "Meeting Booked"
                ? "#439FE0" // blue
                : category === "Not Interested"
                  ? "#a30200" // red
                  : "#808080", // gray

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
                {
                  type: "mrkdwn",
                  text: `*From:*\n${from}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Subject:*\n${subject}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Category:*\n${category}`,
                },
              ],
            },
            {
              type: "divider",
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `💬 *Snippet:*\n${snippet}`,
              },
            },
          ],
        },
      ],
    };

    // Send Slack notification
    if (slackUrl) {
      await axios.post(slackUrl, slackMessage);
      console.log(" Sent Slack notification");
    }

    // Optional webhook
    if (webhookUrl) {
      await axios.post(webhookUrl, {
        from,
        subject,
        category,
        preview: snippet,
      });
      console.log("Sent Webhook notification");
    }
  } catch (err) {
    console.error(
      "Notification failed:",
      err instanceof Error ? err.message : err
    );
  }
}
