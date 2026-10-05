import type { Metadata } from "next";
import { asc, desc, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { isAdminKey } from "@/lib/admin";
import { formatDateLong, formatTime12, nowInIndia } from "@/lib/schedule";
import StatusControl from "./StatusControl";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Appointments | Dr. Mehta's Dental Care", robots: { index: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ key?: string; view?: string }> }) {
  const { key, view } = await searchParams;

  if (!isAdminKey(key)) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-5 text-bone">
        <form className="w-full max-w-sm" method="get">
          <p className="eyebrow text-lime">Front desk</p>
          <h1 className="font-display mt-3 text-5xl">Appointments</h1>
          <p className="mt-3 text-sm text-white/50">Enter the clinic access key to continue.</p>
          <input
            name="key"
            type="password"
            autoFocus
            placeholder="Access key"
            className="mt-8 h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 outline-none focus:border-lime"
          />
          {key && <p className="mt-2 text-xs text-red-400">Incorrect key.</p>}
          <button className="mt-4 h-12 w-full rounded-full bg-lime text-ink">Open dashboard</button>
        </form>
      </main>
    );
  }

  const today = nowInIndia().date;
  const past = view === "past";
  const rows = past
    ? await db
        .select()
        .from(appointments)
        .where(lt(appointments.date, today))
        .orderBy(desc(appointments.date), desc(appointments.time))
        .limit(200)
    : await db
        .select()
        .from(appointments)
        .where(gte(appointments.date, today))
        .orderBy(asc(appointments.date), asc(appointments.time));

  const counts = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    today: rows.filter((r) => r.date === today && r.status !== "cancelled").length,
  };

  const groups = new Map<string, typeof rows>();
  rows.forEach((r) => groups.set(r.date, [...(groups.get(r.date) ?? []), r]));

  return (
    <main className="min-h-screen bg-paper pb-20 text-ink">
      <header className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className="eyebrow text-lime">Dr. Mehta&apos;s Dental Care</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-5xl">Appointments</h1>
            <nav className="flex gap-2 text-sm">
              <a
                href={`/admin?key=${encodeURIComponent(key!)}`}
                className={`rounded-full px-4 py-2 ${!past ? "bg-bone text-ink" : "border border-white/20"}`}
              >
                Upcoming
              </a>
              <a
                href={`/admin?key=${encodeURIComponent(key!)}&view=past`}
                className={`rounded-full px-4 py-2 ${past ? "bg-bone text-ink" : "border border-white/20"}`}
              >
                Past
              </a>
            </nav>
          </div>
          {!past && (
            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-white/10">
              {[
                ["Upcoming", counts.total],
                ["Awaiting confirmation", counts.pending],
                ["Today", counts.today],
              ].map(([l, v]) => (
                <div key={l} className="bg-ink-2 p-5">
                  <p className="font-display text-4xl">{v}</p>
                  <p className="mt-1 text-xs text-white/50">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {rows.length === 0 && (
          <p className="py-20 text-center text-stone">No {past ? "past" : "upcoming"} appointments yet.</p>
        )}
        {[...groups.entries()].map(([date, items]) => (
          <section key={date} className="mt-10">
            <h2 className="font-display text-2xl">
              {formatDateLong(date)}
              {date === today && <span className="ml-3 rounded-full bg-lime px-2 py-0.5 align-middle text-xs">Today</span>}
            </h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
              {items.map((r) => (
                <div
                  key={r.id}
                  className="grid gap-3 border-b border-ink/[0.07] p-5 last:border-0 md:grid-cols-[90px_1.2fr_1fr_auto] md:items-center"
                >
                  <p className="font-medium tabular-nums">{formatTime12(r.time)}</p>
                  <div>
                    <p className="font-medium">
                      {r.name}{" "}
                      <span className="ml-1 text-xs font-normal text-stone">
                        {r.firstVisit ? "New patient" : "Returning"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-stone">
                      <a href={`tel:+91${r.phone}`} className="hover:text-ink">
                        +91 {r.phone}
                      </a>
                      {r.email ? ` / ${r.email}` : ""}
                    </p>
                    {r.notes && <p className="mt-1.5 text-sm text-ink/70">{r.notes}</p>}
                  </div>
                  <div className="text-sm">
                    <p>{r.treatment}</p>
                    <p className="mt-0.5 font-mono text-xs text-stone">{r.reference}</p>
                  </div>
                  <StatusControl id={r.id} status={r.status} adminKey={key!} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
