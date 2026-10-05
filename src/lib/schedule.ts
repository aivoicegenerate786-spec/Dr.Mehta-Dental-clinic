import { HOURS } from "./clinic";

export const SLOT_MINUTES = 30;
export const BOOKING_WINDOW_DAYS = 30;
const TZ = "Asia/Kolkata";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const pad = (n: number) => String(n).padStart(2, "0");

export const fromMinutes = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

/** Current date (YYYY-MM-DD), weekday and minutes since midnight in India. */
export function nowInIndia(base: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(base);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  return { date, minutes: Number(get("hour")) * 60 + Number(get("minute")), weekday: weekdayOf(date) };
}

export function weekdayOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function isValidDateString(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** All bookable slots for a date, ignoring existing bookings. Past slots for today are excluded. */
export function slotsForDate(date: string, base: Date = new Date()): string[] {
  if (!isValidDateString(date)) return [];
  const hours = HOURS[weekdayOf(date)];
  if (!hours.open || !hours.close) return [];
  const now = nowInIndia(base);
  if (date < now.date || date > addDays(now.date, BOOKING_WINDOW_DAYS)) return [];
  const start = toMinutes(hours.open);
  const end = toMinutes(hours.close);
  const slots: string[] = [];
  for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) {
    // Lunch break on weekdays: 13:30 to 14:30
    if (hours.close === "18:00" && t >= 810 && t < 870) continue;
    // Require at least 60 minutes notice for same-day bookings
    if (date === now.date && t < now.minutes + 60) continue;
    slots.push(fromMinutes(t));
  }
  return slots;
}

export function upcomingDays(count = 21, base: Date = new Date()) {
  const today = nowInIndia(base).date;
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(today, i);
    return { date, weekday: weekdayOf(date), open: slotsForDate(date, base).length > 0 };
  });
}

export function formatTime12(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${pad(m)} ${suffix}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function dateParts(date: string) {
  const [, m, d] = date.split("-").map(Number);
  const wd = weekdayOf(date);
  return { day: d, month: MONTHS[m - 1], weekday: DAYS[wd], weekdayLong: DAYS_LONG[wd] };
}

export function formatDateLong(date: string) {
  const p = dateParts(date);
  const y = date.slice(0, 4);
  return `${p.weekdayLong}, ${p.day} ${p.month} ${y}`;
}

/** Live "open now" status for the clinic in India time. */
export function openStatus(base: Date = new Date()) {
  const now = nowInIndia(base);
  const h = HOURS[now.weekday];
  if (h.open && h.close) {
    const o = toMinutes(h.open);
    const c = toMinutes(h.close);
    if (now.minutes >= o && now.minutes < c) {
      return { open: true, label: `Open now, until ${formatTime12(h.close)}` };
    }
    if (now.minutes < o) return { open: false, label: `Opens today at ${formatTime12(h.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = HOURS[(now.weekday + i) % 7];
    if (next.open) {
      const when = i === 1 ? "tomorrow" : next.day;
      return { open: false, label: `Closed now, opens ${when} at ${formatTime12(next.open)}` };
    }
  }
  return { open: false, label: "Closed" };
}
