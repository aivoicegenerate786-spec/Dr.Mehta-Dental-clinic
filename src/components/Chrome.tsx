"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CLINIC } from "@/lib/clinic";
import { ArrowUpRight, Chat, Phone } from "./icons";
import { useApp } from "./Providers";

const NAV = [
  { href: "#treatments", label: "Treatments" },
  { href: "#results", label: "Results" },
  { href: "#patients", label: "Patients" },
  { href: "#doctors", label: "Doctors" },
  { href: "#visit", label: "Visit" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
        <Image src="/img/logo-mark.webp" alt="" fill sizes="40px" className="scale-110 object-cover" />
      </span>
      <span className="leading-none">
        <span className={`font-display block text-[22px] ${light ? "text-bone" : "text-ink"}`}>Dr. Mehta&apos;s</span>
        <span className={`mt-1 block text-[9px] uppercase tracking-[0.32em] ${light ? "text-white/55" : "text-stone"}`}>
          Dental Care
        </span>
      </span>
    </span>
  );
}

export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    const dur = 1300;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink p-6 text-bone sm:p-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between text-[11px] uppercase tracking-[0.3em] text-white/45">
            <span>Maninagar, Ahmedabad</span>
            <span>Since 2012</span>
          </div>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[15vw] leading-[0.9] sm:text-[9vw]"
            >
              Dr. Mehta&apos;s <em className="text-lime">care</em>
            </motion.p>
          </div>
          <div className="flex items-end justify-between">
            <div className="h-px w-1/2 bg-white/15">
              <div className="h-px bg-lime" style={{ width: `${count}%` }} />
            </div>
            <span className="font-display text-5xl tabular-nums sm:text-7xl">{count}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const { openBooking } = useApp();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 40);
    setHidden(v > prev && v > 600 && !menu);
  });

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const light = !scrolled && !menu;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500 ${
          scrolled && !menu ? "bg-paper/80 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-xl" : ""
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <a href="#top" aria-label="Dr. Mehta's Dental Care, home" onClick={() => setMenu(false)}>
            <Logo light={light || menu} />
          </a>
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`link-underline text-sm transition-colors ${light ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink"}`}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href={CLINIC.phoneHref}
              className={`hidden items-center gap-2 text-sm xl:flex ${light ? "text-white/80" : "text-ink/70"}`}
            >
              <Phone className="h-4 w-4" /> {CLINIC.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => openBooking()}
              className={`group hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all duration-300 sm:flex ${
                light ? "bg-bone text-ink hover:bg-lime" : "bg-ink text-bone hover:bg-ink-3"
              }`}
            >
              Book a visit
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
            <button
              type="button"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className={`relative grid h-11 w-11 place-items-center rounded-full border lg:hidden ${
                light || menu ? "border-white/20 text-bone" : "border-ink/15 text-ink"
              }`}
            >
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ${menu ? "rotate-45" : "-translate-y-[3px]"}`}
              />
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ${menu ? "-rotate-45" : "translate-y-[3px]"}`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-8 pt-28 text-bone lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display flex items-baseline justify-between border-b border-white/10 py-4 text-5xl"
                >
                  {n.label}
                  <span className="font-sans text-xs text-white/35">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMenu(false);
                  openBooking();
                }}
                className="w-full rounded-full bg-lime py-4 text-ink"
              >
                Book a visit
              </button>
              <a href={CLINIC.phoneHref} className="block text-center text-sm text-white/60">
                or call {CLINIC.phoneDisplay}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileBar() {
  const { openBooking } = useApp();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 500));
  return (
    <motion.div
      initial={false}
      animate={{ y: show ? 0 : 120 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-full bg-ink/95 p-1.5 shadow-2xl backdrop-blur-lg md:hidden"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={CLINIC.phoneHref}
        aria-label="Call the clinic"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 text-bone"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent("Hello, I would like to book an appointment.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Message on WhatsApp"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 text-bone"
      >
        <Chat className="h-5 w-5" />
      </a>
      <button
        type="button"
        onClick={() => openBooking()}
        className="h-12 flex-1 rounded-full bg-lime text-[15px] font-medium text-ink"
      >
        Book appointment
      </button>
    </motion.div>
  );
}
