import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { GiftItem } from "@/lib/domain/gifting";

type CultureRadarProps = {
  gift: GiftItem;
  isScanning: boolean;
  overlay?: ReactNode;
};

export function CultureRadar({ gift, isScanning, overlay }: CultureRadarProps) {
  return (
    <div className="relative mx-auto h-80 w-80 sm:h-96 sm:w-96">
      <div className="absolute inset-0 rounded-full border border-cyan-300/35 bg-cyan-400/5" />
      <div className="absolute inset-8 rounded-full border border-cyan-200/20" />
      <div className="absolute inset-16 rounded-full border border-cyan-200/20" />

      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-200/30"
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 shadow-[0_0_24px_6px_rgba(34,211,238,0.65)]"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="absolute left-1/2 top-1/2 h-46 w-46 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/30 shadow-[0_20px_50px_rgba(8,18,33,0.45)] sm:h-52 sm:w-52">
        <Image
          src={gift.image}
          alt={`${gift.item_en} gift image`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 640px) 184px, 208px"
        />
        {overlay}
      </div>

      {isScanning ? (
        <motion.div
          className="pointer-events-none absolute left-0 right-0 top-0 h-16 rounded-full bg-gradient-to-b from-cyan-100/80 via-cyan-200/25 to-transparent blur-sm"
          animate={{ y: ["0%", "83%", "0%"] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16)_0%,transparent_58%)]" />
    </div>
  );
}
