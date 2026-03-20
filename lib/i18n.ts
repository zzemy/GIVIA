import type { GiftItem } from "@/lib/gifting";

export type Locale = "en" | "zh" | "ja" | "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  fr: "Français",
};

const SUPPORTED_LOCALES: Locale[] = ["en", "zh", "ja", "fr"];

function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export const LOCALE_STORAGE_KEY = "taboo-free-gifting-locale";

type UiCopy = {
  brand: string;
  title: string;
  description: string;
  language: string;
  highlights: {
    xrayTitle: string;
    xrayDesc: string;
    fitTitle: string;
    fitDesc: string;
    packagingTitle: string;
    packagingDesc: string;
  };
  sampleLabel: string;
  countryLabel: string;
  categoryLabel: string;
  fitScoreLabel: string;
  buttons: {
    startScan: string;
    scanning: string;
    nextSample: string;
    reset: string;
  };
  systemStatus: string;
  statusScanning: string;
  statusIdle: string;
  statusHint: string;
  stateIdle: string;
  stateScanning: string;
  stateResult: string;
  dashboard: {
    title: string;
    tabooDetected: string;
    culturallySafe: string;
    analysisSuffix: string;
    culturalFitScore: string;
    phonetics: string;
    symbolism: string;
    color: string;
    riskLevel: string;
    rescueSuggestion: string;
  };
  xrayHint: {
    phonetic: string;
    color: string;
    symbolic: string;
  };
};

export const UI_COPY: Record<Locale, UiCopy> = {
  en: {
    brand: "TABOO-FREE GIFTING",
    title: "Culture X-Ray Intelligence Engine",
    description:
      "Cross-cultural semantic reconstruction system for gift decisions. Detect taboo signals, inspect semantic layers, and recover with culturally aligned alternatives.",
    language: "Language",
    highlights: {
      xrayTitle: "Culture X-Ray",
      xrayDesc: "Visual semantic deconstruction",
      fitTitle: "Fit Dashboard",
      fitDesc: "Quantified risk insights",
      packagingTitle: "Packaging Lab",
      packagingDesc: "Last-mile emotional rescue",
    },
    sampleLabel: "Active sample",
    countryLabel: "Country",
    categoryLabel: "Category",
    fitScoreLabel: "Current Cultural Fit Score",
    buttons: {
      startScan: "Start Radar Scan",
      scanning: "Semantic Scan Running...",
      nextSample: "Next Gift Sample",
      reset: "Reset State",
    },
    systemStatus: "System Status",
    statusScanning: "Scanning semantic signals...",
    statusIdle: "Ready for cross-cultural scan",
    statusHint:
      "State machine now running as: {state}. Start the scanner to trigger the 3-second radar stage and auto-transition to RESULT.",
    stateIdle: "IDLE: waiting for user action.",
    stateScanning: "SCANNING: radar + scanline animation for 3 seconds.",
    stateResult:
      "RESULT: taboo alert dashboard with phonetics/symbolism/color sub-scores.",
    dashboard: {
      title: "Cultural Fit Dashboard",
      tabooDetected: "Taboo detected",
      culturallySafe: "Culturally safe",
      analysisSuffix: "semantic analysis",
      culturalFitScore: "Cultural Fit Score",
      phonetics: "Phonetics",
      symbolism: "Symbolism",
      color: "Color",
      riskLevel: "Risk Level",
      rescueSuggestion: "Rescue Suggestion",
    },
    xrayHint: {
      phonetic: "Phonetic Risk",
      color: "Color Signal",
      symbolic: "Symbolic Risk",
    },
  },
  zh: {
    brand: "TABOO-FREE GIFTING",
    title: "文化 X 光智能引擎",
    description:
      "用于礼赠决策的跨文化语义重构系统。识别禁忌信号，拆解语义层，给出文化契合的替代方案。",
    language: "语言",
    highlights: {
      xrayTitle: "文化 X 光",
      xrayDesc: "语义风险可视化拆解",
      fitTitle: "契合度看板",
      fitDesc: "多维度量化风险",
      packagingTitle: "包装实验室",
      packagingDesc: "礼赠最后一公里救援",
    },
    sampleLabel: "当前样本",
    countryLabel: "国家",
    categoryLabel: "类别",
    fitScoreLabel: "当前文化契合度",
    buttons: {
      startScan: "开始雷达扫描",
      scanning: "语义扫描进行中...",
      nextSample: "切换下一个样本",
      reset: "重置状态",
    },
    systemStatus: "系统状态",
    statusScanning: "正在扫描语义信号...",
    statusIdle: "准备进行跨文化扫描",
    statusHint:
      "状态机当前为：{state}。点击扫描后将执行 3 秒雷达阶段，并自动切换到 RESULT。",
    stateIdle: "IDLE：等待用户触发。",
    stateScanning: "SCANNING：雷达与扫描线动画持续 3 秒。",
    stateResult: "RESULT：展示禁忌预警看板与三维子分。",
    dashboard: {
      title: "文化契合度看板",
      tabooDetected: "检测到文化禁忌",
      culturallySafe: "文化上相对安全",
      analysisSuffix: "语义分析",
      culturalFitScore: "文化契合度",
      phonetics: "语音联想",
      symbolism: "象征意义",
      color: "色彩寓意",
      riskLevel: "风险等级",
      rescueSuggestion: "挽救建议",
    },
    xrayHint: {
      phonetic: "语音风险",
      color: "色彩信号",
      symbolic: "象征风险",
    },
  },
  ja: {
    brand: "TABOO-FREE GIFTING",
    title: "カルチャー X-Ray インテリジェンス",
    description:
      "贈り物の意思決定を支援する異文化セマンティクス再構築システム。タブー信号を検知し、意味層を可視化し、文化適合な代替案を提示します。",
    language: "言語",
    highlights: {
      xrayTitle: "カルチャー X-Ray",
      xrayDesc: "セマンティックリスクの可視化",
      fitTitle: "適合度ダッシュボード",
      fitDesc: "リスクを定量化して可視化",
      packagingTitle: "パッケージング Lab",
      packagingDesc: "贈答の最終段階を最適化",
    },
    sampleLabel: "現在のサンプル",
    countryLabel: "国",
    categoryLabel: "カテゴリ",
    fitScoreLabel: "現在の文化適合スコア",
    buttons: {
      startScan: "レーダースキャン開始",
      scanning: "セマンティックスキャン中...",
      nextSample: "次のギフトサンプル",
      reset: "状態をリセット",
    },
    systemStatus: "システム状態",
    statusScanning: "意味信号をスキャン中...",
    statusIdle: "異文化スキャンの準備完了",
    statusHint:
      "現在のステートマシン: {state}。スキャン開始で 3 秒間のレーダー段階を実行し、自動で RESULT に遷移します。",
    stateIdle: "IDLE: ユーザー操作を待機中。",
    stateScanning: "SCANNING: レーダーとスキャンラインを 3 秒表示。",
    stateResult: "RESULT: タブー警告と 3 指標スコアを表示。",
    dashboard: {
      title: "文化適合ダッシュボード",
      tabooDetected: "タブーを検知",
      culturallySafe: "文化的に比較的安全",
      analysisSuffix: "セマンティック分析",
      culturalFitScore: "文化適合スコア",
      phonetics: "音声連想",
      symbolism: "象徴性",
      color: "色彩",
      riskLevel: "リスクレベル",
      rescueSuggestion: "リカバリー提案",
    },
    xrayHint: {
      phonetic: "音声リスク",
      color: "色彩シグナル",
      symbolic: "象徴リスク",
    },
  },
  fr: {
    brand: "TABOO-FREE GIFTING",
    title: "Moteur d'intelligence Culture X-Ray",
    description:
      "Système de reconstruction sémantique interculturelle pour le choix des cadeaux. Détecte les signaux tabous, visualise les couches de sens et propose des alternatives adaptées.",
    language: "Langue",
    highlights: {
      xrayTitle: "Culture X-Ray",
      xrayDesc: "Déconstruction visuelle des risques sémantiques",
      fitTitle: "Tableau de compatibilité",
      fitDesc: "Quantification multi-dimensionnelle du risque",
      packagingTitle: "Packaging Lab",
      packagingDesc: "Optimisation de la dernière étape émotionnelle",
    },
    sampleLabel: "Échantillon actif",
    countryLabel: "Pays",
    categoryLabel: "Catégorie",
    fitScoreLabel: "Score actuel d'adéquation culturelle",
    buttons: {
      startScan: "Lancer le scan radar",
      scanning: "Scan sémantique en cours...",
      nextSample: "Échantillon suivant",
      reset: "Réinitialiser l'état",
    },
    systemStatus: "Statut du système",
    statusScanning: "Analyse des signaux sémantiques...",
    statusIdle: "Prêt pour un scan interculturel",
    statusHint:
      "État actuel de la machine: {state}. Lancez le scan pour exécuter 3 secondes de radar puis passer automatiquement à RESULT.",
    stateIdle: "IDLE: en attente d'une action utilisateur.",
    stateScanning: "SCANNING: radar + ligne de scan pendant 3 secondes.",
    stateResult:
      "RESULT: tableau d'alerte tabou avec les sous-scores phonétique/symbolique/couleur.",
    dashboard: {
      title: "Tableau d'adéquation culturelle",
      tabooDetected: "Tabou détecté",
      culturallySafe: "Culturellement sûr",
      analysisSuffix: "analyse sémantique",
      culturalFitScore: "Score d'adéquation culturelle",
      phonetics: "Phonétique",
      symbolism: "Symbolisme",
      color: "Couleur",
      riskLevel: "Niveau de risque",
      rescueSuggestion: "Suggestion de secours",
    },
    xrayHint: {
      phonetic: "Risque phonétique",
      color: "Signal couleur",
      symbolic: "Risque symbolique",
    },
  },
};

const COUNTRY_COPY: Record<Locale, Record<string, string>> = {
  en: {},
  zh: {
    Japan: "日本",
    France: "法国",
    "United Kingdom": "英国",
  },
  ja: {
    Japan: "日本",
    France: "フランス",
    "United Kingdom": "イギリス",
  },
  fr: {
    Japan: "Japon",
    France: "France",
    "United Kingdom": "Royaume-Uni",
  },
};

const CATEGORY_COPY: Record<Locale, Record<string, string>> = {
  en: {},
  zh: {
    Home: "家居",
    Food: "食品",
    Lifestyle: "生活方式",
  },
  ja: {
    Home: "ホーム",
    Food: "フード",
    Lifestyle: "ライフスタイル",
  },
  fr: {
    Home: "Maison",
    Food: "Gastronomie",
    Lifestyle: "Style de vie",
  },
};

type LocalizedGiftNarrative = {
  warning: string;
  rescueItem: string;
  rescueReason: string;
};

const GIFT_LOCALIZED_COPY: Record<Exclude<Locale, "en">, Record<string, LocalizedGiftNarrative>> = {
  zh: {
    jp_001: {
      warning:
        "在许多亚洲文化里，送钟与丧礼语义高度重合，尤其对长辈场景属于高风险禁忌。",
      rescueItem: "有田烧陶瓷花瓶",
      rescueReason: "在日本文化中寓意长寿与匠人精神，表达更稳妥。",
    },
    fr_002: {
      warning: "在大多数正式与日常场景中，这类礼物文化风险较低。",
      rescueItem: "手写感谢卡",
      rescueReason: "可以增加情感温度，提升礼赠体验。",
    },
    uk_003: {
      warning: "在部分礼赠语境中，雨伞可能被解读为分离寓意或带来不吉联想。",
      rescueItem: "美丽诺羊毛围巾",
      rescueReason: "传达温暖与关怀，同时规避符号歧义。",
    },
  },
  ja: {
    jp_001: {
      warning:
        "多くのアジア文化では、時計を贈ることは弔事を連想させるため、特に年長者への贈答で強いタブーとされます。",
      rescueItem: "有田焼の陶磁器花瓶",
      rescueReason: "長寿と職人精神を象徴し、日本文化において好意的に受け取られます。",
    },
    fr_002: {
      warning: "このギフトは多くのフォーマル・カジュアル場面で文化的リスクが低いです。",
      rescueItem: "手書きのサンキューカード",
      rescueReason: "個人的な温かみを加え、贈答体験を高めます。",
    },
    uk_003: {
      warning: "一部の贈答文脈では、傘は別れや不運を示唆すると受け取られる場合があります。",
      rescueItem: "メリノウールのマフラー",
      rescueReason: "曖昧な象徴を避けながら、温かさと思いやりを伝えられます。",
    },
  },
  fr: {
    jp_001: {
      warning:
        "Dans plusieurs cultures asiatiques, offrir une horloge évoque les funérailles et reste un tabou fort, surtout envers les aînés.",
      rescueItem: "Vase en céramique Arita-yaki",
      rescueReason:
        "Il symbolise la longévité et l'esprit artisanal, avec une meilleure adéquation culturelle au Japon.",
    },
    fr_002: {
      warning:
        "Ce cadeau est généralement culturellement sûr dans la plupart des contextes formels et informels.",
      rescueItem: "Carte de remerciement manuscrite",
      rescueReason:
        "Ajoute une valeur émotionnelle personnelle et améliore l'expérience de cadeau.",
    },
    uk_003: {
      warning:
        "Dans certains contextes, un parapluie peut suggérer la séparation ou porter une connotation de malchance.",
      rescueItem: "Écharpe en laine mérinos",
      rescueReason:
        "Transmet chaleur et attention tout en évitant les ambiguïtés symboliques.",
    },
  },
};

export function resolveInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (savedLocale && isLocale(savedLocale)) {
    return savedLocale;
  }

  const browserLocale = window.navigator.language.toLowerCase();

  if (browserLocale.startsWith("zh")) {
    return "zh";
  }

  if (browserLocale.startsWith("ja")) {
    return "ja";
  }

  if (browserLocale.startsWith("fr")) {
    return "fr";
  }

  return "en";
}

export function localizeRiskLevel(
  riskLevel: GiftItem["risk_level"],
  locale: Locale
): string {
  const riskLabelMap: Record<Locale, Record<GiftItem["risk_level"], string>> = {
    en: {
      High: "High",
      Medium: "Medium",
      Low: "Low",
    },
    zh: {
      High: "高",
      Medium: "中",
      Low: "低",
    },
    ja: {
      High: "高",
      Medium: "中",
      Low: "低",
    },
    fr: {
      High: "Eleve",
      Medium: "Moyen",
      Low: "Faible",
    },
  };

  return riskLabelMap[locale][riskLevel];
}

export function getLocalizedGift(gift: GiftItem, locale: Locale) {
  if (locale === "en") {
    return {
      displayName: gift.item_en,
      country: gift.country,
      category: gift.category,
      warning: gift.warning_en,
      rescueItem: gift.rescue_item,
      rescueReason: gift.rescue_reason,
    };
  }

  const localizedNarrative = GIFT_LOCALIZED_COPY[locale][gift.id];
  const localizedCountry = COUNTRY_COPY[locale][gift.country];
  const localizedCategory = CATEGORY_COPY[locale][gift.category];

  return {
    displayName: locale === "zh" ? gift.item_cn : gift.item_en,
    country: localizedCountry ?? gift.country,
    category: localizedCategory ?? gift.category,
    warning: localizedNarrative?.warning ?? gift.warning_en,
    rescueItem: localizedNarrative?.rescueItem ?? gift.rescue_item,
    rescueReason: localizedNarrative?.rescueReason ?? gift.rescue_reason,
  };
}
