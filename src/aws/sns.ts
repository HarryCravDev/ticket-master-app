import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
const REGION = process.env.AWS_REGION || "eu-west-2";
const TOPIC_ARN = process.env.TOPIC_ARN;
const snsClient = new SNSClient({ region: REGION });

export async function sendSNSAlert(snsPayload: {
  subject: string;
  message: string;
}) {
  const { subject, message } = snsPayload;

  await snsClient.send(
    new PublishCommand({
      TopicArn: TOPIC_ARN,
      Message: message,
      Subject: subject,
    })
  );
  console.log(`Sent alert for ${subject}`);
}
