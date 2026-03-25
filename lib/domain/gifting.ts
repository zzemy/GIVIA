export type AppState = "IDLE" | "SCANNING" | "RESULT";

export type GiftScore = {
  phonetic: number;
  symbol: number;
  color: number;
};

export type GiftItem = {
  id: string;
  country: string;
  category: string;
  item_cn: string;
  item_en: string;
  image: string;
  score: GiftScore;
  is_taboo: boolean;
  risk_level: "Low" | "Medium" | "High";
  xray_tags: string[];
  warning_en: string;
  rescue_item: string;
  rescue_reason: string;
};

export const calculateCulturalFitScore = (score: GiftScore): number => {
  return Math.round((score.phonetic + score.symbol + score.color) / 3);
};
