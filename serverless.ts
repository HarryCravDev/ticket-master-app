import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "ccfc-ticket-checker",
  frameworkVersion: "4",
  useDotenv: true, // Automatically loads your .env file

  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "eu-west-2",

    // --- Manual Configuration ---
    // If you created these manually in the AWS Console, paste their details here.
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      TM_API_KEY: "${env:TM_API_KEY}",
      REGION: "${env:REGION}",
      // OPTION A: Manual Approach (Create in Console, paste name/ARN here)
      TABLE_NAME: "CoventryTickets",
      TOPIC_ARN: "arn:aws:sns:eu-west-2:036927895205:send-email",
    },

    // Permissions (IAM Roles)
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Scan",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
            ],
            // If Manual: Replace with specific ARN, or use '*' for all tables (easier for dev)
            Resource:
              "arn:aws:dynamodb:*:*:table/${self:provider.environment.TABLE_NAME}",
          },
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            // If Manual: Replace with specific ARN
            Resource: "${self:provider.environment.TOPIC_ARN}",
          },
        ],
      },
    },
  },

  // Functions
  functions: {
    checkTickets: {
      handler: "src/index.handler", // Points to your src/handler.ts
      events: [
        {
          schedule: {
            rate: ["cron(0 0,6,12,18 * * ? *)"],
            enabled: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
