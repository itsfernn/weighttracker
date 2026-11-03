(() => {
  "use strict";

  const STORAGE_KEY = "weighline:data";
  const THEME_KEY = "weighline:theme";
  const DAY_MS = 86400000;
  const LB_PER_KG = 2.2046226218487757;
  const CM_PER_IN = 2.54;

  const dom = {
    html: document.documentElement,
    todayLabel: document.getElementById("todayLabel"),
    themeToggle: document.getElementById("themeToggle"),
    openLogButton: document.getElementById("openLogButton"),
    openSettingsButton: document.getElementById("openSettingsButton"),
    introLogButton: document.getElementById("introLogButton"),
    introSetupButton: document.getElementById("introSetupButton"),
    introSetupLabel: document.getElementById("introSetupLabel"),
    profileNudge: document.getElementById("profileNudge"),
    currentDate: document.getElementById("currentDate"),
    currentWeight: document.getElementById("currentWeight"),
    currentWeightUnit: document.getElementById("currentWeightUnit"),
    currentDelta: document.getElementById("currentDelta"),
    weeklyDate: document.getElementById("weeklyDate"),
    weeklyAverage: document.getElementById("weeklyAverage"),
    weeklyAverageUnit: document.getElementById("weeklyAverageUnit"),
    weeklyDelta: document.getElementById("weeklyDelta"),
    bodyFatDate: document.getElementById("bodyFatDate"),
    bodyFatValue: document.getElementById("bodyFatValue"),
    bodyFatDelta: document.getElementById("bodyFatDelta"),
    goalCard: document.getElementById("goalCard"),
    goalDate: document.getElementById("goalDate"),
    goalStatusTag: document.getElementById("goalStatusTag"),
    goalValue: document.getElementById("goalValue"),
    goalUnit: document.getElementById("goalUnit"),
    goalProgressWrap: document.getElementById("goalProgressWrap"),
    goalProgressBar: document.getElementById("goalProgressBar"),
    goalProgressLabel: document.getElementById("goalProgressLabel"),
    goalFoot: document.getElementById("goalFoot"),
    momentumTitle: document.getElementById("momentumTitle"),
    momentumDetail: document.getElementById("momentumDetail"),
    momentumBadge: document.getElementById("momentumBadge"),
    momentumAction: document.getElementById("momentumAction"),
    chartSubtitle: document.getElementById("chartSubtitle"),
    chartStage: document.getElementById("chartStage"),
    chartSvg: document.getElementById("chartSvg"),
    chartTooltip: document.getElementById("chartTooltip"),
    chartEmpty: document.getElementById("chartEmpty"),
    chartEmptyTitle: document.getElementById("chartEmptyTitle"),
    chartEmptyCopy: document.getElementById("chartEmptyCopy"),
    chartInsight: document.getElementById("chartInsight"),
    goalLegend: document.getElementById("goalLegend"),
    trendLegend: document.getElementById("trendLegend"),
    compositionSubtitle: document.getElementById("compositionSubtitle"),
    bmiValue: document.getElementById("bmiValue"),
    bmiFoot: document.getElementById("bmiFoot"),
    bmiTag: document.getElementById("bmiTag"),
    metricBodyFatValue: document.getElementById("metricBodyFatValue"),
    metricBodyFatFoot: document.getElementById("metricBodyFatFoot"),
    bodyFatTag: document.getElementById("bodyFatTag"),
    lbmValue: document.getElementById("lbmValue"),
    lbmUnit: document.getElementById("lbmUnit"),
    lbmFoot: document.getElementById("lbmFoot"),
    lbmTag: document.getElementById("lbmTag"),
    ffmiValue: document.getElementById("ffmiValue"),
    ffmiFoot: document.getElementById("ffmiFoot"),
    ffmiTag: document.getElementById("ffmiTag"),
    historyHeading: document.getElementById("historyHeading"),
    historySubtitle: document.getElementById("historySubtitle"),
    historyList: document.getElementById("historyList"),
    historyEmpty: document.getElementById("historyEmpty"),
    historyFooter: document.getElementById("historyFooter"),
    historyCount: document.getElementById("historyCount"),
    importButton: document.getElementById("importButton"),
    exportButton: document.getElementById("exportButton"),
    fileInput: document.getElementById("fileInput"),
    entryDialog: document.getElementById("entryDialog"),
    entryForm: document.getElementById("entryForm"),
    entryKicker: document.getElementById("entryKicker"),
    entryDialogTitle: document.getElementById("entryDialogTitle"),
    entryDate: document.getElementById("entryDate"),
    entryWeight: document.getElementById("entryWeight"),
    entryWeightUnit: document.getElementById("entryWeightUnit"),
    entryBodyFat: document.getElementById("entryBodyFat"),
    entryNote: document.getElementById("entryNote"),
    entryDateError: document.getElementById("entryDateError"),
    entryWeightError: document.getElementById("entryWeightError"),
    entryBodyFatError: document.getElementById("entryBodyFatError"),
    deleteEntryButton: document.getElementById("deleteEntryButton"),
    saveEntryButton: document.getElementById("saveEntryButton"),
    settingsDialog: document.getElementById("settingsDialog"),
    settingsForm: document.getElementById("settingsForm"),
    heightInput: document.getElementById("heightInput"),
    heightUnit: document.getElementById("heightUnit"),
    heightError: document.getElementById("heightError"),
    referenceInput: document.getElementById("referenceInput"),
    goalWeightInput: document.getElementById("goalWeightInput"),
    goalWeightUnit: document.getElementById("goalWeightUnit"),
    goalWeightError: document.getElementById("goalWeightError"),
    goalBodyFatInput: document.getElementById("goalBodyFatInput"),
    goalBodyFatError: document.getElementById("goalBodyFatError"),
    goalDateInput: document.getElementById("goalDateInput"),
    resetButton: document.getElementById("resetButton"),
    insightDialog: document.getElementById("insightDialog"),
    insightKicker: document.getElementById("insightKicker"),
    insightTitle: document.getElementById("insightTitle"),
    insightSubtitle: document.getElementById("insightSubtitle"),
    insightValue: document.getElementById("insightValue"),
    insightUnit: document.getElementById("insightUnit"),
    insightBadge: document.getElementById("insightBadge"),
    insightDescription: document.getElementById("insightDescription"),
    insightRange: document.getElementById("insightRange"),
    insightChartWrap: document.getElementById("insightChartWrap"),
    insightChart: document.getElementById("insightChart"),
    insightChartEmpty: document.getElementById("insightChartEmpty"),
    insightChartMeta: document.getElementById("insightChartMeta"),
    insightFacts: document.getElementById("insightFacts"),
    insightFootnote: document.getElementById("insightFootnote"),
    insightSettingsButton: document.getElementById("insightSettingsButton"),
    goalDetailDialog: document.getElementById("goalDetailDialog"),
    goalDetailSubtitle: document.getElementById("goalDetailSubtitle"),
    goalDetailTarget: document.getElementById("goalDetailTarget"),
    goalDetailUnit: document.getElementById("goalDetailUnit"),
    goalDetailTargetMeta: document.getElementById("goalDetailTargetMeta"),
    goalDetailBadge: document.getElementById("goalDetailBadge"),
    goalDetailSummary: document.getElementById("goalDetailSummary"),
    goalRequiredPace: document.getElementById("goalRequiredPace"),
    goalRecentPace: document.getElementById("goalRecentPace"),
    goalPaceMeter: document.getElementById("goalPaceMeter"),
    goalPaceContext: document.getElementById("goalPaceContext"),
    goalProjectionNote: document.getElementById("goalProjectionNote"),
    goalBmiValue: document.getElementById("goalBmiValue"),
    goalBmiTag: document.getElementById("goalBmiTag"),
    goalBmiDescription: document.getElementById("goalBmiDescription"),
    goalBfValue: document.getElementById("goalBfValue"),
    goalBfTag: document.getElementById("goalBfTag"),
    goalBfDescription: document.getElementById("goalBfDescription"),
    goalFfmiValue: document.getElementById("goalFfmiValue"),
    goalFfmiTag: document.getElementById("goalFfmiTag"),
    goalFfmiDescription: document.getElementById("goalFfmiDescription"),
    goalForecast: document.getElementById("goalForecast"),
    goalDetailFacts: document.getElementById("goalDetailFacts"),
    goalEditButton: document.getElementById("goalEditButton"),
    confirmDialog: document.getElementById("confirmDialog"),
    confirmForm: document.getElementById("confirmForm"),
    confirmTitle: document.getElementById("confirmTitle"),
    confirmCopy: document.getElementById("confirmCopy"),
    confirmButton: document.getElementById("confirmButton"),
    toastRegion: document.getElementById("toastRegion"),
  };

  const ui = {
    chartMetric: "weight",
    chartRange: "182",
    editingId: null,
    settingsUnit: "metric",
    settingsCanonical: { heightCm: null, goalWeightKg: null },
    currentInsight: null,
    pendingConfirm: null,
  };

  function createDefaultState() {
    return {
      version: 1,
      unitSystem: "metric",
      profile: { heightCm: null, reference: "general" },
      entries: [],
      goal: { weightKg: null, bodyFatPct: null, date: null },
    };
  }

  function safeParseDate(value) {
    const date = value instanceof Date ? new Date(value) : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function normalizeState(input) {
    const base = createDefaultState();
    if (!input || typeof input !== "object") return base;

    base.unitSystem = input.unitSystem === "imperial" ? "imperial" : "metric";
    const height = Number(input.profile?.heightCm);
    base.profile.heightCm = Number.isFinite(height) && height > 0 ? height : null;
    base.profile.reference = ["male", "female"].includes(input.profile?.reference)
      ? input.profile.reference
      : "general";

    const goal = input.goal || {};
    const goalWeight = Number(goal.weightKg);
    const goalBodyFat = Number(goal.bodyFatPct);
    base.goal.weightKg = Number.isFinite(goalWeight) && goalWeight > 0 ? goalWeight : null;
    base.goal.bodyFatPct = Number.isFinite(goalBodyFat) && goalBodyFat >= 0 ? goalBodyFat : null;
    base.goal.date = typeof goal.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(goal.date) ? goal.date : null;
    if (base.goal.weightKg === null) {
      base.goal.bodyFatPct = null;
      base.goal.date = null;
    }

    const entries = Array.isArray(input.entries) ? input.entries : [];
    const seen = new Set();
    base.entries = entries
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const at = safeParseDate(entry.at);
        const weightKg = Number(entry.weightKg);
        if (!at || !Number.isFinite(weightKg) || weightKg <= 0) return null;
        const bodyFatRaw = entry.bodyFatPct;
        const bodyFatPct =
          bodyFatRaw === null || bodyFatRaw === undefined || bodyFatRaw === ""
            ? null
            : Number(bodyFatRaw);
        const safeBodyFat =
          bodyFatPct !== null && Number.isFinite(bodyFatPct) && bodyFatPct >= 0 && bodyFatPct <= 80
            ? bodyFatPct
            : null;
        const id =
          typeof entry.id === "string" && entry.id.length > 0
            ? entry.id
            : `legacy-${at.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
        if (seen.has(id)) return null;
        seen.add(id);
        return {
          id,
          at: at.toISOString(),
          weightKg,
          bodyFatPct: safeBodyFat,
          note: typeof entry.note === "string" ? entry.note.slice(0, 140) : "",
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const diff = new Date(a.at).getTime() - new Date(b.at).getTime();
        return diff || a.id.localeCompare(b.id);
      });

    return base;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      return normalizeState(JSON.parse(raw));
    } catch {
      return createDefaultState();
    }
  }

  let state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      showToast("Weighline couldn't save to this browser. Check your storage settings.", "error");
      return false;
    }
  }

  function sortEntries() {
    state.entries.sort((a, b) => {
      const diff = new Date(a.at).getTime() - new Date(b.at).getTime();
      return diff || a.id.localeCompare(b.id);
    });
  }

  function unitSystem() {
    return state.unitSystem === "imperial" ? "imperial" : "metric";
  }

  function weightUnit() {
    return unitSystem() === "imperial" ? "lb" : "kg";
  }

  function heightUnit() {
    return unitSystem() === "imperial" ? "in" : "cm";
  }

  function toDisplayWeight(kg) {
    return unitSystem() === "imperial" ? kg * LB_PER_KG : kg;
  }

  function toDisplayWeightForUnit(kg, unit) {
    return unit === "imperial" ? kg * LB_PER_KG : kg;
  }

  function toKg(displayWeight) {
    return unitSystem() === "imperial" ? displayWeight / LB_PER_KG : displayWeight;
  }

  function toDisplayHeight(cm) {
    return unitSystem() === "imperial" ? cm / CM_PER_IN : cm;
  }

  function toDisplayHeightForUnit(cm, unit) {
    return unit === "imperial" ? cm / CM_PER_IN : cm;
  }

  function round(value, digits = 2) {
    const factor = 10 ** digits;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatNumber(value, digits = 1) {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  }

  function formatWeight(kg, digits = 1) {
    return formatNumber(toDisplayWeight(kg), digits);
  }

  function formatHeight(cm) {
    const value = toDisplayHeight(cm);
    return formatNumber(value, Number.isInteger(Math.round(value * 10) / 10) ? 0 : 1);
  }

  function displayWeightValue(kg, digits = 2) {
    return String(round(toDisplayWeight(kg), digits));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function toLocalInputValue(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function localDateStamp(date = new Date()) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function startOfWeekMonday(date) {
    const copy = startOfDay(date);
    const day = (copy.getDay() + 6) % 7;
    copy.setDate(copy.getDate() - day);
    return copy;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * DAY_MS);
  }

  function parseDateOnly(value) {
    if (!value) return null;
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function formatDateShort(date) {
    const options = { month: "short", day: "numeric" };
    if (date.getFullYear() !== new Date().getFullYear()) options.year = "numeric";
    return new Intl.DateTimeFormat(undefined, options).format(date);
  }

  function formatDateWithWeekday(date) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
    }).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  function formatRelativeDate(date) {
    const now = new Date();
    if (isSameDay(date, now)) return `Today, ${formatTime(date)}`;
    if (isSameDay(date, addDays(now, -1))) return `Yesterday, ${formatTime(date)}`;
    return `${formatDateShort(date)}, ${formatTime(date)}`;
  }

  function formatWeekRange(start) {
    const end = addDays(start, 6);
    const startMonth = new Intl.DateTimeFormat(undefined, { month: "short" }).format(start);
    const endMonth = new Intl.DateTimeFormat(undefined, { month: "short" }).format(end);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year =
      start.getFullYear() !== new Date().getFullYear()
        ? `, ${start.getFullYear()}`
        : "";
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}–${endDay}${year}`;
    }
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}${year}`;
  }

  function formatGoalDate(value) {
    const date = parseDateOnly(value);
    if (!date) return "";
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
  }

  function formattedToday() {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date());
  }

  function pluralize(count, singular, plural = `${singular}s`) {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  function getLatestEntry() {
    return state.entries.length ? state.entries[state.entries.length - 1] : null;
  }

  function getLatestBodyFatEntry() {
    for (let i = state.entries.length - 1; i >= 0; i -= 1) {
      if (state.entries[i].bodyFatPct !== null) return state.entries[i];
    }
    return null;
  }

  function groupEntriesByWeek(entries, metric) {
    const groups = new Map();
    entries.forEach((entry) => {
      const value = metric === "weight" ? entry.weightKg : entry.bodyFatPct;
      if (!Number.isFinite(value)) return;
      const at = new Date(entry.at);
      const weekStart = startOfWeekMonday(at);
      const key = weekStart.getTime();
      if (!groups.has(key)) {
        groups.set(key, {
          weekStart,
          weekEnd: addDays(weekStart, 6),
          values: [],
          entries: [],
          timestampTotal: 0,
        });
      }
      const group = groups.get(key);
      group.values.push(value);
      group.entries.push(entry);
      group.timestampTotal += at.getTime();
    });

    return Array.from(groups.values())
      .map((group) => ({
        weekStart: group.weekStart,
        weekEnd: group.weekEnd,
        entries: group.entries,
        avg: group.values.reduce((sum, value) => sum + value, 0) / group.values.length,
        meanDate: new Date(group.timestampTotal / group.entries.length),
      }))
      .sort((a, b) => a.weekStart.getTime() - b.weekStart.getTime());
  }

  function calculateMetrics() {
    const latest = getLatestEntry();
    const latestBodyFat = getLatestBodyFatEntry();
    const heightCm = state.profile.heightCm;
    const heightM = heightCm ? heightCm / 100 : null;
    const bmi =
      latest && heightM ? latest.weightKg / (heightM * heightM) : null;
    const bodyFatPct = latestBodyFat ? latestBodyFat.bodyFatPct : null;
    const leanMassKg =
      latestBodyFat && bodyFatPct !== null
        ? latestBodyFat.weightKg * (1 - bodyFatPct / 100)
        : null;
    const fatMassKg =
      latestBodyFat && bodyFatPct !== null
        ? latestBodyFat.weightKg * (bodyFatPct / 100)
        : null;
    const ffmi =
      leanMassKg !== null && heightM ? leanMassKg / (heightM * heightM) : null;
    const normalizedFfmi =
      ffmi !== null && heightM ? ffmi + 6.1 * (1.8 - heightM) : null;

    return {
      latest,
      latestBodyFat,
      bmi,
      bodyFatPct,
      leanMassKg,
      fatMassKg,
      ffmi,
      normalizedFfmi,
      heightCm,
    };
  }

  const REFERENCE_LABELS = {
    general: "General",
    male: "Male",
    female: "Female",
  };

  function referenceGroup() {
    return REFERENCE_LABELS[state.profile.reference] ? state.profile.reference : "general";
  }

  function getBmiContext(value) {
    const bands = [
      { min: 12, max: 18.5, label: "Below range", short: "Below", tone: "cool" },
      { min: 18.5, max: 25, label: "Healthy range", short: "Healthy", tone: "good" },
      { min: 25, max: 30, label: "Above range", short: "Above", tone: "warm" },
      { min: 30, max: 45, label: "High range", short: "High", tone: "hot" },
    ];
    const band =
      bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < bands[0].min ? bands[0] : bands.at(-1));
    const descriptions = {
      "Below range":
        "Below the commonly cited healthy BMI range of 18.5–24.9. BMI is a broad population screen, not a diagnosis.",
      "Healthy range":
        "Inside the commonly cited healthy range of 18.5–24.9. BMI is still only a broad screen and doesn't distinguish muscle from fat.",
      "Above range":
        "Above the commonly cited healthy range of 18.5–24.9. Your FFMI, body fat, and trend can add useful context.",
      "High range":
        "At or above 30, which is a broad signal to look at the whole picture rather than a verdict on your health.",
    };
    return {
      ...band,
      value,
      min: 12,
      max: 45,
      bands,
      description: descriptions[band.label],
      format: (number) => formatNumber(number, 1),
    };
  }

  function getBodyFatReference(type) {
    if (type === "female") {
      return {
        label: "Female reference",
        min: 0,
        max: 50,
        bands: [
          { min: 0, max: 14, label: "Very lean", tone: "cool" },
          { min: 14, max: 21, label: "Athletic", tone: "good" },
          { min: 21, max: 25, label: "Fitness", tone: "good" },
          { min: 25, max: 32, label: "Average", tone: "neutral" },
          { min: 32, max: 50, label: "Above average", tone: "warm" },
        ],
      };
    }
    return {
      label: "Male reference",
      min: 0,
      max: 50,
      bands: [
        { min: 0, max: 6, label: "Very lean", tone: "cool" },
        { min: 6, max: 14, label: "Athletic", tone: "good" },
        { min: 14, max: 18, label: "Fitness", tone: "good" },
        { min: 18, max: 25, label: "Average", tone: "neutral" },
        { min: 25, max: 50, label: "Above average", tone: "warm" },
      ],
    };
  }

  function getBodyFatContext(value) {
    const reference = referenceGroup();
    const descriptions = {
      "Very lean":
        "A very low body fat level. Essential fat supports health, and very lean ranges can be hard to sustain.",
      Athletic:
        "Athletic range for this reference group. This is common in people who train consistently.",
      Fitness:
        "Fitness range for this reference group, typically associated with regular activity and training.",
      Average:
        "Average range for this reference group. Trends and how you feel matter more than a single reading.",
      "Above average":
        "Above the typical range for this reference group. The broader health picture and your trend matter more than one number.",
    };

    if (reference === "general") {
      return {
        label: "Reference varies",
        tone: "neutral",
        description:
          "Body fat ranges are sex-specific. Set a body composition reference in your profile, or compare the male and female ranges below.",
        value,
        references: {
          male: buildBodyFatReferenceContext("male", value, descriptions),
          female: buildBodyFatReferenceContext("female", value, descriptions),
        },
        format: (number) => `${formatNumber(number, 1)}%`,
      };
    }

    const config = getBodyFatReference(reference);
    const band =
      config.bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < config.bands[0].min ? config.bands[0] : config.bands.at(-1));
    return {
      ...config,
      ...band,
      band,
      description: descriptions[band.label],
      value,
      references: null,
      format: (number) => `${formatNumber(number, 1)}%`,
    };
  }

  function buildBodyFatReferenceContext(type, value, descriptions) {
    const config = getBodyFatReference(type);
    const band =
      config.bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < config.bands[0].min ? config.bands[0] : config.bands.at(-1));
    return {
      ...config,
      band,
      description: descriptions[band.label],
      value,
      format: (number) => `${formatNumber(number, 1)}%`,
    };
  }

  function getFfmiContext(value) {
    const reference = referenceGroup();
    const female = reference === "female";
    const thresholds = female ? [15, 17, 19, 21, 23] : [18, 20, 22, 24, 26];
    const labels = [
      { label: "Below average", tone: "cool" },
      { label: "Average", tone: "neutral" },
      { label: "Above average", tone: "good" },
      { label: "Athletic", tone: "good" },
      { label: "Very muscular", tone: "good" },
      { label: "Exceptional", tone: "warm" },
    ];
    const descriptions = {
      "Below average":
        "Below the typical benchmark for this reference. More muscle mass or body weight can raise FFMI.",
      Average: "Around the typical adult benchmark for this reference.",
      "Above average":
        "Above average; often seen in people who strength train regularly.",
      Athletic:
        "Athletic range. Commonly associated with a visibly muscular, trained physique.",
      "Very muscular":
        "Very muscular range, usually the result of years of consistent training.",
      Exceptional:
        "Exceptional and uncommon. Genetics, training history, and measurement error all matter at this level.",
    };
    const min = female ? 12 : 14;
    const max = female ? 30 : 32;
    const bands = thresholds.map((threshold, index) => ({
      min: index === 0 ? min : thresholds[index - 1],
      max: threshold,
      label: labels[index].label,
      tone: labels[index].tone,
    }));
    bands.push({
      min: thresholds.at(-1),
      max,
      label: labels.at(-1).label,
      tone: labels.at(-1).tone,
    });
    const band =
      bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < bands[0].min ? bands[0] : bands.at(-1));
    return {
      ...band,
      value,
      min,
      max,
      bands,
      reference,
      description: descriptions[band.label],
      format: (number) => formatNumber(number, 1),
    };
  }

  function setContextTag(element, context) {
    if (!element) return;
    if (!context) {
      element.hidden = true;
      return;
    }
    element.hidden = false;
    element.textContent = context.label;
    element.className = `context-tag tone-${context.tone}`;
  }

  function setStatusBadge(element, label, tone) {
    if (!element) return;
    element.hidden = false;
    element.textContent = label;
    element.className = `status-badge tone-${tone}`;
  }

  function linearRegression(points) {
    if (points.length < 2) return null;
    const xMean = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const yMean = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    let numerator = 0;
    let denominator = 0;
    points.forEach((point) => {
      numerator += (point.x - xMean) * (point.y - yMean);
      denominator += (point.x - xMean) ** 2;
    });
    if (denominator === 0) return null;
    const slope = numerator / denominator;
    return { slope, intercept: yMean - slope * xMean };
  }

  function getRecentPace(days = 28) {
    const cutoff = Date.now() - days * DAY_MS;
    const samples = state.entries
      .filter((entry) => new Date(entry.at).getTime() >= cutoff)
      .map((entry) => ({
        x: new Date(entry.at).getTime() / DAY_MS,
        y: entry.weightKg,
        at: new Date(entry.at),
      }));
    if (samples.length < 2) return null;
    const spanDays = samples.at(-1).x - samples[0].x;
    if (spanDays < 4) return null;
    const fit = linearRegression(samples);
    if (!fit) return null;
    const kgPerWeek = fit.slope * 7;
    const latestWeight = samples.at(-1).y;
    if (!Number.isFinite(kgPerWeek) || !Number.isFinite(latestWeight) || latestWeight <= 0) {
      return null;
    }
    return {
      kgPerWeek,
      percentPerWeek: (kgPerWeek / latestWeight) * 100,
      samples: samples.length,
      spanDays,
      direction: Math.abs(kgPerWeek) < 0.01 ? "steady" : kgPerWeek > 0 ? "gain" : "loss",
      start: samples[0].at,
      end: samples.at(-1).at,
    };
  }

  function classifyPace(percentPerWeek, direction) {
    const percent = Math.abs(percentPerWeek);
    if (direction === "loss") {
      if (percent < 0.25) {
        return {
          label: "Gentle",
          tone: "cool",
          description: "Under 0.25% of body weight per week is a slow, gentle loss pace.",
        };
      }
      if (percent <= 1) {
        return {
          label: "Sustainable",
          tone: "good",
          description:
            "0.25–1% of body weight per week is commonly considered a sustainable loss range.",
        };
      }
      return {
        label: "Aggressive",
        tone: "warm",
        description:
          "Above 1% of body weight per week is a fast loss pace. Make sure it feels sustainable for you.",
      };
    }
    if (direction === "gain") {
      if (percent < 0.1) {
        return {
          label: "Gentle",
          tone: "cool",
          description: "Under 0.1% of body weight per week is a slow, gradual gain pace.",
        };
      }
      if (percent <= 0.5) {
        return {
          label: "Steady",
          tone: "good",
          description:
            "0.1–0.5% of body weight per week is a controlled gain range for most people.",
        };
      }
      return {
        label: "Fast",
        tone: "warm",
        description:
          "Above 0.5% of body weight per week is a fast gain pace and may include more fat gain.",
      };
    }
    return {
      label: "Steady",
      tone: "neutral",
      description: "Your recent trend is close to flat.",
    };
  }

  function getGoalContext() {
    if (state.goal.weightKg === null) return null;
    const metrics = calculateMetrics();
    const latest = metrics.latest;
    if (!latest) {
      return {
        goal: state.goal,
        latest: null,
        targetWeight: state.goal.weightKg,
        targetBodyFat: state.goal.bodyFatPct,
        date: parseDateOnly(state.goal.date),
        daysLeft: null,
        reached: false,
        requiredPace: null,
        requiredPercent: null,
        requiredClass: null,
        recentPace: null,
        actualClass: null,
        status: { label: "Need data", tone: "neutral", key: "unknown" },
        direction: state.goal.weightKg >= 0 ? "gain" : "loss",
        projectedDate: null,
      };
    }

    const current = latest.weightKg;
    const start = state.entries[0].weightKg;
    const target = state.goal.weightKg;
    const progress = getGoalProgress(current, start, target);
    const date = parseDateOnly(state.goal.date);
    const daysLeft = date
      ? Math.ceil((date.getTime() - Date.now()) / DAY_MS)
      : null;
    const direction =
      Math.abs(target - current) < 0.05 ? "steady" : target > current ? "gain" : "loss";
    const requiredPace =
      date && daysLeft > 0 ? (target - current) / (daysLeft / 7) : null;
    const requiredPercent =
      requiredPace !== null && current > 0 ? (requiredPace / current) * 100 : null;
    const requiredClass =
      requiredPace !== null && direction !== "steady"
        ? classifyPace(requiredPercent, direction)
        : null;
    const recentPace = getRecentPace();
    const actualClass = recentPace
      ? classifyPace(recentPace.percentPerWeek, recentPace.direction)
      : null;

    let projectedDate = null;
    if (
      recentPace &&
      !progress.reached &&
      direction !== "steady" &&
      Math.sign(recentPace.kgPerWeek) === Math.sign(target - current) &&
      Math.abs(recentPace.kgPerWeek) > 0.005
    ) {
      const weeks = Math.abs(target - current) / Math.abs(recentPace.kgPerWeek);
      projectedDate = new Date(Date.now() + weeks * 7 * DAY_MS);
    }

    let status;
    if (progress.reached) {
      status = { label: "Goal reached", tone: "good", key: "reached" };
    } else if (!recentPace) {
      status = { label: "Need data", tone: "neutral", key: "unknown" };
    } else if (!date) {
      status = {
        label: actualClass?.label || "Tracking",
        tone: actualClass?.tone || "neutral",
        key: "pace",
      };
    } else if (daysLeft <= 0) {
      status = { label: "Date passed", tone: "warm", key: "overdue" };
    } else if (direction === "steady") {
      status = { label: "Maintaining", tone: "good", key: "maintain" };
    } else {
      const directionMatches =
        Math.sign(recentPace.kgPerWeek) === Math.sign(requiredPace);
      if (!directionMatches || Math.abs(recentPace.kgPerWeek) < 0.01) {
        status = { label: "Off track", tone: "hot", key: "off-track" };
      } else if (projectedDate) {
        const dayDifference = (projectedDate.getTime() - date.getTime()) / DAY_MS;
        if (dayDifference > 7) {
          status = { label: "Speed up", tone: "warm", key: "behind" };
        } else if (dayDifference < -14 && ["Aggressive", "Fast"].includes(actualClass?.label)) {
          status = { label: "Slow down", tone: "warm", key: "too-fast" };
        } else if (dayDifference < -7) {
          status = { label: "Ahead of pace", tone: "good", key: "ahead" };
        } else {
          status = { label: "On track", tone: "good", key: "on-track" };
        }
      } else {
        const ratio = recentPace.kgPerWeek / requiredPace;
        if (ratio < 0.75) {
          status = { label: "Speed up", tone: "warm", key: "behind" };
        } else if (ratio > 1.75) {
          const tooFast = ["Aggressive", "Fast"].includes(actualClass?.label);
          status = tooFast
            ? { label: "Slow down", tone: "warm", key: "too-fast" }
            : { label: "Ahead of pace", tone: "good", key: "ahead" };
        } else {
          status = { label: "On track", tone: "good", key: "on-track" };
        }
      }
    }

    return {
      goal: state.goal,
      latest,
      current,
      start,
      targetWeight: target,
      targetBodyFat: state.goal.bodyFatPct,
      date,
      daysLeft,
      reached: progress.reached,
      progress: progress.progress,
      direction,
      requiredPace,
      requiredPercent,
      requiredClass,
      recentPace,
      actualClass,
      status,
      projectedDate,
    };
  }

  function formatPaceValue(kgPerWeek) {
    const display = Math.abs(toDisplayWeight(kgPerWeek));
    return formatNumber(display, display < 0.1 ? 2 : 1);
  }



  function trendMarkup(delta, unit, suffix) {
    if (Math.abs(delta) < 0.05) {
      return suffix ? `No change ${suffix}.` : "No change.";
    }
    const direction = delta > 0 ? "up" : "down";
    return `<span class="delta"><svg class="icon" aria-hidden="true"><use href="#i-arrow-${direction}"/></svg><span>${formatNumber(Math.abs(delta), 1)} ${unit}${suffix ? ` ${suffix}` : ""}</span></span>`;
  }

  function getGoalProgress(currentKg, startKg, goalKg) {
    const direction = Math.sign(goalKg - startKg);
    const reached =
      Math.abs(goalKg - startKg) < 0.05
        ? Math.abs(currentKg - goalKg) < 0.05
        : direction > 0
          ? currentKg >= goalKg - 0.05
          : currentKg <= goalKg + 0.05;
    let progress = 0;
    if (reached) {
      progress = 1;
    } else if (Math.abs(startKg - goalKg) > 0.01) {
      progress = clamp((startKg - currentKg) / (startKg - goalKg), 0, 1);
    }
    return { progress, reached };
  }

  function setText(element, text) {
    if (element) element.textContent = text;
  }

  function renderSummary() {
    const unit = weightUnit();
    const latest = getLatestEntry();
    const weeklyGroups = groupEntriesByWeek(state.entries, "weight");
    const latestWeek = weeklyGroups.length ? weeklyGroups[weeklyGroups.length - 1] : null;
    const previousWeek = weeklyGroups.length > 1 ? weeklyGroups[weeklyGroups.length - 2] : null;
    const latestBodyFat = getLatestBodyFatEntry();
    const previousBodyFat = latestBodyFat
      ? state.entries
          .filter((entry) => entry.bodyFatPct !== null && entry.id !== latestBodyFat.id)
          .at(-1)
      : null;

    dom.currentWeightUnit.textContent = unit;
    dom.weeklyAverageUnit.textContent = unit;
    dom.goalUnit.textContent = unit;
    dom.bodyFatValue.textContent = latestBodyFat ? formatNumber(latestBodyFat.bodyFatPct, 1) : "—";
    dom.bodyFatDate.textContent = latestBodyFat ? formatDateShort(new Date(latestBodyFat.at)) : "Not measured";

    if (latest) {
      const latestDate = new Date(latest.at);
      dom.currentWeight.textContent = formatWeight(latest.weightKg, 1);
      dom.currentDate.textContent = formatRelativeDate(latestDate);
      const previous = state.entries.length > 1 ? state.entries[state.entries.length - 2] : null;
      if (previous) {
        const delta = toDisplayWeight(latest.weightKg) - toDisplayWeight(previous.weightKg);
        dom.currentDelta.innerHTML = trendMarkup(delta, unit, "vs previous weigh-in");
      } else {
        dom.currentDelta.textContent = "First weigh-in logged.";
      }
    } else {
      dom.currentWeight.textContent = "—";
      dom.currentDate.textContent = "No data";
      dom.currentDelta.textContent = "Log your first weigh-in to get started.";
    }

    if (latestWeek) {
      dom.weeklyAverage.textContent = formatNumber(toDisplayWeight(latestWeek.avg), 1);
      dom.weeklyDate.textContent = formatWeekRange(latestWeek.weekStart);
      if (previousWeek) {
        const delta =
          toDisplayWeight(latestWeek.avg) - toDisplayWeight(previousWeek.avg);
        dom.weeklyDelta.innerHTML = trendMarkup(delta, unit, "vs previous week");
      } else {
        dom.weeklyDelta.textContent = "First week in the books.";
      }
    } else {
      dom.weeklyAverage.textContent = "—";
      dom.weeklyDate.textContent = "No data";
      dom.weeklyDelta.textContent = "Weekly averages appear after your first entry.";
    }

    if (latestBodyFat) {
      if (previousBodyFat) {
        const delta = latestBodyFat.bodyFatPct - previousBodyFat.bodyFatPct;
        dom.bodyFatDelta.innerHTML = trendMarkup(
          delta,
          "pts",
          `since ${formatDateShort(new Date(previousBodyFat.at))}`,
        );
      } else {
        dom.bodyFatDelta.textContent = "First body fat reading.";
      }

      if (state.goal.bodyFatPct !== null) {
        const difference = latestBodyFat.bodyFatPct - state.goal.bodyFatPct;
        if (Math.abs(difference) < 0.05) {
          dom.bodyFatDelta.textContent = "Body fat goal reached.";
        } else {
          dom.bodyFatDelta.textContent = `Goal ${formatNumber(state.goal.bodyFatPct, 1)}% · ${formatNumber(Math.abs(difference), 1)} pts to go`;
        }
      }
    } else {
      dom.bodyFatDelta.textContent = "Body fat is optional on each weigh-in.";
    }

    if (state.goal.weightKg !== null) {
      const goalContext = getGoalContext();
      dom.goalValue.textContent = formatNumber(toDisplayWeight(state.goal.weightKg), 1);
      const metaParts = [];
      if (state.goal.date) metaParts.push(formatGoalDate(state.goal.date));
      if (state.goal.bodyFatPct !== null) {
        metaParts.push(`${formatNumber(state.goal.bodyFatPct, 1)}% BF`);
      }
      dom.goalDate.textContent = metaParts.length ? metaParts.join(" · ") : "No deadline";
      setContextTag(dom.goalStatusTag, goalContext.status);
      dom.goalCard.classList.add("has-goal");

      if (latest) {
        const progressPercent = Math.round(goalContext.progress * 100);
        dom.goalProgressWrap.hidden = false;
        dom.goalProgressBar.style.width = `${progressPercent}%`;
        dom.goalProgressLabel.textContent = `${progressPercent}%`;

        let copy;
        if (goalContext.reached) {
          dom.goalProgressLabel.textContent = "100%";
          copy = "Goal reached. Nicely done.";
        } else {
          const remaining = Math.abs(latest.weightKg - state.goal.weightKg);
          copy = `${formatNumber(toDisplayWeight(remaining), 1)} ${unit} to go`;
          if (goalContext.requiredPace !== null) {
            copy += ` · ${formatPaceValue(goalContext.requiredPace)} ${unit}/wk (${goalContext.requiredClass?.label?.toLowerCase() || "target pace"})`;
          } else if (goalContext.daysLeft !== null && goalContext.daysLeft <= 0) {
            copy += " · target date passed";
          }
        }
        dom.goalFoot.innerHTML = `<span>${copy}</span> <button class="inline-action goal-detail-link" type="button" data-goal-detail>Details <span aria-hidden="true">→</span></button>`;
      } else {
        dom.goalProgressWrap.hidden = true;
        dom.goalStatusTag.hidden = true;
        dom.goalFoot.innerHTML =
          '<span>Log a weigh-in to start tracking progress.</span> <button class="inline-action goal-detail-link" type="button" data-goal-detail>Details <span aria-hidden="true">→</span></button>';
      }
    } else {
      dom.goalValue.textContent = "—";
      dom.goalDate.textContent = "Not set";
      dom.goalStatusTag.hidden = true;
      dom.goalCard.classList.remove("has-goal");
      dom.goalProgressWrap.hidden = true;
      dom.goalFoot.innerHTML =
        '<button class="inline-action" type="button" data-open-settings>Set a target weight <span aria-hidden="true">→</span></button>';
    }
  }

  function renderComposition() {
    const metrics = calculateMetrics();
    const unit = weightUnit();
    dom.lbmUnit.textContent = unit;
    dom.compositionSubtitle.textContent = state.profile.heightCm
      ? "Calculated from your latest weigh-ins. Select a metric for context and history."
      : "Add your height to unlock BMI, lean mass, and FFMI.";

    if (metrics.bmi !== null) {
      const context = getBmiContext(metrics.bmi);
      dom.bmiValue.textContent = formatNumber(metrics.bmi, 1);
      setContextTag(dom.bmiTag, context);
      const healthyLow = toDisplayWeight(18.5 * (metrics.heightCm / 100) ** 2);
      const healthyHigh = toDisplayWeight(24.9 * (metrics.heightCm / 100) ** 2);
      dom.bmiFoot.textContent = `Healthy weight ${formatNumber(healthyLow, 1)}–${formatNumber(healthyHigh, 1)} ${unit}`;
    } else if (metrics.latest && !state.profile.heightCm) {
      dom.bmiValue.textContent = "—";
      setContextTag(dom.bmiTag, null);
      dom.bmiFoot.innerHTML =
        '<button class="inline-action" type="button" data-open-settings>Add your height <span aria-hidden="true">→</span></button>';
    } else {
      dom.bmiValue.textContent = "—";
      setContextTag(dom.bmiTag, null);
      dom.bmiFoot.textContent = "Log a weigh-in to calculate your BMI.";
    }

    if (metrics.bodyFatPct !== null) {
      const context = getBodyFatContext(metrics.bodyFatPct);
      dom.metricBodyFatValue.textContent = formatNumber(metrics.bodyFatPct, 1);
      setContextTag(
        dom.bodyFatTag,
        referenceGroup() === "general"
          ? { label: "Ranges vary", tone: "neutral" }
          : context,
      );
      if (state.goal.bodyFatPct !== null) {
        const difference = metrics.bodyFatPct - state.goal.bodyFatPct;
        dom.metricBodyFatFoot.textContent =
          Math.abs(difference) < 0.05
            ? `At your ${formatNumber(state.goal.bodyFatPct, 1)}% goal`
            : `Goal ${formatNumber(state.goal.bodyFatPct, 1)}% · ${formatNumber(Math.abs(difference), 1)} pts to go`;
      } else {
        dom.metricBodyFatFoot.textContent = `Measured ${formatDateShort(new Date(metrics.latestBodyFat.at))}`;
      }
    } else {
      dom.metricBodyFatValue.textContent = "—";
      setContextTag(dom.bodyFatTag, null);
      dom.metricBodyFatFoot.textContent = "Add body fat to any weigh-in to track it.";
    }

    if (metrics.leanMassKg !== null) {
      const leanShare =
        (metrics.leanMassKg / metrics.latestBodyFat.weightKg) * 100;
      dom.lbmValue.textContent = formatNumber(toDisplayWeight(metrics.leanMassKg), 1);
      setContextTag(dom.lbmTag, {
        label: `${formatNumber(leanShare, 0)}% lean`,
        tone: "neutral",
      });
      dom.lbmFoot.textContent = metrics.fatMassKg !== null
        ? `Fat mass ${formatNumber(toDisplayWeight(metrics.fatMassKg), 1)} ${unit}`
        : "Calculated from your latest body fat reading.";
    } else {
      dom.lbmValue.textContent = "—";
      setContextTag(dom.lbmTag, null);
      dom.lbmFoot.textContent = "Requires a body fat reading.";
    }

    if (metrics.ffmi !== null) {
      const context = getFfmiContext(metrics.ffmi);
      dom.ffmiValue.textContent = formatNumber(metrics.ffmi, 1);
      setContextTag(dom.ffmiTag, context);
      dom.ffmiFoot.textContent = `Normalized ${formatNumber(metrics.normalizedFfmi, 1)} · from your latest body fat reading`;
    } else if (!state.profile.heightCm && metrics.bodyFatPct !== null) {
      dom.ffmiValue.textContent = "—";
      setContextTag(dom.ffmiTag, null);
      dom.ffmiFoot.innerHTML =
        '<button class="inline-action" type="button" data-open-settings>Add your height <span aria-hidden="true">→</span></button>';
    } else {
      dom.ffmiValue.textContent = "—";
      setContextTag(dom.ffmiTag, null);
      dom.ffmiFoot.textContent = "Requires body fat and height.";
    }
  }

  function renderProfileNudge() {
    const shouldShow = state.entries.length > 0 && !state.profile.heightCm;
    dom.profileNudge.hidden = !shouldShow;
    dom.introSetupLabel.textContent = state.profile.heightCm ? "Edit profile" : "Set up profile";
  }

  function buildRangeTrack(context, value) {
    const width = context.max - context.min;
    const segments = context.bands
      .map((band) => {
        const bandWidth = ((band.max - band.min) / width) * 100;
        return `<span class="range-segment tone-${band.tone}" style="width:${bandWidth.toFixed(2)}%" title="${escapeHtml(`${band.label}: ${context.format(band.min)}–${context.format(band.max)}`)}"></span>`;
      })
      .join("");
    const marker = clamp(((value - context.min) / width) * 100, 0, 100);
    return `<div class="range-track"><div class="range-track-inner">${segments}</div><span class="range-marker" style="left:${marker.toFixed(2)}%"></span></div>`;
  }

  function buildRangeLegend(context) {
    return `<div class="range-legend">${context.bands
      .map(
        (band) =>
          `<span class="range-legend-item"><span class="range-dot tone-${band.tone}"></span>${escapeHtml(band.label)} <span class="range-numbers">${context.format(band.min)}–${context.format(band.max)}</span></span>`,
      )
      .join("")}</div>`;
  }

  function buildSingleRange(context, title) {
    return `<div class="context-range-head"><span>${escapeHtml(title)}</span><strong>${context.format(context.value)}</strong></div>${buildRangeTrack(context, context.value)}${buildRangeLegend(context)}`;
  }

  function buildReferenceCompare(context) {
    const row = (type) => {
      const reference = context.references[type];
      return `<div class="reference-row">
        <div class="reference-row-head"><span>${escapeHtml(reference.label)}</span><strong>${escapeHtml(reference.band.label)}</strong></div>
        ${buildRangeTrack(reference, context.value)}
      </div>`;
    };
    const colorLegend = `<div class="range-legend"><span class="range-legend-item"><span class="range-dot tone-cool"></span>Very lean</span><span class="range-legend-item"><span class="range-dot tone-good"></span>Athletic / fitness</span><span class="range-legend-item"><span class="range-dot tone-neutral"></span>Average</span><span class="range-legend-item"><span class="range-dot tone-warm"></span>Above average</span></div>`;
    return `<div class="context-range-head"><span>Male and female references</span><strong>${context.format(context.value)}</strong></div><div class="reference-compare">${row("male")}${row("female")}</div>${colorLegend}`;
  }

  function buildCompositionRange(metrics) {
    if (metrics.leanMassKg === null || metrics.bodyFatPct === null) return "";
    const leanPercent = 100 - metrics.bodyFatPct;
    const fatPercent = metrics.bodyFatPct;
    return `<div class="context-range-head"><span>Your body composition</span><strong>${formatNumber(leanPercent, 0)}% lean</strong></div>
      <div class="range-track"><div class="range-track-inner">
        <span class="range-segment tone-good" style="width:${leanPercent.toFixed(1)}%"></span>
        <span class="range-segment tone-warm" style="width:${fatPercent.toFixed(1)}%"></span>
      </div></div>
      <div class="range-legend">
        <span class="range-legend-item"><span class="range-dot tone-good"></span>Lean ${formatNumber(toDisplayWeight(metrics.leanMassKg), 1)} ${weightUnit()}</span>
        <span class="range-legend-item"><span class="range-dot tone-warm"></span>Fat ${formatNumber(toDisplayWeight(metrics.fatMassKg), 1)} ${weightUnit()}</span>
      </div>`;
  }

  function buildFactsHtml(facts) {
    return facts
      .map(
        (fact) =>
          `<div class="insight-fact"><span>${escapeHtml(fact.label)}</span><strong>${escapeHtml(fact.value)}</strong>${fact.hint ? `<em>${escapeHtml(fact.hint)}</em>` : ""}</div>`,
      )
      .join("");
  }

  function buildSeriesMeta(series, data) {
    if (!series.length) return "No readings yet";
    if (series.length === 1) return "1 reading";
    const first = series[0];
    const last = series.at(-1);
    const delta = last.value - first.value;
    if (Math.abs(delta) < 0.05) {
      return `No change since ${formatDateShort(first.at)}`;
    }
    const value = `${delta < 0 ? "−" : "+"}${formatNumber(Math.abs(delta), 1)}`;
    const label =
      data.metric === "bmi"
        ? "BMI"
        : data.metric === "bodyFat"
          ? "pts"
          : data.metric === "lbm"
            ? weightUnit()
            : "FFMI";
    return `${value} ${label} since ${formatDateShort(first.at)}`;
  }

  function buildInsightData(metric) {
    const metrics = calculateMetrics();
    const heightM = metrics.heightCm ? metrics.heightCm / 100 : null;
    const unit = weightUnit();
    let data;

    if (metric === "bmi") {
      const series =
        heightM !== null
          ? state.entries.map((entry) => ({
              at: new Date(entry.at),
              value: entry.weightKg / (heightM * heightM),
            }))
          : [];
      const context = metrics.bmi !== null ? getBmiContext(metrics.bmi) : null;
      const healthyLow = heightM ? toDisplayWeight(18.5 * heightM * heightM) : null;
      const healthyHigh = heightM ? toDisplayWeight(24.9 * heightM * heightM) : null;
      data = {
        metric,
        kicker: "Body mass index",
        title: "BMI",
        subtitle: "A population-level screen built from your weight and height.",
        value: metrics.bmi,
        displayValue: metrics.bmi !== null ? formatNumber(metrics.bmi, 1) : "—",
        unit: "kg/m²",
        badge: context
          ? { label: context.label, tone: context.tone }
          : state.profile.heightCm
            ? { label: "Add weigh-in", tone: "neutral" }
            : { label: "Add height", tone: "neutral" },
        description: context
          ? context.description
          : state.profile.heightCm
            ? "Log a weigh-in to calculate BMI and start the trend."
            : "Add your height in the profile settings to calculate BMI and see how it has changed.",
        rangeMode: context ? "single" : "none",
        rangeContext: context,
        rangeTitle: "Common BMI ranges",
        band: heightM ? { min: 18.5, max: 25, label: "Healthy BMI range" } : null,
        goal: null,
        series,
        facts: metrics.latest
          ? [
              {
                label: "Healthy weight",
                value:
                  healthyLow !== null
                    ? `${formatNumber(healthyLow, 1)}–${formatNumber(healthyHigh, 1)} ${unit}`
                    : "Add your height",
                hint: heightM ? `For ${formatHeight(metrics.heightCm)} ${heightUnit()}` : "",
              },
              {
                label: "Current weight",
                value: `${formatWeight(metrics.latest.weightKg, 1)} ${unit}`,
                hint: formatDateShort(new Date(metrics.latest.at)),
              },
              {
                label: "Height",
                value: state.profile.heightCm
                  ? `${formatHeight(state.profile.heightCm)} ${heightUnit()}`
                  : "Not set",
                hint: "",
              },
              {
                label: "Readings",
                value: pluralize(series.length, "weigh-in"),
                hint: "BMI uses every weigh-in",
              },
            ]
          : [],
        footnote:
          "BMI is a broad screening measure and does not distinguish muscle from fat. Use your trend, FFMI, and body fat for a fuller picture.",
        emptyCopy: heightM
          ? "Log a weigh-in to start the BMI trend."
          : "Add your height and log a weigh-in to start the BMI trend.",
        chartUnit: "BMI",
      };
    } else if (metric === "bodyFat") {
      const series = state.entries
        .filter((entry) => entry.bodyFatPct !== null)
        .map((entry) => ({
          at: new Date(entry.at),
          value: entry.bodyFatPct,
        }));
      const context = metrics.bodyFatPct !== null ? getBodyFatContext(metrics.bodyFatPct) : null;
      const reference = referenceGroup();
      const fitnessBand = context && context.bands
        ? context.bands.find((band) => band.label === "Fitness")
        : null;
      data = {
        metric,
        kicker: "Body composition",
        title: "Body fat",
        subtitle: "An estimate of the share of your weight that comes from fat.",
        value: metrics.bodyFatPct,
        displayValue: metrics.bodyFatPct !== null ? formatNumber(metrics.bodyFatPct, 1) : "—",
        unit: "%",
        badge: context
          ? reference === "general"
            ? { label: "Ranges vary", tone: "neutral" }
            : { label: context.band.label, tone: context.band.tone }
          : { label: "No readings", tone: "neutral" },
        description: context
          ? reference === "general"
            ? "Body fat ranges are sex-specific. Choose a reference group in your profile, or compare the male and female ranges below."
            : context.description
          : "Add a body fat percentage to any weigh-in, then your readings and trends will appear here.",
        rangeMode: context ? (reference === "general" ? "references" : "single") : "none",
        rangeContext: context,
        rangeTitle: "Body fat reference ranges",
        band: fitnessBand ? { min: fitnessBand.min, max: fitnessBand.max, label: "Fitness reference" } : null,
        goal: state.goal.bodyFatPct,
        series,
        facts: metrics.latestBodyFat
          ? [
              {
                label: "Fat mass",
                value:
                  metrics.fatMassKg !== null
                    ? `${formatNumber(toDisplayWeight(metrics.fatMassKg), 1)} ${unit}`
                    : "—",
                hint: "At your latest body fat reading",
              },
              {
                label: "Lean mass",
                value:
                  metrics.leanMassKg !== null
                    ? `${formatNumber(toDisplayWeight(metrics.leanMassKg), 1)} ${unit}`
                    : "—",
                hint: "Everything that isn't fat",
              },
              {
                label: "Last measured",
                value: formatDateShort(new Date(metrics.latestBodyFat.at)),
                hint: formatTime(new Date(metrics.latestBodyFat.at)),
              },
              {
                label: "Reference",
                value: REFERENCE_LABELS[reference],
                hint: reference === "general" ? "Set for tailored ranges" : "Used for context only",
              },
            ]
          : [],
        footnote:
          "Body fat estimates vary by measurement method. Trends from the same method are usually more useful than a single reading. Ranges vary by sex and age.",
        emptyCopy: "Add body fat to a weigh-in to start this trend.",
        chartUnit: "%",
      };
    } else if (metric === "lbm") {
      const series = state.entries
        .filter((entry) => entry.bodyFatPct !== null)
        .map((entry) => ({
          at: new Date(entry.at),
          value: toDisplayWeight(entry.weightKg * (1 - entry.bodyFatPct / 100)),
        }));
      const ffmiContext = metrics.ffmi !== null ? getFfmiContext(metrics.ffmi) : null;
      const leanShare =
        metrics.leanMassKg !== null && metrics.latestBodyFat
          ? (metrics.leanMassKg / metrics.latestBodyFat.weightKg) * 100
          : null;
      data = {
        metric,
        kicker: "Body composition",
        title: "Lean body mass",
        subtitle: "Your weight minus fat mass: muscle, bone, organs, and water.",
        value: metrics.leanMassKg !== null ? toDisplayWeight(metrics.leanMassKg) : null,
        displayValue:
          metrics.leanMassKg !== null
            ? formatNumber(toDisplayWeight(metrics.leanMassKg), 1)
            : "—",
        unit,
        badge: ffmiContext
          ? { label: `FFMI ${ffmiContext.label}`, tone: ffmiContext.tone }
          : { label: "Needs body fat", tone: "neutral" },
        description:
          metrics.leanMassKg !== null
            ? `Lean mass is everything besides fat. At your latest reading it makes up ${formatNumber(leanShare, 0)}% of your body weight, and your FFMI is ${formatNumber(metrics.ffmi, 1)}.`
            : "Add a body fat percentage to a weigh-in to calculate lean mass and see how it changes.",
        rangeMode: metrics.leanMassKg !== null ? "composition" : "none",
        rangeContext: null,
        rangeTitle: "Your body composition",
        band: null,
        goal: null,
        series,
        facts: metrics.latestBodyFat
          ? [
              {
                label: "Fat mass",
                value:
                  metrics.fatMassKg !== null
                    ? `${formatNumber(toDisplayWeight(metrics.fatMassKg), 1)} ${unit}`
                    : "—",
                hint: "",
              },
              {
                label: "Body fat",
                value:
                  metrics.bodyFatPct !== null
                    ? `${formatNumber(metrics.bodyFatPct, 1)}%`
                    : "—",
                hint: `${formatNumber(leanShare, 0)}% of weight is lean`,
              },
              {
                label: "FFMI",
                value: metrics.ffmi !== null ? formatNumber(metrics.ffmi, 1) : "Add height",
                hint: ffmiContext ? ffmiContext.label : "",
              },
              {
                label: "Normalized FFMI",
                value:
                  metrics.normalizedFfmi !== null
                    ? formatNumber(metrics.normalizedFfmi, 1)
                    : "Add height",
                hint: "",
              },
            ]
          : [],
        footnote:
          "Lean mass has no universal target on its own. It is most useful alongside body fat, height, and FFMI, and as a personal trend over time.",
        emptyCopy: "Add body fat to a weigh-in to start the lean mass trend.",
        chartUnit: unit,
      };
    } else {
      const series =
        metrics.heightCm !== null
          ? state.entries
              .filter((entry) => entry.bodyFatPct !== null)
              .map((entry) => {
                const leanKg = entry.weightKg * (1 - entry.bodyFatPct / 100);
                return {
                  at: new Date(entry.at),
                  value: leanKg / (heightM * heightM),
                };
              })
          : [];
      const context = metrics.ffmi !== null ? getFfmiContext(metrics.ffmi) : null;
      const athleticBand = context
        ? context.bands.find((band) => band.label === "Athletic")
        : null;
      data = {
        metric: "ffmi",
        kicker: "Fat-free mass index",
        title: "FFMI",
        subtitle: "Lean mass relative to height — a way to compare muscularity.",
        value: metrics.ffmi,
        displayValue: metrics.ffmi !== null ? formatNumber(metrics.ffmi, 1) : "—",
        unit: "kg/m²",
        badge: context
          ? { label: context.label, tone: context.tone }
          : state.profile.heightCm
            ? { label: "Needs body fat", tone: "neutral" }
            : metrics.bodyFatPct !== null
              ? { label: "Add height", tone: "neutral" }
              : { label: "Needs body fat + height", tone: "neutral" },
        description: context
          ? context.description
          : state.profile.heightCm
            ? "Add a body fat percentage to a weigh-in to calculate FFMI and see how it has changed."
            : "FFMI needs both your height and a body fat reading. Add both to put lean mass in context.",
        rangeMode: context ? "single" : "none",
        rangeContext: context,
        rangeTitle: "FFMI reference ranges",
        band: athleticBand
          ? { min: athleticBand.min, max: athleticBand.max, label: "Athletic reference" }
          : null,
        goal: null,
        series,
        facts: metrics.ffmi !== null
          ? [
              {
                label: "Normalized FFMI",
                value: formatNumber(metrics.normalizedFfmi, 1),
                hint: "Adjusts for height",
              },
              {
                label: "Lean mass",
                value: `${formatNumber(toDisplayWeight(metrics.leanMassKg), 1)} ${unit}`,
                hint: "",
              },
              {
                label: "Height",
                value: `${formatHeight(metrics.heightCm)} ${heightUnit()}`,
                hint: "",
              },
              {
                label: "Reference",
                value: REFERENCE_LABELS[referenceGroup()],
                hint: "Used for context only",
              },
            ]
          : [],
        footnote:
          "FFMI benchmarks are approximate and vary by sex, age, training history, and genetics. They are not a measure of health. Athletic values commonly sit around 22–24 for men; ranges for women are typically a few points lower.",
        emptyCopy: "Add body fat and height to start the FFMI trend.",
        chartUnit: "FFMI",
      };
    }

    data.chartMeta = buildSeriesMeta(data.series, data);
    return data;
  }

  function renderInsightChart(data) {
    const width = Math.max(260, Math.round(dom.insightChartWrap.clientWidth));
    const height = Math.max(140, Math.round(dom.insightChartWrap.clientHeight));
    const series = data.series;
    if (!series.length) {
      dom.insightChart.hidden = true;
      dom.insightChartEmpty.hidden = false;
      dom.insightChartEmpty.textContent = data.emptyCopy;
      return;
    }

    dom.insightChart.hidden = false;
    dom.insightChartEmpty.hidden = true;
    const margins = { top: 13, right: 13, bottom: 25, left: 37 };
    const plot = {
      left: margins.left,
      right: width - margins.right,
      top: margins.top,
      bottom: height - margins.bottom,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    };

    let start = series[0].at;
    let end = series.at(-1).at;
    if (end.getTime() - start.getTime() < 7 * DAY_MS) {
      const middle = new Date((start.getTime() + end.getTime()) / 2);
      start = addDays(middle, -4);
      end = addDays(middle, 4);
    }
    let dataMin = Math.min(...series.map((point) => point.value));
    let dataMax = Math.max(...series.map((point) => point.value));
    if (data.band) {
      dataMin = Math.min(dataMin, data.band.min);
      dataMax = Math.max(dataMax, data.band.max);
    }
    if (data.goal !== null && data.goal !== undefined) {
      dataMin = Math.min(dataMin, data.goal);
      dataMax = Math.max(dataMax, data.goal);
    }
    if (dataMax - dataMin < 0.2) {
      dataMin -= 1;
      dataMax += 1;
    }
    const padding = (dataMax - dataMin) * 0.15;
    let axisMin = dataMin - padding;
    let axisMax = dataMax + padding;
    const step = niceStep((axisMax - axisMin) / 3);
    axisMin = Math.floor(axisMin / step) * step;
    axisMax = Math.ceil(axisMax / step) * step;

    const xScale = (date) =>
      plot.left +
      ((date.getTime() - start.getTime()) / Math.max(1, end.getTime() - start.getTime())) *
        plot.width;
    const yScale = (value) =>
      plot.bottom - ((value - axisMin) / Math.max(0.0001, axisMax - axisMin)) * plot.height;
    const parts = [];

    if (data.band) {
      const top = yScale(Math.min(data.band.max, axisMax));
      const bottom = yScale(Math.max(data.band.min, axisMin));
      if (bottom > top) {
        parts.push(
          `<rect class="detail-band" x="${plot.left}" y="${top.toFixed(1)}" width="${plot.width}" height="${(bottom - top).toFixed(1)}"></rect>`,
        );
      }
    }

    for (let i = 0; i <= 3; i += 1) {
      const value = axisMin + ((axisMax - axisMin) * i) / 3;
      const y = yScale(value);
      parts.push(
        `<line class="detail-grid" x1="${plot.left}" y1="${y.toFixed(1)}" x2="${plot.right}" y2="${y.toFixed(1)}"></line>`,
        `<text class="detail-axis" x="${plot.left - 7}" y="${(y + 3).toFixed(1)}" text-anchor="end">${formatNumber(value, axisMax - axisMin < 5 ? 1 : 0)}</text>`,
      );
    }

    for (let i = 0; i < 3; i += 1) {
      const ratio = i / 2;
      const date = new Date(start.getTime() + (end.getTime() - start.getTime()) * ratio);
      const x = plot.left + plot.width * ratio;
      const anchor = i === 0 ? "start" : i === 2 ? "end" : "middle";
      parts.push(
        `<text class="detail-axis" x="${x.toFixed(1)}" y="${height - 8}" text-anchor="${anchor}">${formatDateShort(date)}</text>`,
      );
    }

    if (data.goal !== null && data.goal !== undefined) {
      const y = yScale(data.goal);
      if (y >= plot.top && y <= plot.bottom) {
        parts.push(
          `<line class="detail-goal" x1="${plot.left}" y1="${y.toFixed(1)}" x2="${plot.right}" y2="${y.toFixed(1)}"></line>`,
        );
      }
    }

    const points = series.map((point) => ({
      ...point,
      x: xScale(point.at),
      y: yScale(point.value),
    }));
    if (points.length > 1) {
      const line = points
        .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
        .join(" ");
      parts.push(`<path class="detail-line" d="${line}"></path>`);
    }

    const fit =
      series.length > 1
        ? linearRegression(
            series.map((point) => ({
              x: point.at.getTime() / DAY_MS,
              y: point.value,
            })),
          )
        : null;
    if (fit) {
      const first = series[0].at.getTime() / DAY_MS;
      const last = series.at(-1).at.getTime() / DAY_MS;
      parts.push(
        `<line class="detail-trend" x1="${xScale(series[0].at).toFixed(1)}" y1="${yScale(fit.intercept + fit.slope * first).toFixed(1)}" x2="${xScale(series.at(-1).at).toFixed(1)}" y2="${yScale(fit.intercept + fit.slope * last).toFixed(1)}"></line>`,
      );
    }

    const dotStride = points.length > 60 ? Math.ceil(points.length / 60) : 1;
    points.forEach((point, index) => {
      if (index !== points.length - 1 && index % dotStride !== 0) return;
      parts.push(
        `<circle class="${index === points.length - 1 ? "detail-dot-latest" : "detail-dot"}" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${index === points.length - 1 ? 4.2 : 2.5}"></circle>`,
      );
    });

    dom.insightChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
    dom.insightChart.setAttribute(
      "aria-label",
      `${data.title} trend from ${formatDateShort(series[0].at)} to ${formatDateShort(series.at(-1).at)}`,
    );
    dom.insightChart.innerHTML = parts.join("");
  }

  function openInsight(metric) {
    const data = buildInsightData(metric);
    ui.currentInsight = data;
    dom.insightKicker.textContent = data.kicker;
    dom.insightTitle.textContent = data.title;
    dom.insightSubtitle.textContent = data.subtitle;
    dom.insightValue.textContent = data.displayValue;
    dom.insightUnit.textContent = data.unit;
    dom.insightBadge.textContent = data.badge.label;
    dom.insightBadge.className = `context-badge tone-${data.badge.tone}`;
    dom.insightDescription.textContent = data.description;
    dom.insightChartMeta.textContent = data.chartMeta;
    dom.insightFacts.innerHTML = buildFactsHtml(data.facts);
    dom.insightFootnote.textContent = data.footnote;

    if (data.rangeMode === "single" && data.rangeContext) {
      dom.insightRange.hidden = false;
      dom.insightRange.innerHTML = buildSingleRange(
        data.rangeContext,
        data.rangeTitle || "Reference ranges",
      );
    } else if (data.rangeMode === "references" && data.rangeContext) {
      dom.insightRange.hidden = false;
      dom.insightRange.innerHTML = buildReferenceCompare(data.rangeContext);
    } else if (data.rangeMode === "composition") {
      dom.insightRange.hidden = false;
      dom.insightRange.innerHTML = buildCompositionRange(calculateMetrics());
    } else {
      dom.insightRange.hidden = true;
      dom.insightRange.innerHTML = "";
    }

    dom.insightDialog.scrollTop = 0;
    dom.insightDialog.showModal();
    window.requestAnimationFrame(() => renderInsightChart(data));
  }

  function buildPaceMeter(goalContext) {
    if (!goalContext || goalContext.direction === "steady") return "";
    const isLoss = goalContext.direction === "loss";
    const boundaries = isLoss ? [0.25, 1] : [0.1, 0.5];
    const standardMax = isLoss ? 1.2 : 0.8;
    const values = [];
    if (goalContext.requiredPercent !== null) values.push(Math.abs(goalContext.requiredPercent));
    if (
      goalContext.recentPace &&
      (goalContext.requiredPace === null ||
        Math.sign(goalContext.recentPace.kgPerWeek) === Math.sign(goalContext.requiredPace))
    ) {
      values.push(Math.abs(goalContext.recentPace.percentPerWeek));
    }
    const domain = Math.max(standardMax, ...values.map((value) => value * 1.1), 0.2);
    const labels = isLoss
      ? ["Gentle", "Sustainable", "Fast"]
      : ["Gentle", "Steady", "Fast"];
    const bands = [
      { start: 0, end: boundaries[0], tone: "cool" },
      { start: boundaries[0], end: boundaries[1], tone: "good" },
      { start: boundaries[1], end: domain, tone: "warm" },
    ];
    const bandHtml = bands
      .map(
        (band) =>
          `<span class="pace-meter-band tone-${band.tone}" style="width:${(((band.end - band.start) / domain) * 100).toFixed(2)}%"></span>`,
      )
      .join("");
    const labelHtml = bands
      .map(
        (band, index) =>
          `<span style="width:${(((band.end - band.start) / domain) * 100).toFixed(2)}%">${labels[index]}</span>`,
      )
      .join("");
    let requiredMarker = "";
    let recentMarker = "";
    if (goalContext.requiredPercent !== null) {
      const left = clamp((Math.abs(goalContext.requiredPercent) / domain) * 100, 0, 100);
      requiredMarker = `<span class="pace-meter-marker" style="left:${left.toFixed(2)}%" title="Goal pace"></span>`;
    }
    if (
      goalContext.recentPace &&
      goalContext.requiredPace !== null &&
      Math.sign(goalContext.recentPace.kgPerWeek) === Math.sign(goalContext.requiredPace)
    ) {
      const left = clamp((Math.abs(goalContext.recentPace.percentPerWeek) / domain) * 100, 0, 100);
      recentMarker = `<span class="pace-meter-marker is-recent" style="left:${left.toFixed(2)}%" title="Recent pace"></span>`;
    } else if (goalContext.recentPace && goalContext.requiredPace === null) {
      const left = clamp((Math.abs(goalContext.recentPace.percentPerWeek) / domain) * 100, 0, 100);
      recentMarker = `<span class="pace-meter-marker is-recent" style="left:${left.toFixed(2)}%" title="Recent pace"></span>`;
    }
    return `<div class="pace-meter-track"><div class="pace-meter-bands">${bandHtml}</div>${requiredMarker}${recentMarker}</div><div class="pace-meter-labels">${labelHtml}</div><div class="pace-marker-legend"><span><i class="pace-key"></i>Goal pace</span><span><i class="pace-key is-recent"></i>Recent pace</span></div>`;
  }

  function openGoalDetail() {
    if (state.goal.weightKg === null) {
      openSettings();
      return;
    }
    const goalContext = getGoalContext();
    const metrics = calculateMetrics();
    const unit = weightUnit();
    const heightM = metrics.heightCm ? metrics.heightCm / 100 : null;
    const targetWeight = goalContext.targetWeight;
    const targetBmi = heightM ? targetWeight / (heightM * heightM) : null;
    const targetBmiContext = targetBmi !== null ? getBmiContext(targetBmi) : null;
    const currentLean = metrics.leanMassKg;
    const currentFfmi = metrics.ffmi;
    const projectedBf =
      currentLean !== null && targetWeight > currentLean
        ? (1 - currentLean / targetWeight) * 100
        : null;
    const projectedBfContext =
      projectedBf !== null ? getBodyFatContext(projectedBf) : null;
    const targetFfmi =
      currentLean !== null && heightM ? currentLean / (heightM * heightM) : null;
    const targetFfmiContext =
      targetFfmi !== null ? getFfmiContext(targetFfmi) : null;
    const weightForTargetBf =
      currentLean !== null && goalContext.targetBodyFat !== null
        ? currentLean / (1 - goalContext.targetBodyFat / 100)
        : null;

    const metaParts = [];
    if (goalContext.date) metaParts.push(formatTargetDate(goalContext.date));
    if (goalContext.targetBodyFat !== null) {
      metaParts.push(`${formatNumber(goalContext.targetBodyFat, 1)}% body fat`);
    }
    dom.goalDetailSubtitle.textContent = `Target ${formatNumber(toDisplayWeight(targetWeight), 1)} ${unit}${goalContext.date ? ` by ${formatTargetDate(goalContext.date)}` : ""}${goalContext.targetBodyFat !== null ? ` · ${formatNumber(goalContext.targetBodyFat, 1)}% body fat` : ""}.`;
    dom.goalDetailTarget.textContent = formatNumber(toDisplayWeight(targetWeight), 1);
    dom.goalDetailUnit.textContent = unit;
    dom.goalDetailTargetMeta.textContent = metaParts.length
      ? metaParts.join(" · ")
      : "No deadline";
    setStatusBadge(
      dom.goalDetailBadge,
      goalContext.status.label,
      goalContext.status.tone,
    );
    dom.goalDetailSummary.textContent = goalSummaryText(goalContext);

    dom.goalRequiredPace.textContent =
      goalContext.requiredPace !== null
        ? `${formatPaceValue(goalContext.requiredPace)} ${unit}/wk`
        : "No deadline";
    if (goalContext.recentPace) {
      const sign =
        goalContext.recentPace.direction === "gain"
          ? "+"
          : goalContext.recentPace.direction === "loss"
            ? "−"
            : "";
      dom.goalRecentPace.textContent =
        goalContext.recentPace.direction === "steady"
          ? `0.0 ${unit}/wk`
          : `${sign}${formatPaceValue(goalContext.recentPace.kgPerWeek)} ${unit}/wk`;
    } else {
      dom.goalRecentPace.textContent = "Need more data";
    }

    const paceContextParts = [];
    if (goalContext.requiredPace !== null) {
      const percentText = formatNumber(
        Math.abs(goalContext.requiredPercent),
        Math.abs(goalContext.requiredPercent) < 0.1 ? 2 : 1,
      );
      paceContextParts.push(
        `The target needs ${formatPaceValue(goalContext.requiredPace)} ${unit}/wk, or about ${percentText}% of body weight per week — a ${goalContext.requiredClass?.label?.toLowerCase() || "target"} pace.`,
      );
    } else if (!goalContext.date) {
      paceContextParts.push(
        "Set a target date to calculate the weekly pace needed and compare it with your recent trend.",
      );
    }
    if (goalContext.recentPace) {
      paceContextParts.push(
        `Your recent trend is a ${goalContext.actualClass.label.toLowerCase()} pace.`,
      );
    } else {
      paceContextParts.push("There aren't enough recent weigh-ins for a pace comparison yet.");
    }
    paceContextParts.push("General fitness guidance, not medical advice.");
    dom.goalPaceContext.textContent = paceContextParts.join(" ");
    dom.goalPaceMeter.innerHTML = goalContext.latest ? buildPaceMeter(goalContext) : "";

    if (targetBmi !== null) {
      dom.goalBmiValue.textContent = formatNumber(targetBmi, 1);
      setContextTag(dom.goalBmiTag, targetBmiContext);
      if (heightM) {
        const healthyLow = toDisplayWeight(18.5 * heightM * heightM);
        const healthyHigh = toDisplayWeight(24.9 * heightM * heightM);
        dom.goalBmiDescription.textContent = `${targetBmiContext.description} Healthy weight for your height is ${formatNumber(healthyLow, 1)}–${formatNumber(healthyHigh, 1)} ${unit}.`;
      } else {
        dom.goalBmiDescription.textContent = targetBmiContext.description;
      }
    } else {
      dom.goalBmiValue.textContent = "—";
      setContextTag(dom.goalBmiTag, null);
      dom.goalBmiDescription.textContent = "Add your height to project BMI at this goal.";
    }

    if (projectedBf !== null && projectedBfContext) {
      dom.goalBfValue.textContent = `${formatNumber(projectedBf, 1)}%`;
      setContextTag(dom.goalBfTag, {
        label: projectedBfContext.band ? projectedBfContext.band.label : projectedBfContext.label,
        tone: projectedBfContext.band ? projectedBfContext.band.tone : projectedBfContext.tone,
      });
      let copy = `At ${formatNumber(toDisplayWeight(targetWeight), 1)} ${unit} with your current lean mass, estimated body fat is ${formatNumber(projectedBf, 1)}%.`;
      if (goalContext.targetBodyFat !== null) {
        const difference = projectedBf - goalContext.targetBodyFat;
        if (Math.abs(difference) < 1) {
          copy += ` That's in line with your ${formatNumber(goalContext.targetBodyFat, 1)}% target.`;
        } else {
          copy += ` That differs from your ${formatNumber(goalContext.targetBodyFat, 1)}% target by ${formatNumber(Math.abs(difference), 1)} pts.`;
        }
        if (weightForTargetBf !== null) {
          copy += ` Holding lean mass, ${formatNumber(goalContext.targetBodyFat, 1)}% body fat would correspond to about ${formatNumber(toDisplayWeight(weightForTargetBf), 1)} ${unit}.`;
        }
      }
      dom.goalBfDescription.textContent = copy;
    } else {
      dom.goalBfValue.textContent = "—";
      setContextTag(dom.goalBfTag, null);
      if (currentLean === null) {
        dom.goalBfDescription.textContent = "Add a body fat reading to estimate body fat at this goal.";
      } else {
        dom.goalBfDescription.textContent =
          "This target weight is below your current lean mass. Reaching it would require losing lean mass, so a body fat projection isn't meaningful.";
      }
    }

    if (targetFfmi !== null) {
      dom.goalFfmiValue.textContent = formatNumber(targetFfmi, 1);
      setContextTag(dom.goalFfmiTag, targetFfmiContext);
      dom.goalFfmiDescription.textContent = `If lean mass stays near ${formatNumber(toDisplayWeight(currentLean), 1)} ${unit}, FFMI would remain around ${formatNumber(targetFfmi, 1)} — ${targetFfmiContext.label.toLowerCase()} for this reference.`;
    } else {
      dom.goalFfmiValue.textContent = "—";
      setContextTag(dom.goalFfmiTag, null);
      dom.goalFfmiDescription.textContent =
        "Add body fat and height to project FFMI at this goal.";
    }

    dom.goalProjectionNote.textContent =
      currentLean !== null
        ? `Assumes lean mass stays near ${formatNumber(toDisplayWeight(currentLean), 1)} ${unit}.`
        : "Projections need a body fat reading and height.";

    const forecastParts = [];
    if (goalContext.reached) {
      forecastParts.push("You've reached this goal weight. Set a new target whenever you're ready.");
    } else if (goalContext.projectedDate) {
      forecastParts.push(
        `At your recent pace, you're projected to reach ${formatNumber(toDisplayWeight(targetWeight), 1)} ${unit} around <strong>${formatProjectedDate(goalContext.projectedDate)}</strong>.`,
      );
      if (goalContext.date) {
        const dayDifference = Math.round(
          (goalContext.projectedDate.getTime() - goalContext.date.getTime()) / DAY_MS,
        );
        if (dayDifference < -1) {
          forecastParts.push(`That's about ${Math.abs(dayDifference)} days ahead of your target date.`);
        } else if (dayDifference > 1) {
          forecastParts.push(`That's about ${dayDifference} days after your target date.`);
        } else {
          forecastParts.push("That's right around your target date.");
        }
      }
    } else if (goalContext.recentPace && goalContext.status.key === "off-track") {
      forecastParts.push(
        "Your recent direction is moving away from this goal, so no finish date can be projected yet.",
      );
    } else {
      forecastParts.push(
        "Log a few more weigh-ins to project a finish date at your current pace.",
      );
    }
    if (projectedBf !== null) {
      forecastParts.push(
        `Expected body fat at this weight is about ${formatNumber(projectedBf, 1)}% if lean mass stays the same.`,
      );
    }
    dom.goalForecast.innerHTML = forecastParts.join(" ");

    const remaining = goalContext.latest
      ? Math.abs(targetWeight - goalContext.current)
      : 0;
    const projectedLabel = goalContext.projectedDate
      ? formatProjectedDate(goalContext.projectedDate)
      : "Need more data";
    dom.goalDetailFacts.innerHTML = buildFactsHtml([
      {
        label: "Progress",
        value:
          goalContext.latest !== null
            ? `${Math.round(goalContext.progress * 100)}%`
            : "No weigh-ins yet",
        hint: goalContext.latest ? `${formatNumber(toDisplayWeight(remaining), 1)} ${unit} remaining` : "",
      },
      {
        label: "Target date",
        value: goalContext.date ? formatTargetDate(goalContext.date) : "No deadline",
        hint: goalContext.daysLeft !== null && goalContext.daysLeft > 0 ? `${goalContext.daysLeft} days left` : "",
      },
      {
        label: "Projected finish",
        value: projectedLabel,
        hint: goalContext.recentPace ? "At your recent pace" : "Needs more weigh-ins",
      },
      {
        label: "Goal pace",
        value:
          goalContext.requiredPace !== null
            ? `${formatPaceValue(goalContext.requiredPace)} ${unit}/wk`
            : "No deadline",
        hint: goalContext.requiredClass ? `${goalContext.requiredClass.label} pace` : "",
      },
    ]);

    dom.goalDetailDialog.scrollTop = 0;
    if (dom.insightDialog.open) dom.insightDialog.close();
    dom.goalDetailDialog.showModal();
  }

  function formatProjectedDate(date) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
    }).format(date);
  }

  function formatTargetDate(date) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
    }).format(date);
  }

  function goalSummaryText(goalContext) {
    if (!goalContext || !goalContext.latest) {
      return "Log your first weigh-in to start tracking this goal.";
    }
    const unit = weightUnit();
    const current = goalContext.current;
    const target = goalContext.targetWeight;
    const remaining = formatNumber(toDisplayWeight(Math.abs(target - current)), 1);
    if (goalContext.reached) {
      return "You've reached this target. Set a new goal whenever you're ready.";
    }

    const recentCopy = goalContext.recentPace
      ? `Recent pace is ${formatPaceValue(goalContext.recentPace.kgPerWeek)} ${unit}/wk${goalContext.actualClass ? ` (${goalContext.actualClass.label.toLowerCase()})` : ""}.`
      : "There aren't enough recent weigh-ins for a pace estimate.";

    if (!goalContext.date) {
      const projection = goalContext.projectedDate
        ? ` At this pace, you'd reach ${formatNumber(toDisplayWeight(target), 1)} ${unit} around ${formatProjectedDate(goalContext.projectedDate)}.`
        : "";
      return `${remaining} ${unit} to go. ${recentCopy}${projection} Add a target date for on-track guidance.`;
    }

    if (goalContext.daysLeft <= 0) {
      return `${remaining} ${unit} to go, and the target date has passed. ${recentCopy}`;
    }

    const targetDate = formatTargetDate(goalContext.date);
    const required = formatPaceValue(goalContext.requiredPace);
    const statusKey = goalContext.status.key;

    if (statusKey === "on-track" || statusKey === "maintain") {
      const projected = goalContext.projectedDate
        ? ` You're projected to reach it around ${formatProjectedDate(goalContext.projectedDate)}.`
        : "";
      return `${remaining} ${unit} to go. ${recentCopy} That's on track for ${targetDate}.${projected}`;
    }
    if (statusKey === "ahead") {
      return `${remaining} ${unit} to go. ${recentCopy} You're ahead of the ${required} ${unit}/wk needed for ${targetDate}.`;
    }
    if (statusKey === "behind") {
      return `${remaining} ${unit} to go. ${recentCopy} You need about ${required} ${unit}/wk for ${targetDate}, so a little more momentum would help.`;
    }
    if (statusKey === "off-track") {
      return `${remaining} ${unit} to go. ${recentCopy} Your recent direction is moving away from the target, so the pace needs to turn around.`;
    }
    if (statusKey === "too-fast") {
      return `${remaining} ${unit} to go. ${recentCopy} You're moving faster than the ${required} ${unit}/wk needed. That's fine if it feels sustainable, but you can ease off.`;
    }
    if (statusKey === "overdue") {
      return `${remaining} ${unit} to go, and the target date has passed. ${recentCopy}`;
    }
    return `${remaining} ${unit} to go. ${recentCopy} The target date is ${targetDate}.`;
  }

  function renderMomentum() {
    const recent = getRecentPace();
    const goalContext = getGoalContext();
    let title = "Waiting for more data";
    let detail = "Log a few weigh-ins and we'll show your average weekly pace.";
    let badge = { label: "Not enough data", tone: "neutral" };
    let action = "Log a weigh-in";

    if (recent) {
      const unit = weightUnit();
      const pace = formatPaceValue(recent.kgPerWeek);
      if (recent.direction === "loss") title = `Losing ${pace} ${unit}/week`;
      else if (recent.direction === "gain") title = `Gaining ${pace} ${unit}/week`;
      else title = "Holding steady";

      if (goalContext) {
        badge = goalContext.status;
        detail = goalSummaryText(goalContext);
        action = "Goal details";
      } else {
        badge = classifyPace(
          recent.percentPerWeek,
          recent.direction === "loss"
            ? "loss"
            : recent.direction === "gain"
              ? "gain"
              : "steady",
        );
        detail = `${badge.description} Set a goal to get on-track guidance.`;
        action = "Set a goal";
      }
    } else if (goalContext) {
      badge = goalContext.status;
      detail = goalSummaryText(goalContext);
      action = "Goal details";
    } else if (state.entries.length > 0) {
      detail =
        "At least two weigh-ins over a few days will show your average weekly pace.";
      action = "Log a weigh-in";
    }

    dom.momentumTitle.textContent = title;
    dom.momentumDetail.textContent = detail;
    setStatusBadge(dom.momentumBadge, badge.label, badge.tone);
    dom.momentumAction.innerHTML = `${escapeHtml(action)} <span aria-hidden="true">→</span>`;
  }

  function getChartConfig() {
    if (ui.chartMetric === "bodyFat") {
      return {
        key: "bodyFat",
        label: "body fat",
        unit: "%",
        axisUnit: "%",
        value: (entry) => entry.bodyFatPct,
        display: (value) => value,
        goal: state.goal.bodyFatPct,
        format: (value) => `${formatNumber(value, 1)}%`,
        defaultPadding: 1.2,
      };
    }
    return {
      key: "weight",
      label: "weight",
      unit: weightUnit(),
      axisUnit: weightUnit(),
      value: (entry) => entry.weightKg,
      display: (value) => toDisplayWeight(value),
      goal: state.goal.weightKg,
      format: (value) => `${formatNumber(value, 1)} ${weightUnit()}`,
      defaultPadding: unitSystem() === "imperial" ? 2 : 1,
    };
  }

  function rangeLabel(range) {
    const labels = {
      28: "last 4 weeks",
      90: "last 3 months",
      182: "last 6 months",
      365: "last year",
      all: "all time",
    };
    return labels[range] || "last 6 months";
  }

  function niceStep(rawStep) {
    if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;
    const power = 10 ** Math.floor(Math.log10(rawStep));
    const normalized = rawStep / power;
    let nice = 10;
    if (normalized <= 1) nice = 1;
    else if (normalized <= 2) nice = 2;
    else if (normalized <= 2.5) nice = 2.5;
    else if (normalized <= 5) nice = 5;
    return nice * power;
  }

  function renderChart() {
    const config = getChartConfig();
    const now = new Date();
    const metricEntries = state.entries.filter(
      (entry) => entry[config.key === "bodyFat" ? "bodyFatPct" : "weightKg"] !== null,
    );

    dom.chartSubtitle.textContent = `Weekly ${config.label} averages${config.unit ? ` in ${config.unit}` : ""} · ${rangeLabel(ui.chartRange)}.`;

    if (!metricEntries.length) {
      showChartEmpty(
        ui.chartMetric === "bodyFat" ? "No body fat readings yet" : "Your trend starts here",
        ui.chartMetric === "bodyFat"
          ? "Add a body fat percentage to a weigh-in and its weekly average will appear here."
          : "Log a few weigh-ins and your weekly averages will take shape.",
      );
      return;
    }

    let end;
    let start;
    if (ui.chartRange === "all") {
      const first = new Date(metricEntries[0].at);
      const last = new Date(metricEntries[metricEntries.length - 1].at);
      start = new Date(first);
      end = new Date(last);
      if (end.getTime() - start.getTime() < 14 * DAY_MS) {
        const middle = new Date((start.getTime() + end.getTime()) / 2);
        start = addDays(middle, -14);
        end = addDays(middle, 14);
      }
    } else {
      end = now;
      start = addDays(now, -Number(ui.chartRange));
    }

    const filtered = metricEntries.filter((entry) => {
      const time = new Date(entry.at).getTime();
      return time >= start.getTime() && time <= end.getTime();
    });

    if (!filtered.length) {
      showChartEmpty(
        "Nothing in this range",
        "Try a wider time range or log a fresh weigh-in to bring the chart up to date.",
      );
      return;
    }

    const weeklyGroups = groupEntriesByWeek(filtered, config.key);
    const width = Math.max(280, Math.round(dom.chartStage.clientWidth));
    const height = Math.max(220, Math.round(dom.chartStage.clientHeight));
    const margins =
      width < 480
        ? { top: 17, right: 13, bottom: 27, left: 38 }
        : { top: 20, right: 18, bottom: 30, left: 48 };
    const plot = {
      left: margins.left,
      right: width - margins.right,
      top: margins.top,
      bottom: height - margins.bottom,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    };

    const dailyValues = filtered.map((entry) => config.display(config.value(entry)));
    const weeklyValues = weeklyGroups.map((group) => config.display(group.avg));
    let dataMin = Math.min(...dailyValues, ...weeklyValues);
    let dataMax = Math.max(...dailyValues, ...weeklyValues);
    const dataSpan = dataMax - dataMin;
    const displayGoal = config.goal !== null ? config.display(config.goal) : null;
    const goalTolerance = Math.max(dataSpan * 0.8, config.defaultPadding * 2.5);
    const showGoal =
      displayGoal !== null &&
      displayGoal >= dataMin - goalTolerance &&
      displayGoal <= dataMax + goalTolerance;

    let domainMin = dataMin;
    let domainMax = dataMax;
    if (showGoal) {
      domainMin = Math.min(domainMin, displayGoal);
      domainMax = Math.max(domainMax, displayGoal);
    }
    if (domainMax - domainMin < 0.2) {
      domainMin -= config.defaultPadding;
      domainMax += config.defaultPadding;
    }
    const rawSpan = domainMax - domainMin;
    const padding = Math.max(rawSpan * 0.14, config.defaultPadding * 0.35);
    let axisMin = domainMin - padding;
    let axisMax = domainMax + padding;
    const step = niceStep((axisMax - axisMin) / 4);
    axisMin = Math.floor(axisMin / step) * step;
    axisMax = Math.ceil(axisMax / step) * step;

    const xScale = (date) =>
      plot.left +
      ((date.getTime() - start.getTime()) / Math.max(1, end.getTime() - start.getTime())) *
        plot.width;
    const yScale = (value) =>
      plot.bottom - ((value - axisMin) / Math.max(0.0001, axisMax - axisMin)) * plot.height;

    const parts = [];
    parts.push(
      '<defs><linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" style="stop-color:var(--brand);stop-opacity:.22"></stop><stop offset="100%" style="stop-color:var(--brand);stop-opacity:0"></stop></linearGradient></defs>',
    );

    const tickCount = 4;
    for (let i = 0; i <= tickCount; i += 1) {
      const value = axisMin + ((axisMax - axisMin) * i) / tickCount;
      const y = yScale(value);
      parts.push(
        `<line class="chart-grid" x1="${plot.left}" y1="${y.toFixed(1)}" x2="${plot.right}" y2="${y.toFixed(1)}"></line>`,
        `<text class="chart-axis-text" x="${plot.left - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end">${formatNumber(value, axisMax - axisMin < 5 ? 1 : 0)}</text>`,
      );
    }

    const labelCount = width < 420 ? 3 : width < 700 ? 4 : 5;
    const spanMs = end.getTime() - start.getTime();
    for (let i = 0; i < labelCount; i += 1) {
      const ratio = labelCount === 1 ? 0.5 : i / (labelCount - 1);
      const date = new Date(start.getTime() + spanMs * ratio);
      const x = plot.left + plot.width * ratio;
      const anchor = i === 0 ? "start" : i === labelCount - 1 ? "end" : "middle";
      let label;
      if (spanMs > 300 * DAY_MS) {
        label = new Intl.DateTimeFormat(undefined, {
          month: "short",
          year: "2-digit",
        }).format(date);
      } else if (spanMs > 60 * DAY_MS) {
        label = new Intl.DateTimeFormat(undefined, { month: "short" }).format(date);
      } else {
        label = new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
        }).format(date);
      }
      parts.push(
        `<text class="chart-axis-text" x="${x.toFixed(1)}" y="${height - 8}" text-anchor="${anchor}">${label}</text>`,
      );
    }

    if (showGoal) {
      const goalY = yScale(displayGoal);
      parts.push(
        `<line class="chart-goal-line" x1="${plot.left}" y1="${goalY.toFixed(1)}" x2="${plot.right}" y2="${goalY.toFixed(1)}"></line>`,
        `<text class="chart-goal-label" x="${plot.right}" y="${(goalY - 7).toFixed(1)}" text-anchor="end">GOAL ${config.format(displayGoal)}</text>`,
      );
    }

    const trendSamples = filtered.map((entry) => ({
      x: new Date(entry.at).getTime() / DAY_MS,
      y: config.display(config.value(entry)),
      at: new Date(entry.at),
    }));
    const trendFit =
      trendSamples.length > 1 &&
      trendSamples.at(-1).x - trendSamples[0].x > 0.5
        ? linearRegression(trendSamples)
        : null;
    let trendLine = null;
    let trendRate = null;
    if (trendFit) {
      const firstTime = trendSamples[0].x;
      const lastTime = trendSamples.at(-1).x;
      trendLine = {
        x1: xScale(trendSamples[0].at),
        y1: yScale(trendFit.intercept + trendFit.slope * firstTime),
        x2: xScale(trendSamples.at(-1).at),
        y2: yScale(trendFit.intercept + trendFit.slope * lastTime),
      };
      trendRate = trendFit.slope * 7;
    }

    const dailyPoints = filtered.map((entry) => ({
      x: xScale(new Date(entry.at)),
      y: yScale(config.display(config.value(entry))),
    }));
    dailyPoints.forEach((point) => {
      parts.push(
        `<circle class="chart-daily-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="2.15"></circle>`,
      );
    });

    const weeklyPoints = weeklyGroups.map((group) => ({
      x: xScale(group.meanDate),
      y: yScale(config.display(group.avg)),
      group,
      value: config.display(group.avg),
    }));

    if (weeklyPoints.length > 1) {
      const line = weeklyPoints
        .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
        .join(" ");
      const area = `${line} L${weeklyPoints.at(-1).x.toFixed(1)} ${plot.bottom} L${weeklyPoints[0].x.toFixed(1)} ${plot.bottom} Z`;
      parts.push(
        `<path class="chart-area" d="${area}"></path>`,
        `<path class="chart-line" d="${line}"></path>`,
      );
    }

    if (trendLine) {
      parts.push(
        `<line class="chart-trend-line" x1="${trendLine.x1.toFixed(1)}" y1="${trendLine.y1.toFixed(1)}" x2="${trendLine.x2.toFixed(1)}" y2="${trendLine.y2.toFixed(1)}"></line>`,
      );
    }

    weeklyPoints.forEach((point, index) => {
      if (index === weeklyPoints.length - 1) {
        parts.push(
          `<circle class="chart-pulse" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="8"></circle>`,
          `<circle class="chart-dot-latest" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4.6"></circle>`,
        );
      } else {
        parts.push(
          `<circle class="chart-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.7"></circle>`,
        );
      }
    });

    parts.push(
      `<line class="chart-crosshair" id="chartCrosshair" x1="0" y1="${plot.top}" x2="0" y2="${plot.bottom}"></line>`,
      `<circle class="chart-focus-dot" id="chartFocusDot" cx="0" cy="0" r="5"></circle>`,
      `<rect class="chart-hit" x="${plot.left}" y="${plot.top}" width="${plot.width}" height="${plot.height}"></rect>`,
    );

    dom.chartSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    dom.chartSvg.setAttribute(
      "aria-label",
      `Weekly average ${config.label} chart from ${formatDateShort(start)} to ${formatDateShort(end)}`,
    );
    dom.chartSvg.innerHTML = parts.join("");
    dom.chartSvg.hidden = false;
    dom.chartEmpty.hidden = true;
    dom.chartTooltip.classList.remove("is-visible");
    dom.goalLegend.classList.toggle("is-hidden", !showGoal);
    dom.trendLegend.classList.toggle("is-hidden", !trendLine);

    dom.chartStage.__chartModel = {
      points: weeklyPoints,
      plot,
      width,
      height,
      config,
      showGoal,
    };

    const trendUnit = config.key === "bodyFat" ? "pts" : config.unit;
    const trendCopy =
      trendRate !== null && Number.isFinite(trendRate)
        ? `Trend <strong>${trendRate < 0 ? "−" : "+"}${formatNumber(Math.abs(trendRate), Math.abs(trendRate) < 0.1 ? 2 : 1)} ${trendUnit}/wk</strong>.`
        : "";
    if (weeklyGroups.length > 1) {
      const latest = weeklyGroups.at(-1);
      const previous = weeklyGroups.at(-2);
      const delta = config.display(latest.avg) - config.display(previous.avg);
      const formattedDelta = formatNumber(Math.abs(delta), 1);
      if (Math.abs(delta) < 0.05) {
        dom.chartInsight.innerHTML = `Weekly averages are holding steady. ${trendCopy}`;
      } else {
        const direction = delta > 0 ? "higher" : "lower";
        const unit = config.key === "bodyFat" ? "pts" : config.unit;
        dom.chartInsight.innerHTML = `Latest week is <strong>${formattedDelta} ${unit} ${direction}</strong> than the week before. ${trendCopy}`;
      }
    } else {
      dom.chartInsight.innerHTML =
        trendCopy || "One week logged. Keep checking in to build a clearer trend.";
    }
  }

  function showChartEmpty(title, copy) {
    dom.chartSvg.hidden = true;
    dom.chartEmpty.hidden = false;
    dom.chartTooltip.classList.remove("is-visible");
    dom.goalLegend.classList.add("is-hidden");
    dom.trendLegend.classList.add("is-hidden");
    dom.chartEmptyTitle.textContent = title;
    dom.chartEmptyCopy.textContent = copy;
    dom.chartInsight.textContent = "";
    dom.chartStage.__chartModel = null;
  }

  function handleChartPointer(event) {
    const model = dom.chartStage.__chartModel;
    if (!model || !model.points.length) return;
    const rect = dom.chartStage.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    let nearest = model.points[0];
    let smallest = Math.abs(localX - nearest.x);
    model.points.forEach((point) => {
      const distance = Math.abs(localX - point.x);
      if (distance < smallest) {
        smallest = distance;
        nearest = point;
      }
    });

    const crosshair = dom.chartSvg.querySelector("#chartCrosshair");
    const focusDot = dom.chartSvg.querySelector("#chartFocusDot");
    if (crosshair) {
      crosshair.setAttribute("x1", nearest.x);
      crosshair.setAttribute("x2", nearest.x);
      crosshair.style.opacity = "1";
    }
    if (focusDot) {
      focusDot.setAttribute("cx", nearest.x);
      focusDot.setAttribute("cy", nearest.y);
      focusDot.style.opacity = "1";
    }

    const value = model.config.format(nearest.value);
    dom.chartTooltip.innerHTML = `<span class="tooltip-label">${formatWeekRange(nearest.group.weekStart)}</span><strong>${value}</strong><span>${pluralize(nearest.group.entries.length, "weigh-in")}</span>`;
    const halfWidth = dom.chartTooltip.offsetWidth / 2 || 82;
    dom.chartTooltip.style.left = `${clamp(nearest.x, halfWidth + 8, model.width - halfWidth - 8)}px`;
    dom.chartTooltip.style.top = `${clamp(nearest.y, 79, model.height - 14)}px`;
    dom.chartTooltip.classList.add("is-visible");
  }

  function hideChartTooltip() {
    dom.chartTooltip.classList.remove("is-visible");
    const crosshair = dom.chartSvg.querySelector("#chartCrosshair");
    const focusDot = dom.chartSvg.querySelector("#chartFocusDot");
    if (crosshair) crosshair.style.opacity = "0";
    if (focusDot) focusDot.style.opacity = "0";
  }

  function renderHistory() {
    const sorted = [...state.entries].sort((a, b) => new Date(b.at) - new Date(a.at));
    const unit = weightUnit();

    dom.historySubtitle.textContent = state.entries.length
      ? `${pluralize(state.entries.length, "weigh-in")} saved locally.`
      : "Every entry, saved locally.";
    dom.historyEmpty.hidden = sorted.length > 0;
    dom.historyFooter.hidden = sorted.length === 0;
    dom.historyCount.textContent = pluralize(sorted.length, "entry", "entries");

    if (!sorted.length) {
      dom.historyList.innerHTML = "";
      return;
    }

    const chronological = [...state.entries];
    const previousById = new Map();
    chronological.forEach((entry, index) => {
      previousById.set(entry.id, index > 0 ? chronological[index - 1] : null);
    });

    const rows = sorted.map((entry) => {
      const entryDate = new Date(entry.at);
      const previous = previousById.get(entry.id);
      const delta = previous
        ? toDisplayWeight(entry.weightKg) - toDisplayWeight(previous.weightKg)
        : null;
      const note = entry.note ? ` · ${entry.note}` : "";
      const bf =
        entry.bodyFatPct !== null ? formatNumber(entry.bodyFatPct, 1) : "—";
      const leanMass =
        entry.bodyFatPct !== null
          ? `${formatNumber(toDisplayWeight(entry.weightKg * (1 - entry.bodyFatPct / 100)), 1)} <small>${unit}</small>`
          : "—";
      let deltaCopy = "";
      if (delta !== null) {
        if (Math.abs(delta) < 0.05) {
          deltaCopy = "No change";
        } else {
          const direction = delta > 0 ? "up" : "down";
          deltaCopy = `<svg class="icon" aria-hidden="true"><use href="#i-arrow-${direction}"/></svg>${formatNumber(Math.abs(delta), 1)} ${unit}`;
        }
      }

      return `<div class="history-item" role="row">
        <div class="history-date">
          <strong>${isSameDay(entryDate, new Date()) ? "Today" : formatDateWithWeekday(entryDate)}</strong>
          <span title="${escapeHtml(`${formatTime(entryDate)}${note}`)}">${formatTime(entryDate)}${escapeHtml(note)}</span>
        </div>
        <div class="history-cell history-weight" role="cell">
          <span class="cell-label">Weight</span>
          <div class="history-value">${formatWeight(entry.weightKg, 1)} <small>${unit}</small></div>
          <div class="history-sub">${deltaCopy}</div>
        </div>
        <div class="history-cell" role="cell">
          <span class="cell-label">Body fat</span>
          <div class="history-value">${bf}${entry.bodyFatPct !== null ? " <small>%</small>" : ""}</div>
        </div>
        <div class="history-cell" role="cell">
          <span class="cell-label">Lean mass</span>
          <div class="history-value">${leanMass}</div>
        </div>
        <div class="history-row-actions">
          <button class="row-button" type="button" data-action="edit" data-id="${escapeHtml(entry.id)}" aria-label="Edit weigh-in from ${escapeHtml(formatDateWithWeekday(entryDate))}">
            <svg class="icon" aria-hidden="true"><use href="#i-edit"/></svg>
          </button>
          <button class="row-button is-delete" type="button" data-action="delete" data-id="${escapeHtml(entry.id)}" aria-label="Delete weigh-in from ${escapeHtml(formatDateWithWeekday(entryDate))}">
            <svg class="icon" aria-hidden="true"><use href="#i-trash"/></svg>
          </button>
        </div>
      </div>`;
    });

    dom.historyList.innerHTML = `<div class="history-columns" role="row" aria-hidden="true"><span>Date</span><span>Weight</span><span>Body fat</span><span>Lean mass</span><span></span></div>${rows.join("")}`;
  }

  function render() {
    sortEntries();
    updateTodayLabel();
    renderSummary();
    renderMomentum();
    renderComposition();
    renderProfileNudge();
    renderChart();
    renderHistory();
  }

  function updateTodayLabel() {
    dom.todayLabel.textContent = formattedToday();
  }

  function setFieldError(errorElement, inputElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute("role", "alert");
    }
    inputElement?.closest(".field")?.classList.add("has-error");
    if (inputElement) {
      inputElement.setAttribute("aria-invalid", "true");
      if (errorElement?.id) inputElement.setAttribute("aria-describedby", errorElement.id);
    }
  }

  function clearFormErrors(form) {
    form.querySelectorAll(".field-error").forEach((element) => {
      element.textContent = "";
      element.removeAttribute("role");
    });
    form.querySelectorAll(".field.has-error").forEach((field) => {
      field.classList.remove("has-error");
    });
    form.querySelectorAll("[aria-invalid], [aria-describedby]").forEach((input) => {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    });
  }

  function openEntryDialog(entry = null) {
    ui.editingId = entry ? entry.id : null;
    clearFormErrors(dom.entryForm);
    dom.entryForm.reset();
    const date = entry ? new Date(entry.at) : new Date();
    dom.entryDate.value = toLocalInputValue(date);
    dom.entryDate.max = toLocalInputValue(new Date());
    dom.entryWeightUnit.textContent = weightUnit();
    dom.entryWeight.value = entry ? displayWeightValue(entry.weightKg) : "";
    dom.entryBodyFat.value = entry?.bodyFatPct !== null && entry?.bodyFatPct !== undefined
      ? String(round(entry.bodyFatPct, 2))
      : "";
    dom.entryNote.value = entry?.note || "";
    dom.entryKicker.textContent = entry ? "Edit entry" : "Daily check-in";
    dom.entryDialogTitle.textContent = entry ? "Edit weigh-in" : "Log a weigh-in";
    dom.deleteEntryButton.hidden = !entry;
    dom.saveEntryButton.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>' +
      (entry ? "Save changes" : "Save weigh-in");
    dom.entryDialog.showModal();
    window.setTimeout(() => {
      dom.entryWeight.focus();
      dom.entryWeight.select();
    }, 40);
  }

  function validateEntryForm() {
    clearFormErrors(dom.entryForm);
    let valid = true;
    let firstInvalid = null;

    const dateValue = dom.entryDate.value;
    const date = dateValue ? new Date(dateValue) : null;
    if (!date || Number.isNaN(date.getTime())) {
      setFieldError(dom.entryDateError, dom.entryDate, "Choose a valid date and time.");
      valid = false;
      firstInvalid = firstInvalid || dom.entryDate;
    } else if (date.getTime() > Date.now() + 60000) {
      setFieldError(dom.entryDateError, dom.entryDate, "The time can't be in the future.");
      valid = false;
      firstInvalid = firstInvalid || dom.entryDate;
    }

    const displayWeight = Number(dom.entryWeight.value);
    if (!Number.isFinite(displayWeight) || displayWeight <= 0) {
      setFieldError(dom.entryWeightError, dom.entryWeight, "Enter your weight.");
      valid = false;
      firstInvalid = firstInvalid || dom.entryWeight;
    } else {
      const kg = toKg(displayWeight);
      if (kg < 10 || kg > 500) {
        setFieldError(
          dom.entryWeightError,
          dom.entryWeight,
          `Enter a weight between ${formatNumber(toDisplayWeight(10), 0)} and ${formatNumber(toDisplayWeight(500), 0)} ${weightUnit()}.`,
        );
        valid = false;
        firstInvalid = firstInvalid || dom.entryWeight;
      }
    }

    const bodyFatValue = dom.entryBodyFat.value.trim();
    if (bodyFatValue !== "") {
      const bodyFat = Number(bodyFatValue);
      if (!Number.isFinite(bodyFat) || bodyFat < 0 || bodyFat > 80) {
        setFieldError(dom.entryBodyFatError, dom.entryBodyFat, "Use a percentage between 0 and 80.");
        valid = false;
        firstInvalid = firstInvalid || dom.entryBodyFat;
      }
    }

    if (!valid) firstInvalid?.focus();
    return valid;
  }

  function handleEntrySubmit(event) {
    event.preventDefault();
    if (!validateEntryForm()) return;

    const date = new Date(dom.entryDate.value);
    const weightKg = round(toKg(Number(dom.entryWeight.value)), 3);
    const bodyFatRaw = dom.entryBodyFat.value.trim();
    const bodyFatPct = bodyFatRaw === "" ? null : round(Number(bodyFatRaw), 2);
    const note = dom.entryNote.value.trim().slice(0, 140);

    if (ui.editingId) {
      const entry = state.entries.find((candidate) => candidate.id === ui.editingId);
      if (entry) {
        entry.at = date.toISOString();
        entry.weightKg = weightKg;
        entry.bodyFatPct = bodyFatPct;
        entry.note = note;
      }
    } else {
      state.entries.push({
        id: crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        at: date.toISOString(),
        weightKg,
        bodyFatPct,
        note,
      });
    }

    if (!saveState()) return;
    const wasEditing = Boolean(ui.editingId);
    ui.editingId = null;
    dom.entryDialog.close();
    render();
    showToast(wasEditing ? "Weigh-in updated." : "Weigh-in saved.");
  }

  function openSettings() {
    clearFormErrors(dom.settingsForm);
    ui.settingsUnit = state.unitSystem;
    ui.settingsCanonical = {
      heightCm: state.profile.heightCm,
      goalWeightKg: state.goal.weightKg,
    };
    const metricRadio = dom.settingsForm.querySelector('input[name="unitSystem"][value="metric"]');
    const imperialRadio = dom.settingsForm.querySelector('input[name="unitSystem"][value="imperial"]');
    if (metricRadio && imperialRadio) {
      metricRadio.checked = ui.settingsUnit === "metric";
      imperialRadio.checked = ui.settingsUnit === "imperial";
    }
    dom.heightUnit.textContent = heightUnit();
    dom.goalWeightUnit.textContent = weightUnit();
    dom.heightInput.value =
      state.profile.heightCm !== null
        ? String(round(toDisplayHeight(state.profile.heightCm), 1))
        : "";
    dom.goalWeightInput.value =
      state.goal.weightKg !== null
        ? String(round(toDisplayWeight(state.goal.weightKg), 1))
        : "";
    dom.goalBodyFatInput.value =
      state.goal.bodyFatPct !== null ? String(round(state.goal.bodyFatPct, 1)) : "";
    dom.goalDateInput.value = state.goal.date || "";
    dom.referenceInput.value = referenceGroup();
    dom.settingsDialog.showModal();
  }

  function inputMatchesCanonical(input, canonicalDisplay) {
    if (canonicalDisplay === null || !input.value.trim()) return false;
    const value = Number(input.value);
    if (!Number.isFinite(value)) return false;
    return (
      Math.abs(value - round(canonicalDisplay, 1)) < 0.0001 ||
      Math.abs(value - round(canonicalDisplay, 2)) < 0.0001
    );
  }

  function handleSettingsUnitChange(event) {
    const newUnit = event.target.value;
    const oldUnit = ui.settingsUnit;
    if (newUnit === oldUnit) return;

    const canonicalHeightDisplay =
      ui.settingsCanonical.heightCm !== null
        ? toDisplayHeightForUnit(ui.settingsCanonical.heightCm, oldUnit)
        : null;
    if (dom.heightInput.value.trim()) {
      if (inputMatchesCanonical(dom.heightInput, canonicalHeightDisplay)) {
        dom.heightInput.value = String(
          round(toDisplayHeightForUnit(ui.settingsCanonical.heightCm, newUnit), 1),
        );
      } else {
        const parsed = Number(dom.heightInput.value);
        if (Number.isFinite(parsed)) {
          const cm = oldUnit === "metric" ? parsed : parsed * CM_PER_IN;
          dom.heightInput.value = String(
            round(newUnit === "metric" ? cm : cm / CM_PER_IN, 1),
          );
        }
      }
    }

    const canonicalGoalDisplay =
      ui.settingsCanonical.goalWeightKg !== null
        ? toDisplayWeightForUnit(ui.settingsCanonical.goalWeightKg, oldUnit)
        : null;
    if (dom.goalWeightInput.value.trim()) {
      if (inputMatchesCanonical(dom.goalWeightInput, canonicalGoalDisplay)) {
        dom.goalWeightInput.value = String(
          round(toDisplayWeightForUnit(ui.settingsCanonical.goalWeightKg, newUnit), 1),
        );
      } else {
        const parsed = Number(dom.goalWeightInput.value);
        if (Number.isFinite(parsed)) {
          const kg = oldUnit === "metric" ? parsed : parsed / LB_PER_KG;
          dom.goalWeightInput.value = String(
            round(newUnit === "metric" ? kg : kg * LB_PER_KG, 1),
          );
        }
      }
    }

    ui.settingsUnit = newUnit;
    dom.heightUnit.textContent = newUnit === "imperial" ? "in" : "cm";
    dom.goalWeightUnit.textContent = newUnit === "imperial" ? "lb" : "kg";
  }

  function handleSettingsSubmit(event) {
    event.preventDefault();
    clearFormErrors(dom.settingsForm);
    let valid = true;
    let firstInvalid = null;

    const unit = dom.settingsForm.querySelector('input[name="unitSystem"]:checked')?.value || "metric";
    let heightCm = null;
    if (dom.heightInput.value.trim() !== "") {
      const displayHeight = Number(dom.heightInput.value);
      const centimeters = unit === "imperial" ? displayHeight * CM_PER_IN : displayHeight;
      if (!Number.isFinite(centimeters) || centimeters < 50 || centimeters > 275) {
        setFieldError(
          dom.heightError,
          dom.heightInput,
          `Use a height between ${formatNumber(unit === "imperial" ? 50 / CM_PER_IN : 50, 0)} and ${formatNumber(unit === "imperial" ? 275 / CM_PER_IN : 275, 0)} ${unit === "imperial" ? "in" : "cm"}.`,
        );
        valid = false;
        firstInvalid = firstInvalid || dom.heightInput;
      } else if (
        ui.settingsCanonical.heightCm !== null &&
        inputMatchesCanonical(
          dom.heightInput,
          toDisplayHeightForUnit(ui.settingsCanonical.heightCm, unit),
        )
      ) {
        heightCm = ui.settingsCanonical.heightCm;
      } else {
        heightCm = round(centimeters, 1);
      }
    }

    let goalWeightKg = null;
    if (dom.goalWeightInput.value.trim() !== "") {
      const displayGoal = Number(dom.goalWeightInput.value);
      const kg = unit === "imperial" ? displayGoal / LB_PER_KG : displayGoal;
      if (!Number.isFinite(kg) || kg < 10 || kg > 500) {
        setFieldError(
          dom.goalWeightError,
          dom.goalWeightInput,
          `Use a target between ${formatNumber(unit === "imperial" ? 10 * LB_PER_KG : 10, 0)} and ${formatNumber(unit === "imperial" ? 500 * LB_PER_KG : 500, 0)} ${unit === "imperial" ? "lb" : "kg"}.`,
        );
        valid = false;
        firstInvalid = firstInvalid || dom.goalWeightInput;
      } else if (
        ui.settingsCanonical.goalWeightKg !== null &&
        inputMatchesCanonical(
          dom.goalWeightInput,
          toDisplayWeightForUnit(ui.settingsCanonical.goalWeightKg, unit),
        )
      ) {
        goalWeightKg = ui.settingsCanonical.goalWeightKg;
      } else {
        goalWeightKg = round(kg, 3);
      }
    }

    let goalBodyFatPct = null;
    if (dom.goalBodyFatInput.value.trim() !== "") {
      const bodyFat = Number(dom.goalBodyFatInput.value);
      if (!Number.isFinite(bodyFat) || bodyFat < 0 || bodyFat > 80) {
        setFieldError(dom.goalBodyFatError, dom.goalBodyFatInput, "Use a percentage between 0 and 80.");
        valid = false;
        firstInvalid = firstInvalid || dom.goalBodyFatInput;
      } else {
        goalBodyFatPct = round(bodyFat, 1);
      }
    }

    if (goalWeightKg === null && (goalBodyFatPct !== null || dom.goalDateInput.value)) {
      setFieldError(
        dom.goalWeightError,
        dom.goalWeightInput,
        "Enter a target weight to set goal details.",
      );
      valid = false;
      firstInvalid = firstInvalid || dom.goalWeightInput;
    }

    if (!valid) {
      firstInvalid?.focus();
      return;
    }

    state.unitSystem = unit;
    state.profile.heightCm = heightCm;
    state.profile.reference = ["male", "female"].includes(dom.referenceInput.value)
      ? dom.referenceInput.value
      : "general";
    state.goal = goalWeightKg === null
      ? { weightKg: null, bodyFatPct: null, date: null }
      : {
          weightKg: goalWeightKg,
          bodyFatPct: goalBodyFatPct,
          date: dom.goalDateInput.value || null,
        };

    if (!saveState()) return;
    dom.settingsDialog.close();
    render();
    showToast("Profile and goals updated.");
  }

  function requestDeleteEntry(entryId) {
    const entry = state.entries.find((candidate) => candidate.id === entryId);
    if (!entry) return;
    if (dom.entryDialog.open) dom.entryDialog.close();
    ui.pendingConfirm = () => {
      state.entries = state.entries.filter((candidate) => candidate.id !== entryId);
      saveState();
      render();
      showToast("Weigh-in deleted.");
    };
    dom.confirmTitle.textContent = "Delete this weigh-in?";
    dom.confirmCopy.textContent = `The entry from ${formatRelativeDate(new Date(entry.at))} will be removed and your trends recalculated.`;
    dom.confirmButton.textContent = "Delete";
    dom.confirmDialog.showModal();
  }

  function requestResetData() {
    if (dom.settingsDialog.open) dom.settingsDialog.close();
    ui.pendingConfirm = () => {
      state = createDefaultState();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        saveState();
      }
      render();
      showToast("All local data erased.");
    };
    dom.confirmTitle.textContent = "Erase all data?";
    dom.confirmCopy.textContent =
      "Every weigh-in, goal, and profile detail will be permanently removed from this browser. Export a CSV first if you want a backup.";
    dom.confirmButton.textContent = "Erase everything";
    dom.confirmDialog.showModal();
  }

  function handleConfirmSubmit(event) {
    event.preventDefault();
    const action = ui.pendingConfirm;
    ui.pendingConfirm = null;
    dom.confirmDialog.close();
    if (action) action();
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast${type === "error" ? " is-error" : ""}`;
    const iconWrap = document.createElement("span");
    iconWrap.className = "toast-icon";
    iconWrap.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${type === "error" ? "info" : "check"}"/></svg>`;
    const copy = document.createElement("span");
    copy.textContent = message;
    toast.append(iconWrap, copy);
    dom.toastRegion.append(toast);
    window.setTimeout(() => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 190);
    }, 3900);
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

  function exportCsv() {
    if (!state.entries.length) {
      showToast("There are no weigh-ins to export yet.", "error");
      return;
    }
    const rows = [...state.entries].sort((a, b) => new Date(a.at) - new Date(b.at));
    const lines = [["date", "weight_kg", "body_fat_pct", "note"].join(",")];
    rows.forEach((entry) => {
      lines.push(
        [
          csvEscape(entry.at),
          numberForCsv(entry.weightKg, 3),
          entry.bodyFatPct !== null ? numberForCsv(entry.bodyFatPct, 2) : "",
          csvEscape(entry.note || ""),
        ].join(","),
      );
    });
    const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `weighline-${localDateStamp()}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Exported ${pluralize(rows.length, "weigh-in")} to CSV.`);
  }

  function numberForCsv(value, digits) {
    return String(round(value, digits));
  }

  function detectDelimiter(text) {
    const sample = text.split(/\r?\n/).find((line) => line.trim()) || "";
    let inQuotes = false;
    const counts = { ",": 0, ";": 0, "\t": 0 };
    for (const character of sample) {
      if (character === '"') inQuotes = !inQuotes;
      if (!inQuotes && character in counts) counts[character] += 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  function parseCsv(text, delimiter) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    for (let i = 0; i < normalized.length; i += 1) {
      const character = normalized[i];
      if (inQuotes) {
        if (character === '"') {
          if (normalized[i + 1] === '"') {
            field += '"';
            i += 1;
          } else {
            inQuotes = false;
          }
        } else {
          field += character;
        }
      } else if (character === '"') {
        inQuotes = true;
      } else if (character === delimiter) {
        row.push(field);
        field = "";
      } else if (character === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += character;
      }
    }
    row.push(field);
    rows.push(row);
    return rows.filter((candidate) => candidate.some((cell) => cell.trim() !== ""));
  }

  function normalizeHeader(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/^\uFEFF/, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function findHeaderIndex(headers, aliases) {
    return headers.findIndex((header) => aliases.includes(header));
  }

  function parseFlexibleNumber(value) {
    let text = String(value ?? "").trim().replace(/%/g, "").replace(/\s/g, "");
    if (!text) return null;
    if (text.includes(",") && !text.includes(".")) text = text.replace(",", ".");
    text = text.replace(/,/g, "");
    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function parseImportedDate(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const localDate = new Date(`${raw}T12:00:00`);
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }
    let date = new Date(raw);
    if (Number.isNaN(date.getTime()) && raw.includes(" ")) {
      date = new Date(raw.replace(" ", "T"));
    }
    if (Number.isNaN(date.getTime())) return null;
    return date;
  }

  async function handleFileImport(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseCsv(text, detectDelimiter(text));
      if (rows.length < 2) {
        showToast("That CSV doesn't contain any weigh-in rows.", "error");
        return;
      }

      const headers = rows[0].map(normalizeHeader);
      const dateIndex = findHeaderIndex(headers, [
        "date",
        "datetime",
        "timestamp",
        "time",
        "weighed_at",
        "date_time",
      ]);
      const kgIndex = findHeaderIndex(headers, [
        "weight_kg",
        "weightkg",
        "weight_kgs",
        "kg",
        "weight_in_kg",
        "mass_kg",
      ]);
      const lbIndex = findHeaderIndex(headers, [
        "weight_lb",
        "weightlbs",
        "weight_lbs",
        "lb",
        "lbs",
        "weight_in_lb",
        "weight_pounds",
      ]);
      const genericWeightIndex = findHeaderIndex(headers, ["weight", "mass", "body_weight"]);
      const bodyFatIndex = findHeaderIndex(headers, [
        "body_fat_pct",
        "bodyfat_pct",
        "bodyfat",
        "body_fat",
        "bf",
        "fat_pct",
        "fat_percentage",
        "body_fat_percentage",
        "fat",
      ]);
      const noteIndex = findHeaderIndex(headers, [
        "note",
        "notes",
        "comment",
        "comments",
        "description",
      ]);

      if (dateIndex === -1 || (kgIndex === -1 && lbIndex === -1 && genericWeightIndex === -1)) {
        showToast("CSV needs a date column and a weight column.", "error");
        return;
      }

      const existingTimes = new Set(
        state.entries.map((entry) => Math.floor(new Date(entry.at).getTime() / 1000)),
      );
      const imported = [];
      let invalid = 0;
      let duplicates = 0;

      rows.slice(1).forEach((row) => {
        const date = parseImportedDate(row[dateIndex]);
        let weight = kgIndex !== -1 ? parseFlexibleNumber(row[kgIndex]) : null;
        let weightKg = null;
        if (weight !== null) {
          weightKg = weight;
        } else {
          weight = lbIndex !== -1
            ? parseFlexibleNumber(row[lbIndex])
            : genericWeightIndex !== -1
              ? parseFlexibleNumber(row[genericWeightIndex])
              : null;
          if (weight !== null) {
            weightKg = lbIndex !== -1 && kgIndex === -1
              ? weight / LB_PER_KG
              : unitSystem() === "imperial"
                ? weight / LB_PER_KG
                : weight;
          }
        }

        if (!date || weightKg === null || weightKg < 10 || weightKg > 500) {
          invalid += 1;
          return;
        }

        const secondKey = Math.floor(date.getTime() / 1000);
        if (existingTimes.has(secondKey)) {
          duplicates += 1;
          return;
        }
        existingTimes.add(secondKey);

        const bodyFat =
          bodyFatIndex !== -1 ? parseFlexibleNumber(row[bodyFatIndex]) : null;
        const safeBodyFat =
          bodyFat !== null && bodyFat >= 0 && bodyFat <= 80 ? round(bodyFat, 2) : null;
        const note = noteIndex !== -1 ? String(row[noteIndex] || "").trim().slice(0, 140) : "";

        imported.push({
          id: crypto.randomUUID ? crypto.randomUUID() : `import-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          at: date.toISOString(),
          weightKg: round(weightKg, 3),
          bodyFatPct: safeBodyFat,
          note,
        });
      });

      if (!imported.length) {
        const details = [];
        if (duplicates) details.push(pluralize(duplicates, "duplicate"));
        if (invalid) details.push(pluralize(invalid, "invalid row"));
        showToast(
          details.length ? `Nothing new to import (${details.join(", ")}).` : "No valid weigh-ins found in that CSV.",
          "error",
        );
        return;
      }

      state.entries.push(...imported);
      if (!saveState()) return;
      render();
      const details = [`Imported ${pluralize(imported.length, "weigh-in")}`];
      if (duplicates) details.push(`skipped ${pluralize(duplicates, "duplicate")}`);
      if (invalid) details.push(`${pluralize(invalid, "invalid row")} ignored`);
      showToast(`${details.join(" · ")}.`);
    } catch {
      showToast("That file couldn't be read. Make sure it's a valid CSV.", "error");
    }
  }

  function setTheme(theme, persist = false) {
    dom.html.dataset.theme = theme;
    dom.themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = theme === "dark" ? "#0b100e" : "#f2f4ed";
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch {
        showToast("Theme preference couldn't be saved.", "error");
      }
    }
  }

  function handleGlobalClick(event) {
    const logTrigger = event.target.closest("[data-log]");
    if (logTrigger) {
      openEntryDialog();
      return;
    }

    const settingsTrigger = event.target.closest("[data-open-settings]");
    if (settingsTrigger) {
      openSettings();
      return;
    }

    const goalTrigger = event.target.closest("[data-goal-detail]");
    if (goalTrigger) {
      openGoalDetail();
      return;
    }

    const insightTrigger = event.target.closest("[data-insight]");
    if (insightTrigger) {
      openInsight(insightTrigger.dataset.insight);
      return;
    }

    const closeTrigger = event.target.closest("[data-close]");
    if (closeTrigger) {
      closeTrigger.closest("dialog")?.close();
    }
  }

  function handleHistoryClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.dataset.id;
    if (button.dataset.action === "edit") {
      const entry = state.entries.find((candidate) => candidate.id === id);
      if (entry) openEntryDialog(entry);
    } else if (button.dataset.action === "delete") {
      requestDeleteEntry(id);
    }
  }

  function handleDialogBackdropClick(event) {
    if (event.target === event.currentTarget) {
      event.currentTarget.close();
    }
  }

  function initChartInteractions() {
    dom.chartStage.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      handleChartPointer(event);
    });
    dom.chartStage.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse") handleChartPointer(event);
    });
    dom.chartStage.addEventListener("pointerleave", hideChartTooltip);
  }

  function init() {
    setTheme(dom.html.dataset.theme || "dark", false);
    render();
    initChartInteractions();

    dom.themeToggle.addEventListener("click", () => {
      setTheme(dom.html.dataset.theme === "dark" ? "light" : "dark", true);
    });
    dom.openLogButton.addEventListener("click", () => openEntryDialog());
    dom.introLogButton.addEventListener("click", () => openEntryDialog());
    dom.openSettingsButton.addEventListener("click", openSettings);
    dom.introSetupButton.addEventListener("click", openSettings);
    dom.goalCard.addEventListener("click", (event) => {
      if (
        state.goal.weightKg !== null &&
        !event.target.closest("button, a")
      ) {
        openGoalDetail();
      }
    });
    dom.momentumAction.addEventListener("click", () => {
      if (state.goal.weightKg !== null) openGoalDetail();
      else if (state.entries.length === 0) openEntryDialog();
      else openSettings();
    });
    dom.insightSettingsButton.addEventListener("click", () => {
      dom.insightDialog.close();
      openSettings();
    });
    dom.goalEditButton.addEventListener("click", () => {
      dom.goalDetailDialog.close();
      openSettings();
    });
    dom.entryForm.addEventListener("submit", handleEntrySubmit);
    dom.settingsForm.addEventListener("submit", handleSettingsSubmit);
    dom.deleteEntryButton.addEventListener("click", () => {
      if (ui.editingId) requestDeleteEntry(ui.editingId);
    });
    dom.resetButton.addEventListener("click", requestResetData);
    dom.confirmForm.addEventListener("submit", handleConfirmSubmit);
    dom.exportButton.addEventListener("click", exportCsv);
    dom.importButton.addEventListener("click", () => dom.fileInput.click());
    dom.fileInput.addEventListener("change", handleFileImport);
    dom.historyList.addEventListener("click", handleHistoryClick);

    dom.settingsForm
      .querySelectorAll('input[name="unitSystem"]')
      .forEach((radio) => radio.addEventListener("change", handleSettingsUnitChange));

    document.addEventListener("click", handleGlobalClick);
    [
      dom.entryDialog,
      dom.settingsDialog,
      dom.confirmDialog,
      dom.insightDialog,
      dom.goalDetailDialog,
    ].forEach((dialog) => {
      dialog.addEventListener("click", handleDialogBackdropClick);
    });

    window.addEventListener("resize", () => {
      if (dom.insightDialog.open && ui.currentInsight) {
        window.requestAnimationFrame(() => renderInsightChart(ui.currentInsight));
      }
    });

    dom.confirmDialog.addEventListener("close", () => {
      ui.pendingConfirm = null;
    });

    document.querySelectorAll(".segment[data-metric]").forEach((button) => {
      button.addEventListener("click", () => {
        ui.chartMetric = button.dataset.metric;
        document.querySelectorAll(".segment[data-metric]").forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        renderChart();
      });
    });

    document.querySelectorAll(".segment[data-range]").forEach((button) => {
      button.addEventListener("click", () => {
        ui.chartRange = button.dataset.range;
        document.querySelectorAll(".segment[data-range]").forEach((candidate) => {
          const active = candidate === button;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        renderChart();
      });
    });

    const chartResizeObserver = new ResizeObserver(() => {
      if (dom.chartStage.clientWidth > 0 && dom.chartSvg.hidden === false) {
        window.requestAnimationFrame(renderChart);
      }
    });
    chartResizeObserver.observe(dom.chartStage);

    window.addEventListener("storage", (event) => {
      if (event.key === THEME_KEY && event.newValue) {
        setTheme(event.newValue === "dark" ? "dark" : "light", false);
      }
      if (event.key === STORAGE_KEY) {
        state = loadState();
        render();
        showToast("Weighline was updated in another tab.");
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateTodayLabel();
    });
  }

  init();
})();
