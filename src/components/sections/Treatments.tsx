"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { TREATMENT_TO_BOOKING, TREATMENTS } from "@/lib/clinic";
import { ArrowUpRight, Plus } from "../icons";
import { FadeUp, SplitReveal } from "../motion";
import { useApp } from "../Providers";

export default function Treatments() {
  const { openBooking } = useApp();
  const [open, setOpen] = useState<number | null>(0);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

  return (
    <section
      id="treatments"
      className="relative bg-paper pb-24 sm:pb-36"
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-8 border-t border-ink/10 pt-16 lg:grid-cols-[1fr_auto] lg:items-end lg:pt-24">
          <div>
            <FadeUp>
              <p className="eyebrow text-stone">Treatments</p>
            </FadeUp>
            <SplitReveal
              text="Everything your smile needs, under one roof."
              italicWords={["under", "one", "roof."]}
              className="font-display mt-5 max-w-4xl text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98]"
            />
          </div>
          <FadeUp delay={0.2}>
            <p className="max-w-sm text-[15px] leading-relaxed text-stone">
              From a routine clean to a complete smile makeover, every plan begins with a careful examination and an
              honest conversation.
            </p>
          </FadeUp>
        </div>

        <ul className="mt-14 border-t border-ink/10 lg:mt-20" onMouseLeave={() => setHover(null)}>
          {TREATMENTS.map((t, i) => {
            const isOpen = open === i;
            return (
              <li key={t.slug} className="border-b border-ink/10" onMouseEnter={() => setHover(i)}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-6 text-left sm:grid-cols-[4rem_1fr_10rem_10rem_auto] sm:gap-6 sm:py-8"
                >
                  <span className="text-sm tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`font-display text-[clamp(1.9rem,4.2vw,3.6rem)] leading-none transition-all duration-500 group-hover:translate-x-2 group-hover:italic ${
                      isOpen ? "italic" : ""
                    }`}
                  >
                    {t.title}
                  </span>
                  <span className="eyebrow hidden text-stone sm:block">{t.kicker}</span>
                  <span className="hidden text-sm text-stone sm:block">{t.duration}</span>
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full border transition-all duration-500 ${
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
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-10 sm:grid-cols-[4rem_1fr] sm:gap-6">
                        <span />
                        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
                          <div>
                            <p className="max-w-xl text-lg leading-relaxed text-ink/75">{t.summary}</p>
                            <ul className="mt-6 flex flex-wrap gap-2">
                              {t.points.map((p) => (
                                <li key={p} className="rounded-full border border-ink/12 px-4 py-2 text-sm text-ink/70">
                                  {p}
                                </li>
                              ))}
                            </ul>
                            <button
                              type="button"
                              onClick={() => openBooking(TREATMENT_TO_BOOKING[t.slug])}
                              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm text-bone transition-colors hover:bg-ink-3"
                            >
                              Book a {t.title.toLowerCase()} consultation
                              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                            </button>
                          </div>
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[16/10]">
                            <Image
                              src={t.image}
                              alt={t.title}
                              fill
                              sizes="(min-width: 1024px) 40vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Cursor-follow preview (desktop) */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-30 hidden lg:block"
        aria-hidden
      >
        <AnimatePresence>
          {hover !== null && hover !== open && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative -ml-[150px] -mt-[200px] h-[260px] w-[220px] overflow-hidden rounded-2xl shadow-2xl"
            >
              {TREATMENTS.map((t, i) => (
                <motion.div
                  key={t.slug}
                  className="absolute inset-0"
                  animate={{ opacity: hover === i ? 1 : 0, scale: hover === i ? 1 : 1.15 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image src={t.image} alt="" fill sizes="220px" className="object-cover" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
