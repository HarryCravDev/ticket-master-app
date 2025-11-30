# 🎫 Coventry City Ticket Checker

An automated serverless application that monitors Coventry City Football Club ticket availability on Ticketmaster and sends real-time alerts when new tickets are released.

## 📋 Overview

This application runs as an AWS Lambda function on a scheduled basis (every 6 hours) to:

- Fetch upcoming Coventry City home games from the Ticketmaster API
- Compare them against known games stored in DynamoDB
- Send SNS notifications when new tickets become available
- Automatically clean up expired or past games from the database

## 🏗️ Architecture

**Services Used:**

- **AWS Lambda** - Serverless function execution
- **AWS EventBridge** - Scheduled triggers (cron: 00:00, 06:00, 12:00, 18:00 UTC)
- **AWS DynamoDB** - Stores known game records
- **AWS SNS** - Push notifications for new tickets
- **Ticketmaster Discovery API** - Fetches live ticket data

**Tech Stack:**

- TypeScript
- Node.js 20.x
- AWS SDK v3
- Serverless Framework
- Axios for HTTP requests

## 📁 Project Structure

```
ticket-master-app/
├── src/
│   ├── index.ts              # Lambda handler entry point
│   ├── test-local.ts         # Local testing script
│   ├── types.ts              # TypeScript type definitions
│   ├── aws/
│   │   ├── dynamo.ts         # DynamoDB operations
│   │   └── sns.ts            # SNS notification service
│   └── services/
│       ├── ticketMaster.ts   # Ticketmaster API integration
│       └── ticketService.ts  # Core ticket comparison logic
├── serverless.ts             # Serverless Framework configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- AWS Account with configured credentials
- Ticketmaster API Key ([Get one here](https://developer.ticketmaster.com/))
- AWS CLI configured with appropriate permissions

### Installation

1. **Clone the repository**

   ```bash
   cd ticket-master-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   TM_API_KEY=your_ticketmaster_api_key
   AWS_REGION=eu-west-2
   TABLE_NAME=CoventryTickets
   TOPIC_ARN=arn:aws:sns:eu-west-2:YOUR_ACCOUNT_ID:send-email
   ```

4. **Set up AWS Resources** (if not already created)

   - Create a DynamoDB table named `CoventryTickets` with `id` as the partition key (String)
   - Create an SNS topic named `send-email` and subscribe your email/phone
   - Ensure your AWS credentials are configured locally (`~/.aws/credentials`)

## 🧪 Local Development

### Test Locally

Run the Lambda function locally without deploying:

```bash
npm run local
```

This executes `test-local.ts` which simulates an EventBridge event and runs your handler.

### Build

Compile TypeScript:

```bash
npm run b
```

Or build with esbuild:

```bash
npm run build
```

## 🚢 Deployment

Deploy to AWS using Serverless Framework:

```bash
serverless deploy
```

This will:

- Package your code
- Create/update the Lambda function
- Set up EventBridge scheduled rules
- Configure IAM roles and permissions

## 📊 How It Works

1. **Scheduled Trigger**: EventBridge invokes the Lambda every 6 hours
2. **Fetch Data**: Retrieves Coventry City games from Ticketmaster API
3. **Database Check**: Scans DynamoDB for previously known games
4. **Comparison**:
   - **New Games**: Found on Ticketmaster but not in DB → Send alert & save to DB
   - **Expired Games**: In DB but not on Ticketmaster → Remove from DB
5. **Notifications**: SNS alerts sent with game details (name, date, ticket link)

## 🔔 Alert Format

When new tickets are found, you'll receive an SNS notification like:

```
🚨 NEW TICKET ALERT!
⚽ Match: Coventry City vs. Sheffield United
📅 Date: 2025-12-15
🔗 Link: https://www.ticketmaster.co.uk/event/...
```

## 🛠️ Configuration

### Change Schedule

Edit `serverless.ts` to modify the cron schedule:

```typescript
events: [
  {
    schedule: {
      rate: ["cron(0 */6 * * ? *)"], // Every 6 hours
      enabled: true,
    },
  },
];
```

### Change Target Team

Modify `src/services/ticketMaster.ts`:

```typescript
params: {
  keyword: "Your Team Name",
  classificationName: "Sports",
  // ...
}
```

## 🔐 AWS Credentials

The application uses AWS SDK's default credential provider chain:

1. Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
2. Shared credentials file (`~/.aws/credentials`)
3. IAM roles (when deployed)

For local development, ensure you have credentials configured via AWS CLI:

```bash
aws configure
```

## 📝 Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm run local` | Run Lambda function locally |
| `npm run build` | Build with esbuild          |
| `npm run b`     | Compile TypeScript with tsc |

## 🐛 Troubleshooting

**No events found**

- Verify your Ticketmaster API key is valid
- Check that games are listed on Ticketmaster for your team
- Review the keyword/classification filters

**AWS credentials error**

- Ensure `~/.aws/credentials` is configured
- Verify IAM permissions for DynamoDB and SNS
- Check environment variables in `.env`

**No notifications received**

- Confirm SNS topic subscription (check email for confirmation)
- Verify `TOPIC_ARN` in `.env` is correct
- Check CloudWatch logs for errors

## 📄 License

ISC

## 👤 Author

Harry Craven

---

**Note**: This is a personal project for monitoring Coventry City FC ticket availability. Adjust the team name and parameters as needed for other teams or sports events.
