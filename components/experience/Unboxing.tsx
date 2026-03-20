"use client";

import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type UnboxingProps = {
  className?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const revealContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.2,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

export function Unboxing({ className }: UnboxingProps) {
  const ripX = useMotionValue(0);
  const [ripProgress, setRipProgress] = useState(0);
  const [opened, setOpened] = useState(false);

  const shimmerGradient = useMemo(
    () =>
      "linear-gradient(115deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.45)_48%,rgba(255,255,255,0)_100%)",
    []
  );

  const handleDrag = () => {
    const distance = Math.max(0, ripX.get());
    setRipProgress(clamp(distance / 185, 0, 1));
  };

  const handleDragEnd = () => {
    if (ripProgress >= 0.88) {
      setRipProgress(1);
      animate(ripX, 230, { duration: 0.2, ease: "easeOut" });
      setOpened(true);
      return;
    }

    setRipProgress(0);
    animate(ripX, 0, { type: "spring", stiffness: 240, damping: 22 });
  };

  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 py-10", className)}>
      <h2 className="text-3xl font-semibold text-slate-100">Digital Unboxing</h2>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        Drag the wrapping strip to the right until it rips open. The greeting card
        and gift reveal with staged motion and shimmer.
      </p>

      <div className="relative mt-6 overflow-hidden rounded-[2rem] border border-slate-300/20 bg-slate-950 p-8">
        <div className="relative mx-auto h-[420px] w-full max-w-[720px]">
          <div className="absolute left-1/2 top-[44%] h-56 w-72 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-amber-200/35 bg-gradient-to-b from-[#6c3f13] to-[#2f1a0d] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-x-0 top-[47%] h-[2px] bg-amber-100/55" />
            <div className="absolute left-1/2 top-5 h-16 w-16 -translate-x-1/2 rounded-full border border-amber-100/45 bg-amber-50/10" />
            <p className="absolute inset-x-0 bottom-6 text-center text-xs uppercase tracking-[0.22em] text-amber-100/90">
              Premium Gift Box
            </p>
          </div>

          <AnimatePresence>
            {!opened ? (
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 230 }}
                dragMomentum={false}
                style={{ x: ripX }}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.45, transition: { duration: 0.2 } }}
                className="absolute left-1/2 top-[44%] h-56 w-72 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-rose-100/35 bg-gradient-to-br from-rose-300/35 via-rose-200/20 to-transparent"
                animate={{
                  opacity: 1 - ripProgress,
                  scale: 1 - ripProgress * 0.38,
                  rotate: ripProgress * 11,
                }}
              >
                <div className="absolute inset-x-4 top-4 rounded-xl border border-white/35 bg-white/15 p-2 text-center text-[11px] uppercase tracking-[0.18em] text-rose-50">
                  Drag To Rip
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {opened ? (
              <motion.div
                variants={revealContainer}
                initial="hidden"
                animate="show"
                className="absolute inset-0"
              >
                <motion.article
                  variants={revealItem}
                  className="absolute left-[10%] top-[8%] w-72 rounded-2xl border border-cyan-200/35 bg-cyan-900/35 p-4 text-cyan-50 backdrop-blur-md"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/85">
                    AI Greeting Card
                  </p>
                  <p className="mt-3 text-sm leading-7">
                    May your home be filled with calm, craft, and timeless harmony.
                  </p>
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: shimmerGradient }}
                    animate={{ x: ["-130%", "140%"] }}
                    transition={{ duration: 1.15, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.4 }}
                  />
                </motion.article>

                <motion.div
                  variants={revealItem}
                  className="absolute right-[8%] top-[16%] h-56 w-56 rounded-3xl border border-emerald-200/35 bg-emerald-900/30 p-4"
                >
                  <div className="h-full w-full rounded-2xl border border-emerald-100/40 bg-gradient-to-b from-emerald-200/20 to-transparent" />
                  <p className="mt-3 text-center text-sm text-emerald-50">Arita-yaki Ceramic Vase</p>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
