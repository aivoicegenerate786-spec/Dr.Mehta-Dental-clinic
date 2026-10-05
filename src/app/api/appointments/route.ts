import { db } from "@/db";
import { appointments } from "@/db/schema";
import { BOOKING_TREATMENTS } from "@/lib/clinic";
import { slotsForDate } from "@/lib/schedule";
import { and, eq, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "DMC-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const treatment = clean(body.treatment, 80);
  const date = clean(body.date, 10);
  const time = clean(body.time, 5);
  const name = clean(body.name, 80);
  const phoneRaw = clean(body.phone, 20).replace(/[^\d]/g, "");
  const email = clean(body.email, 120);
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 600) : "";
  const firstVisit = body.firstVisit !== false;

  const phone = phoneRaw.length === 12 && phoneRaw.startsWith("91") ? phoneRaw.slice(2) : phoneRaw;

  if (!BOOKING_TREATMENTS.includes(treatment)) {
    return Response.json({ error: "Please choose a treatment." }, { status: 400 });
  }
  if (name.length < 2) {
    return Response.json({ error: "Please enter your full name." }, { status: 400 });
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return Response.json({ error: "Please enter a valid 10 digit mobile number." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!slotsForDate(date).includes(time)) {
    return Response.json(
      { error: "That time is no longer available. Please pick another slot." },
      { status: 409 },
    );
  }

  try {
    const result = await db.transaction(async (tx: any) => {
      const clash = await tx
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(eq(appointments.date, date), eq(appointments.time, time), ne(appointments.status, "cancelled")),
        )
        .limit(1);
      if (clash.length > 0) return null;

      const [row] = await tx
        .insert(appointments)
        .values({
          reference: makeReference(),
          treatment,
          date,
          time,
          name,
          phone,
          email: email || null,
          notes: notes || null,
          firstVisit,
        })
        .returning();
      return row;
    });

    if (!result) {
      return Response.json(
        { error: "Someone just booked that slot. Please choose another time." },
        { status: 409 },
      );
    }

    return Response.json({
      reference: result.reference,
      treatment: result.treatment,
      date: result.date,
      time: result.time,
      name: result.name,
    });
  } catch (err) {
    console.error("Booking failed", err);
    return Response.json({ error: "We could not save your booking. Please call us." }, { status: 500 });
  }
}
