"use client";

import { STATS } from "@/lib/clinic";
import { Counter, FadeUp, ParallaxImage, ScrollWords } from "../motion";

const WORDS = [
  "Smile Design",
  "Dental Implants",
  "Root Canal Treatment",
  "Clear Aligners",
  "Teeth Whitening",
  "Children's Dentistry",
  "Zirconia Crowns",
  "Wisdom Tooth Surgery",
];

export function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-bone py-6" aria-hidden>
      <div className="marquee-track flex w-max items-center">
        {row.map((w, i) => (
          <span key={i} className="flex items-center">
            <span className={`font-display px-8 text-4xl sm:text-5xl ${i % 2 ? "italic text-stone" : "text-ink"}`}>
              {w}
            </span>
            <span className="h-2 w-2 rounded-full bg-lime-deep" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Statement() {
  return (
    <section className="bg-paper py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <FadeUp>
            <p className="eyebrow text-stone">The practice</p>
          </FadeUp>
          <ScrollWords
            className="font-display text-[clamp(2rem,4.6vw,4.2rem)] leading-[1.08]"
            text="For fourteen years, families across Maninagar have trusted us with their smiles. We take the time to explain, never rush a decision, and only recommend what you genuinely need."
          />
        </div>

        <div className="mt-20 grid gap-6 lg:mt-28 lg:grid-cols-[1fr_1.4fr] lg:gap-10">
          <FadeUp className="flex flex-col justify-between gap-10 rounded-[28px] bg-ink p-8 text-bone sm:p-10">
            <p className="max-w-sm text-lg leading-relaxed text-white/70">
              A modern, sterile clinic with digital diagnostics, built around one idea: treatment should feel calm,
              predictable and honest.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10">
              {STATS.map((s) => (
                <div key={s.label}>
                  <Counter to={s.value} suffix={s.suffix} className="font-display block text-5xl sm:text-6xl" />
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <ParallaxImage
              src="/img/clinic-operatory.webp"
              alt="Treatment room at Dr. Mehta's Dental Care"
              className="aspect-[4/3] rounded-[28px] lg:aspect-auto lg:h-full lg:min-h-[520px]"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
