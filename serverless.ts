import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "ccfc-ticket-checker",
  frameworkVersion: "4",
  useDotenv: true,

  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "eu-west-2",

    // --- Manual Configuration ---
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      TM_API_KEY: "${env:TM_API_KEY}",
      REGION: "${env:REGION}",
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
            Resource:
              "arn:aws:dynamodb:*:*:table/${self:provider.environment.TABLE_NAME}",
          },
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: "${self:provider.environment.TOPIC_ARN}",
          },
        ],
      },
    },
  },

  // Functions
  functions: {
    checkTickets: {
      handler: "src/index.handler",
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
