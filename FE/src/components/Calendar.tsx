import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.css";
import { addWeeks, isBefore, isEqual } from "date-fns";
import Schedule from "./ScheduleModal";
import { ICalendarEvent } from "../types/calendar";
import {
  apiCreateCalendarEvent,
  apiDeleteCalendarEvent,
  apiGetCalendarEvents,
  apiGetCalendarEventsByUserId,
  apiUpdateCalendarEvent,
} from "../services/calendar";
import { useParams } from "react-router-dom";

const localizer = momentLocalizer(moment);

type CustomEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  recurrence?: {
    type: "weekly";
    daysOfWeek: number;
    from: Date;
    to: Date;
  };
};

const generateRecurringEvents = (
  base: Omit<CustomEvent, "start" | "end">,
  timeFrom: string,
  timeTo: string
): CustomEvent[] => {
  const results: CustomEvent[] = [];

  const fromDate = new Date(base.recurrence!.from);
  const toDate = new Date(base.recurrence!.to);

  const weekday = base.recurrence!.daysOfWeek;

  let current = new Date(fromDate);
  while (current.getDay() !== weekday) {
    current.setDate(current.getDate() + 1);
  }

  while (isBefore(current, toDate) || isEqual(current, toDate)) {
    const [fromHour, fromMinute] = timeFrom.split(":").map(Number);
    const [toHour, toMinute] = timeTo.split(":").map(Number);
    const start = new Date(current);
    const end = new Date(current);
    start.setHours(fromHour, fromMinute, 0, 0);
    end.setHours(toHour, toMinute, 0, 0);

    results.push({
      ...base,
      start,
      end,
      id: `${base.id}-${current.toISOString()}`,
    });

    current = addWeeks(current, 1);
  }

  return results;
};

const MyCalendar = () => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CustomEvent | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [repeatWeekday, setRepeatWeekday] = useState(1);
  const [repeatTo, setRepeatTo] = useState("");
  const { userId } = useParams<{ userId?: string }>();

  useEffect(() => {
    // @ts-ignore: moment locale không có type declaration
    import("moment/dist/locale/vi.js")
      .then(() => {
        moment.locale("vi");
      })
      .catch((err) => {
        console.error("❌ Lỗi nạp locale:", err);
      });
  }, []);

  const loadEvents = async () => {
    try {
      const data = userId
        ? await apiGetCalendarEventsByUserId(userId)
        : await apiGetCalendarEvents();
      const parsed: CustomEvent[] = data.flatMap((ev) => {
        const id = ev._id || `event-${Date.now()}`;
        const start = new Date(ev.startTime);
        const end = new Date(ev.endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn("Invalid date", ev);
          return [];
        }

        const recurrence =
          ev.repeat?.type === "weekly" && ev.repeat.from && ev.repeat.to
            ? {
                type: "weekly" as const,
                daysOfWeek: ev.repeat.daysOfWeek,
                from: new Date(ev.repeat.from),
                to: new Date(ev.repeat.to),
              }
            : undefined;

        if (recurrence) {
          return generateRecurringEvents(
            {
              id,
              title: ev.title,
              recurrence,
            },
            moment(start).format("HH:mm"),
            moment(end).format("HH:mm")
          );
        }

        return [{ id, title: ev.title, start, end }];
      });

      setEvents(parsed);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openForm = (event?: CustomEvent) => {
    if (event) {
      setEditingEvent(event);
      setTitle(event.title);
      setDate(moment(event.start).format("YYYY-MM-DD"));
      setStartTime(moment(event.start).format("HH:mm"));
      setEndTime(moment(event.end).format("HH:mm"));
      if (event.recurrence) {
        setRepeat(true);
        setRepeatWeekday(event.recurrence.daysOfWeek);
        setRepeatTo(moment(event.recurrence.to).format("YYYY-MM-DD"));
      } else {
        setRepeat(false);
        setRepeatWeekday(event.start.getDay());
        setRepeatTo("");
      }
    } else {
      setEditingEvent(null);
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setRepeat(false);
      setRepeatWeekday(1);
      setRepeatTo("");
    }
    setShowForm(true);
  };

  const handleSubmit = async (data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    repeat: boolean;
    repeatWeekday: number;
    repeatFrom: string;
    repeatTo: string;
  }) => {
    const startDate = new Date(`${data.date}T${data.startTime}`);
    const endDate = new Date(`${data.date}T${data.endTime}`);

    if (startDate >= endDate) {
      alert("Thời gian bắt đầu phải trước thời gian kết thúc.");
      return;
    }

    const eventData: ICalendarEvent = {
      id: editingEvent?.id || `event-${Date.now()}`,
      title: data.title,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      repeat: data.repeat
        ? {
            type: "weekly",
            daysOfWeek: data.repeatWeekday,
            from: new Date(data.repeatFrom).toISOString(),
            to: new Date(data.repeatTo).toISOString(),
          }
        : { type: "none", daysOfWeek: 0 },
      _id: "",
    };

    try {
      if (editingEvent) {
        const baseId = editingEvent.id.split("-")[0];
        await apiUpdateCalendarEvent(baseId, eventData);
      } else {
        await apiCreateCalendarEvent(eventData);
      }

      await loadEvents();
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      console.error("Error saving event", err);
    }
  };

  const handleDelete = async () => {
    if (editingEvent?.id) {
      try {
        const baseId = editingEvent.id.split("-")[0];

        await apiDeleteCalendarEvent(baseId);

        setEvents((prev) => prev.filter((e) => !e.id.startsWith(baseId)));

        setShowForm(false);
        setEditingEvent(null);
      } catch (err) {
        console.error("Error deleting event", err);
      }
    }
  };

  return (
    <div className="bg-white h-screen dark:bg-gray-900 p-4 overflow-hidden">
      {!userId && (
        <div className="flex justify-end mb-4">
          <button
            className="bg-[--color2] text-white px-4 py-2 rounded hover:bg-[--color3]"
            onClick={() => openForm()}
          >
            Thêm lịch trình
          </button>
        </div>
      )}

      <Schedule
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={title}
        date={date}
        startTime={startTime}
        endTime={endTime}
        repeat={repeat}
        repeatWeekday={repeatWeekday}
        repeatFrom={date}
        repeatTo={repeatTo}
        editing={!!editingEvent}
        setTitle={setTitle}
        setDate={setDate}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        setRepeat={setRepeat}
        setRepeatWeekday={setRepeatWeekday}
        setRepeatFrom={() => {}}
        setRepeatTo={setRepeatTo}
        onSubmit={handleSubmit}
        onDelete={editingEvent ? handleDelete : undefined}
      />

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        messages={{
          today: "Hôm nay",
          previous: "Trước",
          next: "Sau",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
          agenda: "Lịch biểu",
          date: "Ngày",
          time: "Giờ",
          event: "Sự kiện",
          noEventsInRange: "Không có sự kiện nào trong khoảng này.",
        }}
        defaultView={Views.MONTH}
        views={["day", "week", "month"]}
        className="custom-calendar"
        style={{ height: "calc(100vh - 80px)" }}
        onSelectEvent={(event) => openForm(event as CustomEvent)}
        formats={{
          dayFormat: (date) =>
            moment(date)
              .format("dddd")
              .replace(/^\w/, (c) => c.toUpperCase()),
        }}
      />
    </div>
  );
};

export default MyCalendar;