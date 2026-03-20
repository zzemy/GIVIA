"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, { Background, BackgroundVariant } from "reactflow";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import "reactflow/dist/style.css";

type TagChip = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  delay: number;
};

type CanvasProps = {
  className?: string;
};

const CHIP_SIZE = 92;
const DROP_RADIUS = 132;

const DEFAULT_TAGS: TagChip[] = [
  { id: "jp", label: "Japan", x: 72, y: 100 },
  { id: "eld", label: "Elders", x: 228, y: 118 },
  { id: "art", label: "Art", x: 384, y: 140 },
  { id: "biz", label: "Business", x: 115, y: 250 },
  { id: "fam", label: "Family", x: 300, y: 286 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function buildParticles(): Particle[] {
  return Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * Math.PI * 2;
    const distance = 65 + (index % 6) * 24;

    return {
      id: index,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      delay: (index % 7) * 0.03,
    };
  });
}

export function Canvas({ className }: CanvasProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [chips, setChips] = useState<TagChip[]>(DEFAULT_TAGS);
  const [explosionTick, setExplosionTick] = useState(0);
  const [showGiftCard, setShowGiftCard] = useState(false);

  const particles = useMemo(() => buildParticles(), []);

  useEffect(() => {
    if (!stageRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      setStageSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(stageRef.current);

    return () => observer.disconnect();
  }, []);

  const dropCenter = useMemo(
    () => ({ x: stageSize.width / 2, y: stageSize.height / 2 }),
    [stageSize.height, stageSize.width]
  );

  const calculateInsideCount = (nextChips: TagChip[]) => {
    if (!stageSize.width || !stageSize.height) {
      return 0;
    }

    return nextChips.filter((chip) => {
      const centerX = chip.x + CHIP_SIZE / 2;
      const centerY = chip.y + CHIP_SIZE / 2;
      const distance = Math.hypot(centerX - dropCenter.x, centerY - dropCenter.y);
      return distance <= DROP_RADIUS;
    }).length;
  };

  const insideCount = calculateInsideCount(chips);

  const handleDragEnd = (
    chipId: string,
    point: { x: number; y: number }
  ) => {
    if (!stageRef.current) {
      return;
    }

    const rect = stageRef.current.getBoundingClientRect();
    const maxX = Math.max(0, rect.width - CHIP_SIZE);
    const maxY = Math.max(0, rect.height - CHIP_SIZE);

    const nextX = clamp(point.x - rect.left - CHIP_SIZE / 2, 0, maxX);
    const nextY = clamp(point.y - rect.top - CHIP_SIZE / 2, 0, maxY);

    setChips((prev) => {
      const next = prev.map((chip) =>
        chip.id === chipId ? { ...chip, x: nextX, y: nextY } : chip
      );

      const nextInsideCount = calculateInsideCount(next);
      if (nextInsideCount > 2 && !showGiftCard) {
        setExplosionTick((value) => value + 1);
        window.setTimeout(() => setShowGiftCard(true), 220);
      }

      return next;
    });
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative h-screen w-full overflow-hidden bg-[#050b19]",
        className
      )}
    >
      <ReactFlow
        nodes={[]}
        edges={[]}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
        className="absolute inset-0"
      >
        <Background
          color="rgba(125,211,252,0.2)"
          gap={30}
          size={1.2}
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_80px_rgba(34,211,238,0.3)]">
        <div className="absolute inset-7 rounded-full border border-dashed border-cyan-200/55" />
        <div className="absolute inset-0 grid place-items-center text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/85">
            Drop Zone
          </p>
          <p className="mt-2 text-sm text-slate-200">
            {insideCount}/3 Tags Synced
          </p>
        </div>
      </div>

      {chips.map((chip) => (
        <motion.button
          key={chip.id}
          type="button"
          drag
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={stageRef}
          onDragEnd={(_, info) => handleDragEnd(chip.id, info.point)}
          className="absolute grid h-[92px] w-[92px] place-items-center rounded-full border border-cyan-100/35 bg-slate-800/75 text-sm font-semibold text-cyan-50 shadow-[0_0_24px_rgba(56,189,248,0.25)]"
          style={{ left: chip.x, top: chip.y }}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, boxShadow: "0 0 40px rgba(6,182,212,0.45)" }}
        >
          {chip.label}
        </motion.button>
      ))}

      <AnimatePresence>
        {explosionTick > 0 ? (
          <motion.div
            key={explosionTick}
            className="pointer-events-none absolute left-1/2 top-1/2"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
          >
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute h-2.5 w-2.5 rounded-full bg-cyan-200"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.9 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{
                  duration: 0.7,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showGiftCard ? (
          <motion.article
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute left-1/2 top-[72%] w-[min(640px,88vw)] -translate-x-1/2 rounded-3xl border border-emerald-300/35 bg-emerald-900/35 p-6 text-emerald-50 backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">
              Culturally Safe Gift Card
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Arita-yaki Ceramic Vase</h3>
            <p className="mt-2 text-sm leading-7 text-emerald-50/90">
              Tags indicate high elder-context sensitivity in Japan. This choice
              communicates longevity and artisan respect while avoiding taboo
              semantics.
            </p>
          </motion.article>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
