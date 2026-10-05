"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CLINIC, FAQS, HOURS } from "@/lib/clinic";
import { formatTime12, nowInIndia } from "@/lib/schedule";
import BookingFlow from "../booking/BookingFlow";
import { Logo } from "../Chrome";
import { ArrowUpRight, Chat, Clock, Facebook, Instagram, Mail, Phone, Pin, Plus } from "../icons";
import { FadeUp, SplitReveal } from "../motion";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-paper py-24 sm:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
          <FadeUp>
            <p className="eyebrow text-stone">Questions</p>
          </FadeUp>
          <SplitReveal
            text="Good to know before you come in."
            italicWords={["before", "you", "come", "in."]}
            className="font-display mt-5 text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[1]"
          />
          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-stone">
              Still unsure about something? Call us on{" "}
              <a href={CLINIC.phoneHref} className="link-underline text-ink">
                {CLINIC.phoneDisplay}
              </a>{" "}
              and speak to the front desk directly.
            </p>
          </FadeUp>
        </div>
        <div className="border-t border-ink/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-ink/10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <span className="font-display text-2xl leading-snug transition-transform duration-500 group-hover:translate-x-1.5 sm:text-3xl">
                    {f.q}
                  </span>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                      isOpen ? "rotate-45 border-ink bg-ink text-bone" : "border-ink/15 group-hover:border-ink"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-8 text-[15px] leading-relaxed text-stone">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function BookSection() {
  const [key, setKey] = useState(0);
  return (
    <section id="book" className="grain relative overflow-hidden bg-ink py-24 text-bone sm:py-36">
      <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-lime/[0.06] blur-[140px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <FadeUp>
              <p className="eyebrow text-lime">Online booking</p>
            </FadeUp>
            <SplitReveal
              text="Reserve your visit in under a minute."
              italicWords={["under", "a", "minute."]}
              className="font-display mt-5 max-w-4xl text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98]"
            />
          </div>
          <FadeUp delay={0.15}>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>Live availability, updated in real time</li>
              <li>No payment needed to book</li>
              <li>Confirmation call from our front desk</li>
            </ul>
          </FadeUp>
        </div>
        <FadeUp delay={0.1} className="mt-14 lg:mt-20">
          <div className="overflow-hidden rounded-[28px] ring-1 ring-white/10">
            <BookingFlow key={key} onDone={() => setKey((k) => k + 1)} />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export function Contact() {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(nowInIndia().weekday), []);
  const order = [1, 2, 3, 4, 5, 6, 0];

  return (
    <section id="visit" className="bg-paper py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <FadeUp>
          <p className="eyebrow text-stone">Visit us</p>
        </FadeUp>
        <SplitReveal
          text="We would love to meet you."
          italicWords={["meet", "you."]}
          className="font-display mt-5 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98]"
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[1fr_1.25fr]">
          <FadeUp className="grid gap-6">
            <div className="rounded-[24px] border border-ink/10 bg-white p-7 sm:p-9">
              <div className="flex gap-4">
                <Pin className="mt-1 h-5 w-5 shrink-0 text-stone" />
                <address className="not-italic leading-relaxed">
                  {CLINIC.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </div>
              <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
                <a
                  href={CLINIC.phoneHref}
                  className="flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm text-bone transition-colors hover:bg-ink-3"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hello, I would like to book an appointment.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-3 text-sm transition-colors hover:border-ink"
                >
                  <Chat className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={CLINIC.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-ink/15 px-4 py-3 text-sm transition-colors hover:border-ink"
                >
                  <ArrowUpRight className="h-4 w-4" /> Directions
                </a>
              </div>
              <a
                href={`mailto:${CLINIC.email}`}
                className="mt-6 flex items-center gap-3 break-all text-sm text-stone transition-colors hover:text-ink"
              >
                <Mail className="h-4 w-4 shrink-0" /> {CLINIC.email}
              </a>
            </div>

            <div className="rounded-[24px] border border-ink/10 bg-white p-7 sm:p-9">
              <p className="flex items-center gap-2.5 text-sm text-stone">
                <Clock className="h-4 w-4" /> Opening hours
              </p>
              <ul className="mt-5 divide-y divide-ink/[0.07]">
                {order.map((d) => {
                  const h = HOURS[d];
                  const isToday = today === d;
                  return (
                    <li
                      key={h.day}
                      className={`flex items-center justify-between py-3 text-[15px] ${isToday ? "text-ink" : "text-ink/60"}`}
                    >
                      <span className="flex items-center gap-2.5">
                        {h.day}
                        {isToday && (
                          <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink">
                            Today
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">
                        {h.open && h.close ? `${formatTime12(h.open)} to ${formatTime12(h.close)}` : "Closed"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="group relative h-full min-h-[420px] overflow-hidden rounded-[24px] border border-ink/10 bg-mist">
              <iframe
                title="Map to Dr. Mehta's Dental Care"
                src={CLINIC.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale transition-all duration-700 group-hover:grayscale-0"
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return (
    <footer className="grain relative overflow-hidden bg-ink pb-28 pt-20 text-bone md:pb-10">
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              Smile design, implants and family dentistry in Maninagar, Ahmedabad. Caring for smiles since 2012.
            </p>
          </div>
          <div>
            <p className="eyebrow text-white/40">Explore</p>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              {[
                ["#treatments", "Treatments"],
                ["#results", "Results"],
                ["#patients", "Patients"],
                ["#doctors", "Doctors"],
                ["#book", "Book online"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="link-underline hover:text-bone">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-white/40">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <a href={CLINIC.phoneHref} className="link-underline hover:text-bone">
                  {CLINIC.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CLINIC.email}`} className="link-underline break-all hover:text-bone">
                  Email us
                </a>
              </li>
              <li>
                <a href={CLINIC.mapsLink} target="_blank" rel="noreferrer" className="link-underline hover:text-bone">
                  Directions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-white/40">Follow</p>
            <div className="mt-5 flex gap-2.5">
              <a
                href={CLINIC.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-all hover:border-lime hover:bg-lime hover:text-ink"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={CLINIC.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-all hover:border-lime hover:bg-lime hover:text-ink"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <p
          aria-hidden
          className="font-display select-none whitespace-nowrap py-10 text-center text-[17vw] leading-[0.8] text-white/[0.06] sm:text-[15vw]"
        >
          Dr. Mehta&apos;s
        </p>
        <div className="flex flex-col gap-3 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {CLINIC.name}. All rights reserved.
          </p>
          <p>Maninagar, Ahmedabad, Gujarat</p>
        </div>
      </div>
    </footer>
  );
}
