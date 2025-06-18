export interface ICalendarEvent {
  _id: string;
  id: string; 
  title: string;
  startTime: string;
  endTime: string;
  repeat: {
    type: "none" | "weekly" | "daily" | "monthly";
    daysOfWeek: number;
    from?: string;
    to?: string;
  };
}

export interface ICreateCalendarEventPayload {
  title: string;
  startTime: string;
  endTime: string;
  repeat: {
    type: "none" | "weekly" | "daily" | "monthly";
    daysOfWeek: number;
    from?: string;
    to?: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  repeat?: {
    type: "weekly" | "daily" | "monthly";
    daysOfWeek: number;
    until: Date;
  };
}
