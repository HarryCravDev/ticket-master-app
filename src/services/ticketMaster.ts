import * as dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.TM_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";
import axios from "axios";
import { CoventryDBItem, TMResponse } from "../types";

export async function getCoventryCityGames(): Promise<CoventryDBItem[]> {
  if (!API_KEY) {
    console.error("Error: TM_API_KEY is missing from .env file");
    return [];
  }

  try {
    const response = await axios.get<TMResponse>(BASE_URL, {
      params: {
        apikey: API_KEY,
        keyword: "Coventry City",
        classificationName: "Sports",
        sort: "date,asc",
        countryCode: "GB",
        size: 10,
      },
    });

    const events = response.data._embedded?.events;

    if (!events || events.length === 0) {
      console.log("No upcoming games found on Ticketmaster.");
      return [];
    }

    console.log(`Found ${events.length} upcoming games:\n`);
    const coventryEvents: CoventryDBItem[] = [];

    events.forEach((event) => {
      const date = event.dates.start.localDate;
      const time = event.dates.start.localTime;
      const venue = event._embedded?.venues?.[0]?.name || "Unknown Venue";
      const city = event._embedded?.venues?.[0]?.city.name || "Unknown City";

      if (city !== "Coventry") {
        return;
      }
      const coventryEvent: CoventryDBItem = {
        id: event.id,
        name: event.name,
        date,
        time,
        city,
        url: event.url,
      };

      coventryEvents.push(coventryEvent);
    });

    return coventryEvents;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error:", error);
    }

    return [];
  }
}
