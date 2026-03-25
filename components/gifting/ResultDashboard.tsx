"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, BadgeCheck } from "lucide-react";
import { calculateCulturalFitScore, type GiftItem } from "@/lib/gifting";
import {
  UI_COPY,
  getLocalizedGift,
  localizeRiskLevel,
  type Locale,
} from "@/lib/i18n";

type ResultDashboardProps = {
  gift: GiftItem;
  locale: Locale;
};

export function ResultDashboard({ gift, locale }: ResultDashboardProps) {
  const isTaboo = gift.is_taboo;
  const fitScore = calculateCulturalFitScore(gift.score);
  const copy = UI_COPY[locale];
  const localizedGift = getLocalizedGift(gift, locale);

  const radarData = [
    { subject: copy.dashboard.phonetics, value: gift.score.phonetic },
    { subject: copy.dashboard.symbolism, value: gift.score.symbol },
    { subject: copy.dashboard.color, value: gift.score.color },
  ];

  const dimensionCards = [
    { label: copy.dashboard.phonetics, value: gift.score.phonetic },
    { label: copy.dashboard.symbolism, value: gift.score.symbol },
    { label: copy.dashboard.color, value: gift.score.color },
  ];

  return (
    <section
      className="w-full rounded-3xl border border-slate-200/15 bg-slate-900/40 p-5 sm:p-6 text-slate-50"
      aria-label={copy.dashboard.title}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{copy.dashboard.title}</p>
          <h2 className="mt-1 text-2xl font-semibold">
            {localizedGift.displayName} {copy.dashboard.analysisSuffix}
          </h2>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium ${
          isTaboo
            ? "border-red-400/50 bg-red-500/20 text-red-100"
            : "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
        }`}>
          {isTaboo ? <AlertTriangle size={16} /> : <BadgeCheck size={16} />}
          {isTaboo ? copy.dashboard.tabooDetected : copy.dashboard.culturallySafe}
        </div>
      </div>

      {/* Main score highlight */}
      <div className={`mb-6 rounded-2xl border-2 p-6 ${
        isTaboo
          ? "border-red-400/40 bg-red-500/15"
          : "border-emerald-400/40 bg-emerald-500/15"
      }`}>
        <p className="text-sm uppercase tracking-[0.18em] text-slate-300">{copy.dashboard.culturalFitScore}</p>
        <p className="mt-2 text-5xl font-bold">{fitScore}</p>
        <p className="mt-1 text-xs text-slate-400">/ 100</p>
      </div>

      {/* Analytics grid */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="h-64 rounded-2xl border border-slate-200/15 bg-slate-800/30 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }} />
              <Radar
                dataKey="value"
                stroke={isTaboo ? "#f87171" : "#34d399"}
                fill={isTaboo ? "rgba(248,113,113,0.25)" : "rgba(52,211,153,0.25)"}
                fillOpacity={1}
              />
              <Tooltip formatter={(value) => `${value ?? 0}/100`} contentStyle={{ background: "transparent", border: "none" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension breakdown */}
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {dimensionCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-200/15 bg-slate-800/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">{card.value}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700/50">
                <div 
                  className={`h-full ${isTaboo ? "bg-red-400" : "bg-emerald-400"}`}
                  style={{ width: `${card.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk insights */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {/* Risk level card */}
        <div className={`rounded-xl border-2 p-4 ${
          isTaboo
            ? "border-red-400/40 bg-red-500/15"
            : "border-amber-400/40 bg-amber-500/15"
        }`}>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
            {copy.dashboard.riskLevel}
          </p>
          <p className="mt-2 font-semibold text-slate-100">
            {localizeRiskLevel(gift.risk_level, locale)}
          </p>
          <p className="mt-2 text-sm text-slate-300">{localizedGift.warning}</p>
        </div>

        {/* Rescue recommendation card */}
        <div className="rounded-xl border-2 border-cyan-400/40 bg-cyan-500/15 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
            {copy.dashboard.rescueSuggestion}
          </p>
          <p className="mt-2 font-semibold text-slate-100">{localizedGift.rescueItem}</p>
          <p className="mt-2 text-sm text-slate-300">{localizedGift.rescueReason}</p>
        </div>
      </div>
    </section>
  );
}
