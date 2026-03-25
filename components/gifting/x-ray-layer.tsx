import { motion } from "framer-motion";
import { useId } from "react";
import { UI_COPY, type Locale } from "@/lib/i18n";

type XRayLayerProps = {
  tags: string[];
  locale: Locale;
};

const LABEL_SLOTS = [
  "left-3 top-8",
  "right-4 top-16",
  "left-6 bottom-16",
  "right-2 bottom-8",
];

function mapTagToHint(tag: string, locale: Locale): string {
  const hintCopy = UI_COPY[locale].xrayHint;
  const lowerTag = tag.toLowerCase();

  if (lowerTag.includes("sound") || lowerTag.includes("phon")) {
    return hintCopy.phonetic;
  }

  if (lowerTag.includes("color")) {
    return hintCopy.color;
  }

  return hintCopy.symbolic;
}

export function XRayLayer({ tags, locale }: XRayLayerProps) {
  const maskId = useId().replace(/:/g, "");
  const gradientId = `xrayGradient${maskId}`;
  const clipMaskId = `xrayMask${maskId}`;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(6,182,212,0.85)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0.8)" />
          </linearGradient>
          <mask id={clipMaskId}>
            <rect x="0" y="0" width="100" height="100" fill="black" />
            <motion.rect
              x="0"
              y="-34"
              width="100"
              height="34"
              fill="white"
              animate={{ y: [-34, 100, -34] }}
              transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </mask>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill={`url(#${gradientId})`} mask={`url(#${clipMaskId})`} opacity="0.85" />
      </svg>

      {tags.map((tag, index) => (
        <motion.div
          key={tag}
          className={`absolute rounded-xl border border-white/30 bg-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/95 backdrop-blur-md ${LABEL_SLOTS[index % LABEL_SLOTS.length]}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -4, 0] }}
          transition={{ duration: 2.8, delay: index * 0.22, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          {mapTagToHint(tag, locale)}
        </motion.div>
      ))}
    </div>
  );
}
