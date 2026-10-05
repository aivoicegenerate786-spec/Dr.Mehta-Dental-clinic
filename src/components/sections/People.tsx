"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { CLINIC, DOCTORS } from "@/lib/clinic";
import { ArrowUpRight } from "../icons";
import { FadeUp, ParallaxImage, SplitReveal } from "../motion";
import { useApp } from "../Providers";

export function Doctors() {
  return (
    <section id="doctors" className="bg-paper py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <FadeUp>
              <p className="eyebrow text-stone">Your doctors</p>
            </FadeUp>
            <SplitReveal
              text="Experienced hands. Familiar faces."
              italicWords={["Familiar", "faces."]}
              className="font-display mt-5 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98]"
            />
          </div>
          <FadeUp delay={0.15}>
            <p className="max-w-sm text-[15px] leading-relaxed text-stone">
              You are seen by the same doctors from consultation to final check, not passed between strangers.
            </p>
          </FadeUp>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {DOCTORS.map((d, i) => (
            <FadeUp key={d.name} delay={i * 0.12} className={i === 1 ? "lg:mt-16" : ""}>
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-mist">
                  <Image
                    src={d.image}
                    alt={`${d.name}, ${d.credentials}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top grayscale-[35%] transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <p className="absolute inset-x-6 bottom-6 translate-y-6 text-sm leading-relaxed text-white/90 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                    {d.bio}
                  </p>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl leading-tight">{d.name}</h3>
                    <p className="mt-1 text-sm text-stone">{d.role}</p>
                  </div>
                  <span className="mt-2 shrink-0 rounded-full border border-ink/12 px-3 py-1 text-xs text-ink/70">
                    {d.credentials}
                  </span>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Team() {
  return (
    <section className="bg-paper pb-24 sm:pb-36">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
        <ParallaxImage
          src="/img/team.webp"
          alt="The full team at Dr. Mehta's Dental Care"
          className="aspect-[4/5] rounded-[28px]"
          sizes="(min-width: 1024px) 50vw, 100vw"
          strength={8}
        />
        <div>
          <FadeUp>
            <p className="eyebrow text-stone">Behind every visit</p>
          </FadeUp>
          <SplitReveal
            text="A team that remembers your name."
            italicWords={["remembers"]}
            className="font-display mt-5 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1]"
          />
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone">
              From the front desk to the treatment room, our staff is trained to keep you informed and at ease. Strict
              sterilisation protocols come as standard, on every visit.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
              {[
                ["Sterile", "Autoclave sterilisation for every instrument"],
                ["Digital", "Digital X-rays and smile planning"],
                ["Transparent", "Written plan and estimate before treatment"],
                ["Gentle", "Effective anaesthesia, paced at your comfort"],
              ].map(([k, v]) => (
                <li key={k} className="bg-paper p-5">
                  <p className="font-display text-2xl">{k}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone">{v}</p>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function ClinicBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  return (
    <section ref={ref} className="bg-paper">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className="relative h-[85vh] min-h-[560px] overflow-hidden"
      >
        <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[15%]">
          <Image
            src="/img/clinic-exterior.webp"
            alt="Dr. Mehta's Dental Care clinic exterior in Maninagar, Ahmedabad"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/80" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1400px] flex-col gap-6 px-5 pb-12 text-bone sm:px-8 sm:pb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-white/60">The clinic</p>
            <SplitReveal
              text="Find us on Ghodasar Canal Garden Road."
              italicWords={["Ghodasar", "Canal", "Garden", "Road."]}
              className="font-display mt-4 max-w-3xl text-[clamp(2.4rem,5.4vw,5rem)] leading-[1]"
            />
          </div>
          <a
            href={CLINIC.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm backdrop-blur-md transition-colors hover:bg-bone hover:text-ink"
          >
            Get directions
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

const STEPS = [
  {
    t: "Book in under a minute",
    d: "Choose a treatment, date and time online. Our front desk calls to confirm the same day.",
  },
  {
    t: "Examination and diagnosis",
    d: "A thorough check-up with digital X-rays where needed, so nothing is guessed.",
  },
  {
    t: "A clear, written plan",
    d: "Options explained in plain language with costs upfront. You decide, without pressure.",
  },
  {
    t: "Treatment and aftercare",
    d: "Comfortable, unhurried treatment followed by reminders for your review visits.",
  },
];

export function Process() {
  const { openBooking } = useApp();
  return (
    <section className="bg-bone py-24 sm:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <FadeUp>
            <p className="eyebrow text-stone">Your first visit</p>
          </FadeUp>
          <SplitReveal
            text="Simple from the very first click."
            italicWords={["first", "click."]}
            className="font-display mt-5 text-[clamp(2.4rem,4.8vw,4.6rem)] leading-[1]"
          />
          <FadeUp delay={0.2}>
            <button
              type="button"
              onClick={() => openBooking()}
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm text-bone transition-colors hover:bg-ink-3"
            >
              Start booking
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </FadeUp>
        </div>
        <div className="border-t border-ink/10" role="list">
          {STEPS.map((s, i) => (
            <FadeUp key={s.t} delay={i * 0.08}>
              <div role="listitem" className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-ink/10 py-9 sm:grid-cols-[5rem_1fr] sm:py-11">
                <span className="font-display text-4xl text-ink/25 transition-colors duration-500 group-hover:text-lime-deep sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-3xl leading-tight sm:text-4xl">{s.t}</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-stone">{s.d}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
