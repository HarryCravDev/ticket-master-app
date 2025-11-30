import { ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { CoventryDBItem } from "../types";
import { sendSNSAlert } from "../aws/sns";
import { deleteItem, getAllItems, put } from "../aws/dynamo";

const TABLE_NAME = process.env.TABLE_NAME || "CoventryTickets";

export async function searchTickets(tickets: CoventryDBItem[]) {
  try {
    const tmIds = new Set(tickets.map((g) => g.id));
    console.log(`✅ Found ${tickets.length} active games on Ticketmaster.`);

    // 2. Fetch 'Known' games from DynamoDB (Optimized Scan)
    const dbGames = await getAllDbRecords();
    const dbIds = new Set(dbGames.map((g) => g.id));
    console.log(`📂 Found ${dbGames.length} known games in Database.`);

    // 3. Identification Logic
    const newGames = tickets.filter((g) => !dbIds.has(g.id));
    const expiredGames = dbGames.filter((g) => !tmIds.has(g.id));

    // 4. Process New Games (Alert + Save)
    if (newGames.length > 0) {
      console.log(`🎉 Found ${newGames.length} NEW games!`);

      await Promise.all(
        newGames.map(async (game) => {
          // Send Alert
          await sendAlert(game);
          // Save to DB
          await saveGameToDB(game);
        })
      );
    } else {
      console.log("No new games found.");
    }

    // 5. Cleanup Expired/Past Games (Delete)
    if (expiredGames.length > 0) {
      console.log(
        `🧹 Removing ${expiredGames.length} expired games from DB...`
      );
      await Promise.all(expiredGames.map((game) => deleteGameFromDB(game.id)));
    }
  } catch (error) {
    console.log("Error occured in Lambda...");
    console.log(error);
  }
}

async function saveGameToDB(game: CoventryDBItem) {
  await put({
    TableName: TABLE_NAME,
    Item: game,
  });
  console.log(`Saved ${game.name} to DB`);
}

async function deleteGameFromDB(eventId: string) {
  await deleteItem(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id: eventId },
    })
  );
  console.log(`Deleted event ${eventId} from DB`);
}

async function sendAlert(game: CoventryDBItem) {
  const message = `
🚨 NEW TICKET ALERT!
⚽ Match: ${game.name}
📅 Date: ${game.date}
🔗 Link: ${game.url}
    `.trim();

  await sendSNSAlert({
    subject: "New Coventry City Ticket",
    message,
  });
}

async function getAllDbRecords(): Promise<CoventryDBItem[]> {
  const response = await getAllItems(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );
  return response;
}
