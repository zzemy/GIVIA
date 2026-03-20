import { type GiftItem, type GiftScore } from "@/lib/gifting";

export type SupportedCountry =
  | "Japan"
  | "France"
  | "United Kingdom"
  | "United States"
  | "Saudi Arabia";

export type RecognitionResult = {
  itemKey: string;
  itemZh: string;
  itemEn: string;
  category: string;
  confidence: number;
};

export type PackagingPlan = {
  style: string;
  colors: string;
  materials: string;
  avoid: string;
};

export type GreetingCardPlan = {
  tone: string;
  opener: string;
  body: string;
  closing: string;
};

export type CulturalAnalysis = {
  country: SupportedCountry;
  recognition: RecognitionResult;
  score: GiftScore;
  fitScore: number;
  riskLevel: GiftItem["risk_level"];
  isTaboo: boolean;
  warning: string;
  rescueItem: string;
  rescueReason: string;
  semanticSignals: string[];
  packaging: PackagingPlan;
  card: GreetingCardPlan;
};

const ITEM_PROFILES: Array<
  Omit<RecognitionResult, "confidence"> & { image: string }
> = [
  {
    itemKey: "clock",
    itemZh: "钟表",
    itemEn: "Clock",
    category: "Home",
    image: "/gifts/clock.svg",
  },
  {
    itemKey: "umbrella",
    itemZh: "雨伞",
    itemEn: "Umbrella",
    category: "Lifestyle",
    image: "/gifts/umbrella.svg",
  },
  {
    itemKey: "chocolate",
    itemZh: "巧克力礼盒",
    itemEn: "Chocolate Box",
    category: "Food",
    image: "/gifts/chocolate.svg",
  },
  {
    itemKey: "perfume",
    itemZh: "香水",
    itemEn: "Perfume",
    category: "Lifestyle",
    image: "/gifts/chocolate.svg",
  },
  {
    itemKey: "knife",
    itemZh: "刀具",
    itemEn: "Knife Set",
    category: "Home",
    image: "/gifts/clock.svg",
  },
  {
    itemKey: "wallet",
    itemZh: "钱包",
    itemEn: "Wallet",
    category: "Lifestyle",
    image: "/gifts/umbrella.svg",
  },
];

const UNKNOWN_PROFILE = {
  itemKey: "unknown",
  itemZh: "未识别礼物",
  itemEn: "Unknown Gift",
  category: "General",
  image: "/gifts/chocolate.svg",
};

export function buildUnknownRecognition(customLabel?: string): RecognitionResult {
  return {
    ...UNKNOWN_PROFILE,
    itemZh: customLabel?.trim() || UNKNOWN_PROFILE.itemZh,
    confidence: 0.35,
  };
}

export const COUNTRY_OPTIONS: Array<{ value: SupportedCountry; label: string }> = [
  { value: "Japan", label: "日本 Japan" },
  { value: "France", label: "法国 France" },
  { value: "United Kingdom", label: "英国 United Kingdom" },
  { value: "United States", label: "美国 United States" },
  { value: "Saudi Arabia", label: "沙特 Saudi Arabia" },
];

export function analysisToGiftItem(analysis: CulturalAnalysis): GiftItem {
  const image =
    ITEM_PROFILES.find((profile) => profile.itemKey === analysis.recognition.itemKey)
      ?.image ?? UNKNOWN_PROFILE.image;

  return {
    id: `${analysis.country.toLowerCase().replace(/\s+/g, "-")}-${analysis.recognition.itemKey}`,
    country: analysis.country,
    category: analysis.recognition.category,
    item_cn: analysis.recognition.itemZh,
    item_en: analysis.recognition.itemEn,
    image,
    score: analysis.score,
    is_taboo: analysis.isTaboo,
    risk_level: analysis.riskLevel,
    xray_tags: analysis.semanticSignals,
    warning_en: analysis.warning,
    rescue_item: analysis.rescueItem,
    rescue_reason: analysis.rescueReason,
  };
}
