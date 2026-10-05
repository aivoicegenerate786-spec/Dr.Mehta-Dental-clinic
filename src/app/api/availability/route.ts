import { db } from "@/db";
import { appointments } from "@/db/schema";
import { isValidDateString, slotsForDate } from "@/lib/schedule";
import { and, eq, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!isValidDateString(date)) {
    return Response.json({ error: "Invalid date" }, { status: 400 });
  }
  const slots = slotsForDate(date);
  if (slots.length === 0) return Response.json({ date, slots: [] });

  const taken = await db
    .select({ time: appointments.time })
    .from(appointments)
  const takenSet = new Set(taken.map((t: any) => t.time));

  return Response.json({
    date,
    slots: slots.map((time) => ({ time, available: !takenSet.has(time) })),
  });
}
