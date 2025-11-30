import { EventBridgeEvent } from "aws-lambda";
import { handler } from "./index";

// Mock EventBridge scheduled event
const mockEvent: EventBridgeEvent<string, any> = {
  id: "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
  version: "0",
  account: "123456789012",
  time: new Date().toISOString(),
  region: "us-east-1",
  resources: [],
  source: "aws.events",
  "detail-type": "Scheduled Event",
  detail: {
    // Add any custom detail properties here
  },
};

// Mock context (optional, if you need it)
const mockContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "ticket-master-app-local",
  functionVersion: "$LATEST",
  invokedFunctionArn:
    "arn:aws:lambda:us-east-1:123456789012:function:ticket-master-app-local",
  memoryLimitInMB: "128",
  awsRequestId: "test-request-id",
  logGroupName: "/aws/lambda/ticket-master-app-local",
  logStreamName: "2025/11/29/[$LATEST]test",
  getRemainingTimeInMillis: () => 30000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

// Execute the handler
async function runTest() {
  console.log("🚀 Starting local Lambda execution...\n");
  console.log("📥 Event payload:", JSON.stringify(mockEvent, null, 2));
  console.log("\n" + "=".repeat(60) + "\n");

  try {
    const result = await handler(mockEvent);

    console.log("\n" + "=".repeat(60));
    console.log("\n✅ Lambda execution completed successfully!");

    if (result !== undefined) {
      console.log("\n📤 Response:", JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.error("\n❌ Lambda execution failed!");
    console.error("\n Error details:", error);
    process.exit(1);
  }
}

runTest();
