"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CLINIC } from "@/lib/clinic";
import { openStatus } from "@/lib/schedule";
import { ArrowRight, Phone } from "../icons";
import { Magnetic, SplitReveal } from "../motion";
import { useApp } from "../Providers";

const D = 1.45; // wait for preloader

export default function Hero() {
  const { openBooking } = useApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    setStatus(openStatus());
    const id = setInterval(() => setStatus(openStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={ref} id="top" className="grain relative min-h-[100svh] overflow-hidden bg-ink text-bone">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-lime/[0.07] blur-[120px]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-20 lg:pt-32">
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D, duration: 0.8 }}
            className="mb-7 flex flex-wrap items-center gap-3"
          >
            <span className="eyebrow text-white/50">Maninagar, Ahmedabad</span>
            <span className="h-px w-8 bg-white/25" />
            <span className="eyebrow text-white/50">Est. 2012</span>
          </motion.div>

          <SplitReveal
            as="h1"
            immediate
            delay={D}
            text="Confident smiles, crafted with quiet precision."
            italicWords={["quiet", "precision"]}
            className="font-display text-[clamp(3rem,8.4vw,7.6rem)] leading-[0.95]"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
          >
            Smile design, dental implants and gentle family dentistry from an experienced in-house team of doctors,
            trusted by more than 20,000 patients across Ahmedabad.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Magnetic>
              <button
                type="button"
                onClick={() => openBooking()}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-lime py-4 pl-7 pr-2 text-[15px] font-medium text-ink transition-colors hover:bg-bone sm:w-auto"
              >
                Book your appointment
                <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </Magnetic>
            <a
              href={CLINIC.phoneHref}
              className="flex items-center justify-center gap-2.5 rounded-full border border-white/20 px-6 py-4 text-[15px] text-bone transition-colors hover:border-white/60"
            >
              <Phone className="h-4 w-4" /> {CLINIC.phoneDisplay}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: D + 0.9, duration: 1 }}
            className="mt-10 flex min-h-5 items-center gap-3 text-sm text-white/60"
          >
            {status && (
              <>
                <span
                  className={`pulse-dot h-2 w-2 rounded-full ${status.open ? "bg-lime text-lime" : "bg-white/40 text-white/40"}`}
                />
                {status.label}
              </>
            )}
          </motion.div>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0 round 28px)" }}
            animate={{ clipPath: "inset(0% 0 0 0 round 28px)" }}
            transition={{ delay: D - 0.1, duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[28px] lg:aspect-[4/5.2]"
          >
            <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
              <Image
                src="/img/patient-child-smile.webp"
                alt="Dr. Priyank Mehta with a smiling young patient at the clinic"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <p className="max-w-[220px] text-sm leading-snug text-white/85">
                Real patients. Real smiles. Photographed at our Maninagar clinic.
              </p>
              <span className="eyebrow rounded-full border border-white/25 px-3 py-1.5 text-white/80 backdrop-blur-md">
                Since 2012
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: D + 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -left-4 top-10 hidden w-[230px] rounded-2xl bg-paper p-4 text-ink shadow-2xl sm:block lg:-left-14"
          >
            <div className="flex -space-x-2.5">
              {["/img/dr-priyank.webp", "/img/dr-rujuta.webp", "/img/dr-samika.webp"].map((s) => (
                <span key={s} className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-paper">
                  <Image src={s} alt="" fill sizes="40px" className="object-cover object-top" />
                </span>
              ))}
            </div>
            <p className="font-display mt-3 text-3xl leading-none">20,000+</p>
            <p className="mt-1.5 text-xs leading-snug text-stone">patients treated by three in-house doctors</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 lg:flex"
      >
        <span className="eyebrow text-[10px]">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-lime"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
