"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { PATIENT_STORIES } from "@/lib/clinic";
import { ChevronLeft, ChevronRight } from "../icons";
import { FadeUp, SplitReveal } from "../motion";

const DURATION = 6500;

export default function Patients() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const total = PATIENT_STORIES.length;

  const go = useCallback(
    (next: number) => {
      setDir(next > index || (index === total - 1 && next === 0) ? 1 : -1);
      setIndex((next + total) % total);
    },
    [index, total],
  );

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  const s = PATIENT_STORIES[index];

  return (
    <section id="patients" className="overflow-hidden bg-bone py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <FadeUp>
              <p className="eyebrow text-stone">Happy patients</p>
            </FadeUp>
            <SplitReveal
              text="The best review is a smile."
              italicWords={["smile."]}
              className="font-display mt-5 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98]"
            />
          </div>
          <FadeUp delay={0.15}>
            <p className="max-w-xs text-[15px] leading-relaxed text-stone">
              Real patients photographed at our clinic, sharing what their visit was like.
            </p>
          </FadeUp>
        </div>

        <div
          className="mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Image stack */}
          <div className="relative order-1 mx-auto w-full max-w-[520px] lg:order-none">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rotate-[3deg] rounded-[28px] bg-mist/70" />
            <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-[1.5deg] rounded-[28px] bg-mist" />
            <motion.div
              className="relative aspect-[4/5] cursor-grab overflow-hidden rounded-[28px] bg-ink active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(index + 1);
                else if (info.offset.x > 60) go(index - 1);
              }}
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  initial={{ clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.15 }}
                  animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
                  exit={{ opacity: 0.6 }}
                  transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={s.image}
                    alt={`${s.who}, ${s.treatment}`}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="pointer-events-none select-none object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1.5 text-[10px] text-ink">
                {s.treatment}
              </span>
            </motion.div>
          </div>

          {/* Quote */}
          <div className="relative">
            <span className="font-display pointer-events-none absolute -left-2 -top-16 select-none text-[10rem] leading-none text-ink/[0.07] sm:-top-20 sm:text-[14rem]">
              &ldquo;
            </span>
            <div className="relative min-h-[260px] sm:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <blockquote className="font-display text-[clamp(1.8rem,3.2vw,2.9rem)] leading-[1.15]">
                    {s.quote}
                  </blockquote>
                  <p className="mt-8 text-sm text-ink">{s.who}</p>
                  <p className="mt-1 text-sm text-stone">{s.treatment}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous story"
                  onClick={() => go(index - 1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 transition-all hover:border-ink hover:bg-ink hover:text-bone"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next story"
                  onClick={() => go(index + 1)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 transition-all hover:border-ink hover:bg-ink hover:text-bone"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-1 gap-1.5">
                {PATIENT_STORIES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Show story ${i + 1}`}
                    onClick={() => go(i)}
                    className="relative h-6 flex-1"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-ink/10">
                      {i < index && <span className="absolute inset-0 bg-ink" />}
                      {i === index && (
                        <motion.span
                          key={`${index}-${paused}`}
                          className="absolute inset-y-0 left-0 bg-ink"
                          initial={{ width: paused ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-sm tabular-nums text-stone">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Photo wall */}
        <div className="no-scrollbar -mx-5 mt-20 flex gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
          {PATIENT_STORIES.map((p, i) => (
            <button
              key={p.image}
              type="button"
              onClick={() => go(i)}
              aria-label={`View story: ${p.treatment}`}
              className={`group relative aspect-[3/4] w-[38vw] shrink-0 overflow-hidden rounded-2xl transition-all duration-500 sm:w-auto ${
                i === index ? "ring-2 ring-ink ring-offset-4 ring-offset-bone" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 640px) 18vw, 38vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
