import { EventBridgeEvent } from "aws-lambda";
import * as dotenv from "dotenv";
import { getCoventryCityGames } from "./services/ticketMaster";
import { searchTickets } from "./services/ticketService";
import { sendSNSAlert } from "./aws/sns";
import { ScheduledEventDetail } from "./types";
dotenv.config();

export const handler = async (
  event: EventBridgeEvent<string, ScheduledEventDetail>
): Promise<void> => {
  try {
    console.log("Processing scheduled task...");

    const coventryEvents = await getCoventryCityGames();

    if (!coventryEvents || coventryEvents.length === 0) {
      console.log(
        "No Coventry City events found, possible issue with data retrieval."
      );
      await sendSNSAlert({
        subject: "Ticket Checker Alert: No Events Found ❌",
        message:
          "The scheduled task ran successfully but found no Coventry City events. Please check the data source for potential issues.",
      });
      return;
    }

    await searchTickets(coventryEvents);

    console.log("Task completed successfully at", new Date().toISOString());
  } catch (error) {
    console.error("Error processing scheduled task", error);
    throw error; // EventBridge will mark the execution as failed
  }
};
