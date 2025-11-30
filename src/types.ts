export interface CoventryDBItem {
  id: string;
  name: string;
  date: string;
  time: string;
  city: string;
  url: string;
}

export interface ScheduledEventDetail {
  [key: string]: any;
}

export interface Image {
  url: string;
  ratio: string;
}

export interface DateInfo {
  start: {
    localDate: string;
    localTime: string;
    dateTime: string;
  };
}

export interface Venue {
  name: string;
  city: { name: string };
}

export interface Event {
  name: string;
  id: string;
  url: string;
  images: Image[];
  dates: DateInfo;
  _embedded?: {
    venues?: Venue[];
  };
  priceRanges?: {
    min: number;
    max: number;
    currency: string;
  }[];
}

export interface TMResponse {
  _embedded?: {
    events: Event[];
  };
}
