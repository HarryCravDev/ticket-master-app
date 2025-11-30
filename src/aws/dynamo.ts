import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { CoventryDBItem } from "../types";
const REGION = process.env.AWS_REGION || "eu-west-2";

const dbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(dbClient);

export async function put(input: PutCommandInput) {
  try {
    await docClient.send(new PutCommand(input));
  } catch (error) {
    console.error("Error putting item into DynamoDB", error);
    throw error;
  }
}

export async function getAllItems(command: ScanCommand) {
  try {
    const response = await docClient.send(command);
    return (response.Items as CoventryDBItem[]) || [];
  } catch (error) {
    console.error("Error scanning items from DynamoDB", error);
    throw error;
  }
}

export async function deleteItem(command: DeleteCommand) {
  try {
    await docClient.send(command);
  } catch (error) {
    console.error("Error deleting item from DynamoDB", error);
    throw error;
  }
}
