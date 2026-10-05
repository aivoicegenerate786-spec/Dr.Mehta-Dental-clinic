"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { BOOKING_TREATMENTS, CLINIC } from "@/lib/clinic";
import {
  addDays,
  dateParts,
  formatDateLong,
  formatTime12,
  SLOT_MINUTES,
  upcomingDays,
} from "@/lib/schedule";
import { ArrowLeft, ArrowRight, Calendar, Chat, Check, Clock, Pin, Shield } from "../icons";

type Slot = { time: string; available: boolean };
type Day = { date: string; weekday: number; open: boolean };
type Confirmed = { reference: string; treatment: string; date: string; time: string; name: string };

const STEPS = ["Treatment", "Date and time", "Your details"];

const TREATMENT_NOTES: Record<string, string> = {
  "Consultation and Check-up": "Examination, X-ray if needed, written plan",
  "Smile Design": "Digital smile preview and consultation",
  "Dental Implants": "Bone assessment and implant planning",
  "Root Canal Treatment": "Diagnosis and same-day pain relief",
  "Aligners and Braces": "Bite assessment and options",
  "Teeth Whitening": "Shade check and whitening plan",
  "Children's Dentistry": "Gentle check-up for your child",
  "Wisdom Tooth or Extraction": "Assessment and extraction planning",
  "Tooth Pain or Emergency": "Priority slot for urgent relief",
  "Something else": "Tell us in the notes",
};

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

function gcalLink(c: Confirmed) {
  const start = `${c.date.replaceAll("-", "")}T${c.time.replace(":", "")}00`;
  const [h, m] = c.time.split(":").map(Number);
  const endMins = h * 60 + m + SLOT_MINUTES;
  const end = `${c.date.replaceAll("-", "")}T${String(Math.floor(endMins / 60)).padStart(2, "0")}${String(endMins % 60).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${c.treatment} at Dr. Mehta's Dental Care`,
    dates: `${start}/${end}`,
    ctz: "Asia/Kolkata",
    details: `Booking reference ${c.reference}. Phone ${CLINIC.phoneDisplay}`,
    location: CLINIC.addressLines.join(", "),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function BookingFlow({ preset, onDone }: { preset?: string; onDone?: () => void }) {
  const [step, setStep] = useState(preset ? 1 : 0);
  const [dir, setDir] = useState(1);
  const [treatment, setTreatment] = useState<string>(preset ?? "");
  const [days, setDays] = useState<Day[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotError, setSlotError] = useState(false);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [firstVisit, setFirstVisit] = useState(true);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  useEffect(() => {
    const d = upcomingDays(21);
    setDays(d);
    setDate((cur) => cur || d.find((x) => x.open)?.date || "");
  }, []);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setSlots(null);
    setSlotError(false);
    fetch(`/api/availability?date=${date}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { slots: Slot[] }) => {
        if (!cancelled) setSlots(data.slots);
      })
      .catch(() => {
        if (!cancelled) {
          setSlots([]);
          setSlotError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const grouped = useMemo(() => {
    const g: { label: string; items: Slot[] }[] = [
      { label: "Morning", items: [] },
      { label: "Afternoon", items: [] },
      { label: "Evening", items: [] },
    ];
    (slots ?? []).forEach((s) => {
      const h = Number(s.time.slice(0, 2));
      g[h < 12 ? 0 : h < 16 ? 1 : 2].items.push(s);
    });
    return g.filter((x) => x.items.length > 0);
  }, [slots]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const pickTreatment = (t: string) => {
    setTreatment(t);
    setTimeout(() => go(1), 180);
  };

  const pickDate = (d: string) => {
    setDate(d);
    setTime("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your full name";
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Enter a valid 10 digit mobile number";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treatment, date, time, name, phone, email, firstVisit, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        if (res.status === 409) {
          setTime("");
          const d = date;
          setDate("");
          setTimeout(() => setDate(d), 0);
          go(1);
        }
        return;
      }
      setConfirmed(data as Confirmed);
      setDir(1);
      setStep(3);
    } catch {
      setServerError("Network issue. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const tomorrow = days[0] ? addDays(days[0].date, 1) : "";
  const dayLabel = (d: string) =>
    d === days[0]?.date ? "Today" : d === tomorrow ? "Tomorrow" : dateParts(d).weekday;

  const waText = confirmed
    ? `Hello Dr. Mehta's Dental Care, I have booked an appointment.\nReference: ${confirmed.reference}\nName: ${confirmed.name}\nTreatment: ${confirmed.treatment}\nDate: ${formatDateLong(confirmed.date)}\nTime: ${formatTime12(confirmed.time)}`
    : "";

  return (
    <div className="grid min-h-full overflow-hidden bg-paper text-ink md:grid-cols-[300px_1fr]">
      {/* Summary rail */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-8 text-bone md:flex">
        <div className="grain absolute inset-0" />
        <div className="relative">
          <p className="eyebrow text-lime">Book a visit</p>
          <h3 className="font-display mt-4 text-4xl leading-[1.05]">
            Your appointment, <em className="text-mist">in three steps.</em>
          </h3>
        </div>
        <dl className="relative mt-10 space-y-5 text-sm">
          {[
            { k: "Treatment", v: treatment || "Not selected" },
            { k: "Date", v: date ? formatDateLong(date) : "Not selected" },
            { k: "Time", v: time ? formatTime12(time) : "Not selected" },
          ].map((r) => (
            <div key={r.k} className="border-t border-white/10 pt-4">
              <dt className="eyebrow text-stone">{r.k}</dt>
              <dd className={`mt-1.5 ${r.v === "Not selected" ? "text-white/35" : "text-bone"}`}>{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="relative mt-10 space-y-3 text-xs text-white/55">
          <p className="flex gap-2.5">
            <Pin className="h-4 w-4 shrink-0" /> Maninagar, Ahmedabad
          </p>
          <p className="flex gap-2.5">
            <Shield className="h-4 w-4 shrink-0" /> Free to book. Confirmation call within working hours.
          </p>
        </div>
      </aside>

      <div className="flex min-h-[560px] flex-col">
        {step < 3 && (
          <div className="border-b border-ink/10 px-5 pb-5 pr-16 pt-6 sm:px-10 sm:pr-20 sm:pt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-stone">
                Step {step + 1} of 3 <span className="mx-2 text-mist">/</span>
                <span className="text-ink">{STEPS[step]}</span>
              </p>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  className="group flex items-center gap-1.5 text-sm text-stone transition-colors hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back
                </button>
              )}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {STEPS.map((s, i) => (
                <div key={s} className="h-[3px] overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className="h-full bg-ink"
                    initial={false}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="px-5 py-6 sm:px-10 sm:py-8"
            >
              {step === 0 && (
                <div>
                  <h4 className="font-display text-3xl sm:text-4xl">What brings you in?</h4>
                  <p className="mt-2 text-sm text-stone">Not sure? Choose a consultation and we will guide you.</p>
                  <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                    {BOOKING_TREATMENTS.map((t) => {
                      const active = treatment === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => pickTreatment(t)}
                          className={`group flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                            active
                              ? "border-ink bg-ink text-bone"
                              : "border-ink/10 bg-white hover:border-ink/40 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]"
                          }`}
                        >
                          <span>
                            <span className="block text-[15px] font-medium">{t}</span>
                            <span className={`mt-0.5 block text-xs ${active ? "text-white/60" : "text-stone"}`}>
                              {TREATMENT_NOTES[t]}
                            </span>
                          </span>
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all ${
                              active ? "border-lime bg-lime text-ink" : "border-ink/15 group-hover:border-ink"
                            }`}
                          >
                            {active ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h4 className="font-display text-3xl sm:text-4xl">Pick a day and time</h4>
                    {treatment && (
                      <button
                        type="button"
                        onClick={() => go(0)}
                        className="rounded-full border border-ink/15 px-3 py-1 text-xs text-stone transition-colors hover:border-ink hover:text-ink"
                      >
                        {treatment}, change
                      </button>
                    )}
                  </div>
                  {serverError && (
                    <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
                  )}
                  <div
                    className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-10 sm:px-10"
                    data-lenis-prevent
                  >
                    {days.map((d) => {
                      const p = dateParts(d.date);
                      const active = d.date === date;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          disabled={!d.open}
                          onClick={() => pickDate(d.date)}
                          className={`flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-3 transition-all duration-300 ${
                            active
                              ? "border-ink bg-ink text-bone"
                              : d.open
                                ? "border-ink/10 bg-white hover:border-ink/40"
                                : "cursor-not-allowed border-transparent bg-ink/[0.03] text-ink/25"
                          }`}
                        >
                          <span className={`text-[10px] uppercase tracking-wider ${active ? "text-lime" : ""}`}>
                            {dayLabel(d.date)}
                          </span>
                          <span className="font-display mt-1 text-2xl leading-none">{p.day}</span>
                          <span className="mt-1 text-[11px]">{d.open ? p.month : "Closed"}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 min-h-[200px]">
                    {slots === null ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="h-11 animate-pulse rounded-xl bg-ink/[0.06]" />
                        ))}
                      </div>
                    ) : slotError ? (
                      <p className="text-sm text-stone">
                        We could not load times right now. Please call{" "}
                        <a className="text-ink underline" href={CLINIC.phoneHref}>
                          {CLINIC.phoneDisplay}
                        </a>
                        .
                      </p>
                    ) : grouped.length === 0 || grouped.every((g) => g.items.every((s) => !s.available)) ? (
                      <p className="text-sm text-stone">This day is fully booked. Please choose another date.</p>
                    ) : (
                      <div className="space-y-5">
                        {grouped.map((g) => (
                          <div key={g.label}>
                            <p className="eyebrow mb-2.5 text-stone">{g.label}</p>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {g.items.map((s) => {
                                const active = s.time === time;
                                return (
                                  <button
                                    key={s.time}
                                    type="button"
                                    disabled={!s.available}
                                    onClick={() => setTime(s.time)}
                                    className={`h-11 rounded-xl border text-sm transition-all duration-200 ${
                                      active
                                        ? "border-ink bg-ink text-bone"
                                        : s.available
                                          ? "border-ink/10 bg-white hover:border-ink/50"
                                          : "cursor-not-allowed border-transparent bg-ink/[0.03] text-ink/25 line-through"
                                    }`}
                                  >
                                    {formatTime12(s.time)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
                    <p className="text-sm text-stone">
                      {time ? (
                        <>
                          <span className="text-ink">{formatDateLong(date)}</span> at {formatTime12(time)}
                        </>
                      ) : (
                        "Select a time to continue"
                      )}
                    </p>
                    <button
                      type="button"
                      disabled={!time}
                      onClick={() => {
                        setServerError("");
                        go(2);
                      }}
                      className="group flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-bone transition-all hover:bg-ink-3 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    submit();
                  }}
                >
                  <h4 className="font-display text-3xl sm:text-4xl">Almost done</h4>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-stone">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {formatDateLong(date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {formatTime12(time)}
                    </span>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name} className="sm:col-span-2">
                      <input
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="As it should appear on your file"
                        className={inputCls(!!errors.name)}
                      />
                    </Field>
                    <Field label="Mobile number" error={errors.phone}>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone">
                          +91
                        </span>
                        <input
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={phone}
                          maxLength={11}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
                          placeholder="98765 43210"
                          className={`${inputCls(!!errors.phone)} pl-12`}
                        />
                      </div>
                    </Field>
                    <Field label="Email (optional)" error={errors.email}>
                      <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls(!!errors.email)}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <p className="mb-2 text-xs font-medium text-ink/70">Have you visited us before?</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { v: true, l: "First visit" },
                          { v: false, l: "Returning patient" },
                        ].map((o) => (
                          <button
                            key={o.l}
                            type="button"
                            onClick={() => setFirstVisit(o.v)}
                            className={`h-11 rounded-xl border text-sm transition-all ${
                              firstVisit === o.v ? "border-ink bg-ink text-bone" : "border-ink/10 bg-white hover:border-ink/40"
                            }`}
                          >
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label="Anything we should know? (optional)" className="sm:col-span-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Pain, sensitivity, previous treatment, preferred doctor"
                        className={`${inputCls(false)} h-auto resize-none py-3`}
                      />
                    </Field>
                  </div>

                  {serverError && (
                    <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
                  )}

                  <div className="mt-7 flex flex-col-reverse items-stretch gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-start gap-2 text-xs text-stone sm:max-w-[260px]">
                      <Shield className="mt-px h-4 w-4 shrink-0" />
                      Your details are only used to confirm this appointment.
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm text-bone transition-all hover:bg-ink-3 disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-bone/30 border-t-bone" />
                          Confirming
                        </>
                      ) : (
                        <>
                          Confirm appointment
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && confirmed && (
                <div className="flex flex-col items-start py-4 sm:py-8">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-lime text-ink"
                  >
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2}>
                      <motion.path
                        d="m5 12.5 4.5 4.5L19 7.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p className="eyebrow mt-8 text-stone">Request received</p>
                  <h4 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
                    See you soon, {confirmed.name.split(" ")[0]}.
                  </h4>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
                    Your slot is reserved. Our front desk will call you on the number you shared to confirm. Keep your
                    reference handy.
                  </p>
                  <div className="mt-8 w-full rounded-2xl border border-ink/10 bg-white p-5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-dashed border-ink/15 pb-4">
                      <span className="eyebrow text-stone">Reference</span>
                      <span className="font-mono text-lg tracking-wider">{confirmed.reference}</span>
                    </div>
                    <dl className="grid gap-4 pt-4 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-xs text-stone">Treatment</dt>
                        <dd className="mt-1">{confirmed.treatment}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-stone">Date</dt>
                        <dd className="mt-1">{formatDateLong(confirmed.date)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-stone">Time</dt>
                        <dd className="mt-1">{formatTime12(confirmed.time)}</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6 grid w-full gap-2.5 sm:grid-cols-3">
                    <a
                      href={gcalLink(confirmed)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm transition-colors hover:border-ink"
                    >
                      <Calendar className="h-4 w-4" /> Add to calendar
                    </a>
                    <a
                      href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(waText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm transition-colors hover:border-ink"
                    >
                      <Chat className="h-4 w-4" /> Share on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={onDone}
                      className="rounded-full bg-ink px-5 py-3 text-sm text-bone transition-colors hover:bg-ink-3"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const inputCls = (err: boolean) =>
  `h-12 w-full rounded-xl border bg-white px-4 text-[15px] outline-none transition-all placeholder:text-ink/30 focus:border-ink focus:shadow-[0_0_0_4px_rgba(12,14,13,0.06)] ${
    err ? "border-red-400" : "border-ink/12"
  }`;

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-medium text-ink/70">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
