"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CASES } from "@/lib/clinic";
import { ArrowRight } from "../icons";
import { FadeUp, SplitReveal } from "../motion";
import { useApp } from "../Providers";

function CaseCard({ c, i }: { c: (typeof CASES)[number]; i: number }) {
  return (
    <article className="group w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:w-[min(38vw,560px)]">
      <div className="relative aspect-square overflow-hidden rounded-[24px] bg-ink-3">
        <Image
          src={c.image}
          alt={`${c.title}, before and after`}
          fill
          sizes="(min-width: 1024px) 38vw, 82vw"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span className="eyebrow absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] text-bone backdrop-blur-md">
          {c.tag}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink">
          Before / After
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-3xl leading-tight text-bone">{c.title}</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">{c.detail}</p>
        </div>
        <span className="font-display text-2xl text-white/25">{String(i + 1).padStart(2, "0")}</span>
      </div>
    </article>
  );
}

function Intro() {
  return (
    <div className="max-w-md shrink-0">
      <FadeUp>
        <p className="eyebrow text-lime">Results</p>
      </FadeUp>
      <SplitReveal
        text="Transformations from our own chair."
        italicWords={["our", "own", "chair."]}
        className="font-display mt-5 text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.98] text-bone"
      />
      <FadeUp delay={0.2}>
        <p className="mt-6 text-[15px] leading-relaxed text-white/55">
          Every case here was planned and treated at Dr. Mehta&apos;s Dental Care. No stock photography, no
          retouching of results.
        </p>
      </FadeUp>
    </div>
  );
}

export default function Results() {
  const { openBooking } = useApp();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const cta = (
    <div className="flex w-[300px] shrink-0 flex-col justify-center">
      <p className="font-display text-4xl leading-tight text-bone">Your smile could be next.</p>
      <button
        type="button"
        onClick={() => openBooking("Smile Design")}
        className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-bone"
      >
        Plan my smile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );

  return (
    <section id="results" className="grain relative bg-ink">
      {/* Desktop: pinned horizontal scroll */}
      <div ref={wrap} className="relative hidden lg:block" style={{ height: `calc(100vh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex items-center gap-14 pl-[max(2rem,calc((100vw-1400px)/2+2rem))] pr-24">
            <Intro />
            {CASES.map((c, i) => (
              <CaseCard key={c.title} c={c} i={i} />
            ))}
            {cta}
          </motion.div>
          <div className="absolute inset-x-8 bottom-10 mx-auto h-px max-w-[1336px] bg-white/10">
            <motion.div style={{ width: bar }} className="h-px bg-lime" />
          </div>
        </div>
      </div>

      {/* Mobile and tablet: swipe carousel */}
      <div className="py-24 lg:hidden">
        <div className="px-5 sm:px-8">
          <Intro />
        </div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {CASES.map((c, i) => (
            <CaseCard key={c.title} c={c} i={i} />
          ))}
        </div>
        <div className="mt-10 px-5 sm:px-8">{cta}</div>
      </div>
    </section>
  );
}
