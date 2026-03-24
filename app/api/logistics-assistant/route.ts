import { NextResponse } from "next/server";

export const runtime = "nodejs";

type SupportedCurrency = "USD" | "CNY" | "EUR" | "JPY" | "GBP";

type LogisticsRequest = {
  amount?: number;
  fromCurrency?: SupportedCurrency;
  targetCurrencies?: SupportedCurrency[];
  destinationCountry?: string;
  weightKg?: number;
  declaredValue?: number;
};

type ShippingQuote = {
  provider: "DHL" | "SF Express";
  service: string;
  currency: SupportedCurrency;
  estimatedCost: number;
  etaDays: string;
  notes: string[];
  source: "api" | "fallback";
};

const DEFAULT_TARGET_CURRENCIES: SupportedCurrency[] = ["USD", "CNY", "EUR", "JPY"];

const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  CNY: 7.18,
  EUR: 0.92,
  JPY: 151.4,
  GBP: 0.78,
};

function clampNumber(value: unknown, fallback: number, min: number, max: number): number {
  const numeric = typeof value === "number" ? value : Number.NaN;

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, numeric));
}

function normalizeCurrency(value: unknown, fallback: SupportedCurrency): SupportedCurrency {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toUpperCase();

  if (
    normalized === "USD" ||
    normalized === "CNY" ||
    normalized === "EUR" ||
    normalized === "JPY" ||
    normalized === "GBP"
  ) {
    return normalized;
  }

  return fallback;
}

function buildFallbackRates(base: SupportedCurrency, targets: SupportedCurrency[]): Record<string, number> {
  const baseRate = FALLBACK_RATES[base] ?? 1;
  const rates: Record<string, number> = {};

  for (const target of targets) {
    const targetRate = FALLBACK_RATES[target] ?? 1;
    rates[target] = targetRate / baseRate;
  }

  return rates;
}

async function fetchRates(base: SupportedCurrency, targets: SupportedCurrency[]): Promise<{ rates: Record<string, number>; source: "live" | "fallback" }> {
  const dedupedTargets = Array.from(new Set(targets)).filter((target) => target !== base);

  if (dedupedTargets.length === 0) {
    return { rates: {}, source: "live" };
  }

  try {
    const endpoint = new URL("https://api.frankfurter.app/latest");
    endpoint.searchParams.set("from", base);
    endpoint.searchParams.set("to", dedupedTargets.join(","));

    const response = await fetch(endpoint, { method: "GET" });

    if (!response.ok) {
      throw new Error(`rate provider status ${response.status}`);
    }

    const payload = (await response.json()) as { rates?: Record<string, number> };

    if (!payload.rates || typeof payload.rates !== "object") {
      throw new Error("invalid rate payload");
    }

    const safeRates: Record<string, number> = {};

    for (const target of dedupedTargets) {
      const rawRate = payload.rates[target];
      if (typeof rawRate === "number" && Number.isFinite(rawRate) && rawRate > 0) {
        safeRates[target] = rawRate;
      }
    }

    if (Object.keys(safeRates).length === 0) {
      throw new Error("empty rate payload");
    }

    return { rates: safeRates, source: "live" };
  } catch {
    return { rates: buildFallbackRates(base, dedupedTargets), source: "fallback" };
  }
}

function buildCustomsNotes(country: string, declaredValue: number): string[] {
  const notes: string[] = [];

  if (declaredValue >= 135) {
    notes.push("高申报金额可能触发进口税，请准备商业发票和收件人税号信息。");
  } else {
    notes.push("低申报金额通常通关更快，但请确保申报信息与实物一致。");
  }

  if (/japan|日本/i.test(country)) {
    notes.push("寄往日本建议附英文品名与材质说明，避免使用笼统礼品描述。");
  }

  if (/france|united kingdom|europe|法国|英国|欧/i.test(country)) {
    notes.push("欧盟/英国线路建议提前确认 VAT 或 EORI 信息。 ");
  }

  if (/saudi|arabia|沙特/i.test(country)) {
    notes.push("沙特线路建议避开酒精、猪皮制品及宗教敏感图案包装。");
  }

  return notes;
}

function fallbackDhlQuote(weightKg: number, declaredValue: number, destinationCountry: string): ShippingQuote {
  const base = 28;
  const variable = weightKg * 12.5 + declaredValue * 0.02;
  const cost = Number((base + variable).toFixed(2));

  return {
    provider: "DHL",
    service: "DHL Express Worldwide",
    currency: "USD",
    estimatedCost: cost,
    etaDays: "3-6",
    notes: [
      `重量 ${weightKg.toFixed(1)}kg 估算，目的地 ${destinationCountry || "Global"}`,
      "偏稳时效，旺季需预留 1-2 天处理时间。",
    ],
    source: "fallback",
  };
}

function fallbackSfQuote(weightKg: number, declaredValue: number, destinationCountry: string): ShippingQuote {
  const base = 22;
  const variable = weightKg * 10 + declaredValue * 0.018;
  const cost = Number((base + variable).toFixed(2));

  return {
    provider: "SF Express",
    service: "SF International Standard",
    currency: "USD",
    estimatedCost: cost,
    etaDays: "4-8",
    notes: [
      `重量 ${weightKg.toFixed(1)}kg 估算，目的地 ${destinationCountry || "Global"}`,
      "部分国家需要补充收件人身份证明或税务信息。",
    ],
    source: "fallback",
  };
}

async function fetchProviderQuote(
  provider: "DHL" | "SF Express",
  requestBody: Record<string, unknown>
): Promise<ShippingQuote | null> {
  const envPrefix = provider === "DHL" ? "DHL" : "SF";
  const endpoint = process.env[`${envPrefix}_QUOTE_ENDPOINT`];
  const token = process.env[`${envPrefix}_QUOTE_TOKEN`];

  if (!endpoint) {
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      service?: string;
      currency?: SupportedCurrency;
      estimatedCost?: number;
      etaDays?: string;
      notes?: string[];
    };

    if (!payload.service || typeof payload.estimatedCost !== "number") {
      return null;
    }

    return {
      provider,
      service: payload.service,
      currency: normalizeCurrency(payload.currency, "USD"),
      estimatedCost: Number(payload.estimatedCost.toFixed(2)),
      etaDays: payload.etaDays || "4-7",
      notes: Array.isArray(payload.notes) ? payload.notes.slice(0, 4) : [],
      source: "api",
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LogisticsRequest;

    const amount = clampNumber(body.amount, 100, 0.01, 1_000_000);
    const fromCurrency = normalizeCurrency(body.fromCurrency, "USD");
    const targetCurrencies = (Array.isArray(body.targetCurrencies) ? body.targetCurrencies : DEFAULT_TARGET_CURRENCIES)
      .map((item) => normalizeCurrency(item, "USD"));
    const weightKg = clampNumber(body.weightKg, 1, 0.1, 50);
    const declaredValue = clampNumber(body.declaredValue, amount, 1, 1_000_000);
    const destinationCountry = typeof body.destinationCountry === "string" ? body.destinationCountry.trim() : "";

    const rateResult = await fetchRates(fromCurrency, targetCurrencies);

    const convertedAmounts = Object.fromEntries(
      Object.entries(rateResult.rates).map(([currency, rate]) => [
        currency,
        Number((amount * rate).toFixed(2)),
      ])
    );

    const quotePayload = {
      destinationCountry,
      weightKg,
      declaredValue,
      currency: fromCurrency,
    };

    const [dhlApiQuote, sfApiQuote] = await Promise.all([
      fetchProviderQuote("DHL", quotePayload),
      fetchProviderQuote("SF Express", quotePayload),
    ]);

    const shippingQuotes: ShippingQuote[] = [
      dhlApiQuote ?? fallbackDhlQuote(weightKg, declaredValue, destinationCountry),
      sfApiQuote ?? fallbackSfQuote(weightKg, declaredValue, destinationCountry),
    ];

    return NextResponse.json({
      baseAmount: amount,
      baseCurrency: fromCurrency,
      rateSource: rateResult.source,
      convertedAmounts,
      shippingQuotes,
      customsNotes: buildCustomsNotes(destinationCountry, declaredValue),
      disclaimer:
        "物流报价为估算值，最终费用与时效以承运商下单返回为准。",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "failed to build logistics assistant result",
      },
      { status: 500 }
    );
  }
}
