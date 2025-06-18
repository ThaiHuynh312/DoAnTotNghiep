export interface ICalendarEvent {
  _id: string;
  id: string; // thường là _id hoặc tạo tạm thời
  title: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
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
