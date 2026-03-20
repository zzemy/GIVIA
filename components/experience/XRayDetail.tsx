"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type XRayDetailProps = {
  className?: string;
};

const LENS_SIZE = 190;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function XRayDetail({ className }: XRayDetailProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [lens, setLens] = useState({ x: 80, y: 120 });

  useEffect(() => {
    if (!boardRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextWidth = entry.contentRect.width;
      const nextHeight = entry.contentRect.height;

      setBoardSize({ width: nextWidth, height: nextHeight });
      setLens((prev) => ({
        x: clamp(prev.x, 0, Math.max(0, nextWidth - LENS_SIZE)),
        y: clamp(prev.y, 0, Math.max(0, nextHeight - LENS_SIZE)),
      }));
    });

    observer.observe(boardRef.current);

    return () => observer.disconnect();
  }, []);

  const lensCenter = useMemo(
    () => ({
      x: lens.x + LENS_SIZE / 2,
      y: lens.y + LENS_SIZE / 2,
    }),
    [lens.x, lens.y]
  );

  const tabooArea = useMemo(
    () => ({
      x: boardSize.width * 0.63,
      y: boardSize.height * 0.18,
      w: boardSize.width * 0.23,
      h: boardSize.height * 0.26,
    }),
    [boardSize.height, boardSize.width]
  );

  const isOverTaboo =
    lensCenter.x >= tabooArea.x &&
    lensCenter.x <= tabooArea.x + tabooArea.w &&
    lensCenter.y >= tabooArea.y &&
    lensCenter.y <= tabooArea.y + tabooArea.h;

  const clipPathValue = `circle(${LENS_SIZE / 2}px at ${lensCenter.x}px ${lensCenter.y}px)`;

  const handleDrag = (point: { x: number; y: number }) => {
    if (!boardRef.current) {
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const nextX = clamp(
      point.x - rect.left - LENS_SIZE / 2,
      0,
      Math.max(0, rect.width - LENS_SIZE)
    );
    const nextY = clamp(
      point.y - rect.top - LENS_SIZE / 2,
      0,
      Math.max(0, rect.height - LENS_SIZE)
    );

    setLens({ x: nextX, y: nextY });
  };

  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 py-10", className)}>
      <h2 className="text-3xl font-semibold text-slate-100">Culture X-Ray Detail</h2>
      <p className="mt-2 text-sm leading-7 text-slate-300">
        Drag the glass lens to compare the default Chinese presentation and the
        localized English/Saudi style interpretation.
      </p>

      <div
        ref={boardRef}
        className="relative mt-6 h-[620px] overflow-hidden rounded-[2rem] border border-slate-300/20 bg-slate-950"
      >
        <div className="absolute inset-0 p-8 text-slate-100">
          <div className="rounded-3xl border border-slate-200/15 bg-slate-900/70 p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">
              原始礼品版本
            </p>
            <h3 className="mt-2 text-3xl font-semibold">钟表礼盒</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200/90">
              面向日本长辈场景，该礼物存在较强语义风险，容易触发“送终”联想。
              颜色层面无明显问题，但语音和象征层风险偏高。
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-500/15 p-4">
                <p className="text-xs text-cyan-100/80">风险区域</p>
                <p className="mt-2 text-sm">语音联想: 高风险</p>
              </div>
              <div className="rounded-2xl border border-slate-300/25 bg-slate-700/25 p-4">
                <p className="text-xs text-slate-200/80">色彩寓意</p>
                <p className="mt-2 text-sm">安全</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 p-8"
          style={{ clipPath: clipPathValue, WebkitClipPath: clipPathValue }}
        >
          <div className="h-full rounded-3xl border border-amber-200/35 bg-gradient-to-b from-[#1f1207] to-[#0e0b09] p-7 text-amber-50">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200/85">
              Localized Saudi / English Style
            </p>
            <h3 className="mt-2 text-3xl font-semibold">Premium Date & Fragrance Gift Set</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-amber-50/90">
              Reframed from a taboo-prone clock concept to a hospitality-centered
              gift language. Balances elegance, blessing symbolism, and family honor.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-amber-300/35 bg-amber-400/10 p-4">
                <p className="text-xs text-amber-100/80">Greeting Tone</p>
                <p className="mt-2 text-sm">Respectful, warm, intergenerational</p>
              </div>
              <div className="rounded-2xl border border-emerald-300/35 bg-emerald-500/10 p-4">
                <p className="text-xs text-emerald-100/80">Cultural Fit</p>
                <p className="mt-2 text-sm">High confidence</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute rounded-2xl border border-red-300/45 bg-red-500/8"
          style={{
            left: tabooArea.x,
            top: tabooArea.y,
            width: tabooArea.w,
            height: tabooArea.h,
          }}
        />

        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={boardRef}
          onDrag={(_, info) => handleDrag(info.point)}
          className={cn(
            "absolute left-0 top-0 z-10 h-[190px] w-[190px] rounded-full border bg-white/10 backdrop-blur-md",
            "flex items-end justify-center pb-6 text-xs uppercase tracking-[0.18em] text-white/90",
            isOverTaboo
              ? "border-red-300/90 shadow-[0_0_28px_rgba(248,113,113,0.65)]"
              : "border-cyan-100/60 shadow-[0_0_28px_rgba(34,211,238,0.35)]"
          )}
          style={{ x: lens.x, y: lens.y }}
          whileHover={{ scale: 1.02 }}
        >
          Glass Lens
        </motion.div>
      </div>
    </section>
  );
}
