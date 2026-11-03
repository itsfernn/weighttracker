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
    openSettingsButton: document.getElementById("openSettingsButton"),
    introLogButton: document.getElementById("introLogButton"),
    weeklyDate: document.getElementById("weeklyDate"),
    weeklyAverage: document.getElementById("weeklyAverage"),
    weeklyAverageUnit: document.getElementById("weeklyAverageUnit"),
    weeklyDelta: document.getElementById("weeklyDelta"),
    weeklyBodyFatValue: document.getElementById("weeklyBodyFatValue"),
    weeklyBodyFatNote: document.getElementById("weeklyBodyFatNote"),
    goalDate: document.getElementById("goalDate"),
    goalValue: document.getElementById("goalValue"),
    goalUnit: document.getElementById("goalUnit"),
    goalProgressWrap: document.getElementById("goalProgressWrap"),
    goalProgressBar: document.getElementById("goalProgressBar"),
    goalProgressLabel: document.getElementById("goalProgressLabel"),
    goalFoot: document.getElementById("goalFoot"),
    goalDivider: document.getElementById("goalDivider"),
    goalBodyFatRow: document.getElementById("goalBodyFatRow"),
    goalBodyFatValue: document.getElementById("goalBodyFatValue"),
    goalBodyFatNote: document.getElementById("goalBodyFatNote"),
    chartSubtitle: document.getElementById("chartSubtitle"),
    chartStage: document.getElementById("chartStage"),
    chartSvg: document.getElementById("chartSvg"),
    chartTooltip: document.getElementById("chartTooltip"),
    chartEmpty: document.getElementById("chartEmpty"),
    chartEmptyTitle: document.getElementById("chartEmptyTitle"),
    chartEmptyCopy: document.getElementById("chartEmptyCopy"),
    chartInsight: document.getElementById("chartInsight"),
    goalLegend: document.getElementById("goalLegend"),
    compositionSubtitle: document.getElementById("compositionSubtitle"),
    bmiValue: document.getElementById("bmiValue"),
    metricBodyFatValue: document.getElementById("metricBodyFatValue"),
    bmiTag: document.getElementById("bmiTag"),
    bmiScale: document.getElementById("bmiScale"),
    bodyFatTag: document.getElementById("bodyFatTag"),
    bodyFatScale: document.getElementById("bodyFatScale"),
    ffmiValue: document.getElementById("ffmiValue"),
    ffmiLabel: document.getElementById("ffmiLabel"),
    ffmiTag: document.getElementById("ffmiTag"),
    ffmiScale: document.getElementById("ffmiScale"),
    historyHeading: document.getElementById("historyHeading"),
    historySubtitle: document.getElementById("historySubtitle"),
    historyList: document.getElementById("historyList"),
    historyEmpty: document.getElementById("historyEmpty"),
    historyFooter: document.getElementById("historyFooter"),
    historyCount: document.getElementById("historyCount"),
    openFullLogButton: document.getElementById("openFullLogButton"),
    logDialog: document.getElementById("logDialog"),
    fullLogSubtitle: document.getElementById("fullLogSubtitle"),
    fullLogScroll: document.getElementById("fullLogScroll"),
    fullLogList: document.getElementById("fullLogList"),
    fullLogEmpty: document.getElementById("fullLogEmpty"),
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
    referenceSexInput: document.getElementById("referenceSexInput"),
    goalWeightInput: document.getElementById("goalWeightInput"),
    goalWeightUnit: document.getElementById("goalWeightUnit"),
    goalWeightError: document.getElementById("goalWeightError"),
    goalBodyFatInput: document.getElementById("goalBodyFatInput"),
    goalBodyFatError: document.getElementById("goalBodyFatError"),
    goalDateInput: document.getElementById("goalDateInput"),
    resetButton: document.getElementById("resetButton"),
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
    pendingConfirm: null,
  };

  function createDefaultState() {
    return {
      version: 1,
      unitSystem: "metric",
      profile: { heightCm: null, referenceSex: null, ffmiMode: "standard" },
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
    base.profile.referenceSex = ["male", "female"].includes(input.profile?.referenceSex)
      ? input.profile.referenceSex
      : null;
    base.profile.ffmiMode = input.profile?.ffmiMode === "adjusted" ? "adjusted" : "standard";

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
      const value =
        metric === "weight"
          ? entry.weightKg
          : metric === "leanMass"
            ? entry.bodyFatPct !== null
              ? entry.weightKg * (1 - entry.bodyFatPct / 100)
              : null
            : entry.bodyFatPct;
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
      ffmi !== null && heightM ? ffmi + 6.3 * (1.8 - heightM) : null;

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

  function getBmiContext(value) {
    const bands = [
      {
        min: 15,
        max: 18.5,
        label: "Underweight",
        tone: "cool",
        description: "Below 18.5 — underweight range.",
      },
      {
        min: 18.5,
        max: 25,
        label: "Healthy weight",
        tone: "good",
        description: "18.5–24.9 — healthy weight range.",
      },
      {
        min: 25,
        max: 30,
        label: "Overweight",
        tone: "warm",
        description: "25–29.9 — overweight range.",
      },
      {
        min: 30,
        max: 35,
        label: "Class 1 obesity",
        tone: "warm",
        description: "30–34.9 — class 1 obesity range.",
      },
      {
        min: 35,
        max: 40,
        label: "Class 2 obesity",
        tone: "hot",
        description: "35–39.9 — class 2 obesity range.",
      },
      {
        min: 40,
        max: 45,
        label: "Class 3 obesity",
        tone: "hot",
        description: "40+ — class 3 obesity range.",
      },
    ];
    const band =
      bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < bands[0].min ? bands[0] : bands.at(-1));
    return { ...band, min: 15, max: 45, bands };
  }

  function getBodyFatContext(value, sex) {
    if (!sex) return null;
    const bands = sex === "female"
      ? [
          { min: 0, max: 14, label: "Very lean", tone: "cool", description: "Very lean range for women." },
          { min: 14, max: 21, label: "Athletic", tone: "good", description: "Athletic range for women." },
          { min: 21, max: 25, label: "Fitness", tone: "good", description: "Fitness range for women." },
          { min: 25, max: 32, label: "Average", tone: "neutral", description: "Average range for women." },
          { min: 32, max: 50, label: "Above average", tone: "warm", description: "Above the typical range for women." },
        ]
      : [
          { min: 0, max: 6, label: "Very lean", tone: "cool", description: "Very lean range for men." },
          { min: 6, max: 14, label: "Athletic", tone: "good", description: "Athletic range for men." },
          { min: 14, max: 18, label: "Fitness", tone: "good", description: "Fitness range for men." },
          { min: 18, max: 25, label: "Average", tone: "neutral", description: "Average range for men." },
          { min: 25, max: 50, label: "Above average", tone: "warm", description: "Above the typical range for men." },
        ];
    const band =
      bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < bands[0].min ? bands[0] : bands.at(-1));
    return { ...band, min: 0, max: 50, bands };
  }

  function getFfmiContext(value, sex) {
    if (!sex) return null;
    const bands = sex === "female"
      ? [
          { min: 12, max: 15, label: "Below average", tone: "cool", description: "Little resistance training history." },
          { min: 15, max: 17, label: "Average", tone: "neutral", description: "Typical untrained adult." },
          { min: 17, max: 19, label: "Above average", tone: "good", description: "Regular lifter, roughly 1–2 years in." },
          { min: 19, max: 21, label: "Excellent", tone: "good", description: "Dedicated multi-year training." },
          { min: 21, max: 23, label: "Superior", tone: "good", description: "Advanced; near most people's genetic ceiling." },
          { min: 23, max: 27, label: "Exceptional", tone: "warm", description: "Elite female muscularity." },
        ]
      : [
          { min: 14, max: 18, label: "Below average", tone: "cool", description: "Little resistance training history." },
          { min: 18, max: 20, label: "Average", tone: "neutral", description: "Typical untrained adult." },
          { min: 20, max: 22, label: "Above average", tone: "good", description: "Regular lifter, roughly 1–2 years in." },
          { min: 22, max: 23, label: "Excellent", tone: "good", description: "Dedicated multi-year training." },
          { min: 23, max: 26, label: "Superior", tone: "good", description: "Advanced; near most people's genetic ceiling." },
          { min: 26, max: 28, label: "Exceptional", tone: "warm", description: "Rare naturally; PED use becomes a relevant possibility." },
          { min: 28, max: 32, label: "Very exceptional", tone: "hot", description: "Almost never seen naturally in research." },
        ];
    const band =
      bands.find((candidate) => value >= candidate.min && value < candidate.max) ||
      (value < bands[0].min ? bands[0] : bands.at(-1));
    return { ...band, min: bands[0].min, max: bands.at(-1).max, bands };
  }

  function setMetricTag(element, context) {
    if (!element) return;
    if (!context) {
      element.hidden = true;
      return;
    }
    element.hidden = false;
    element.textContent = context.label;
    element.className = `metric-tag is-${context.tone}`;
  }



  function renderMetricScale(element, context, value) {
    if (!element) return;
    if (!context) {
      element.hidden = true;
      element.innerHTML = "";
      return;
    }
    const width = context.max - context.min;
    const marker = clamp(((value - context.min) / width) * 100, 0, 100);
    element.hidden = false;
    element.setAttribute(
      "aria-label",
      `${context.label}: ${formatNumber(value, 1)} on a ${formatNumber(context.min, 0)}–${formatNumber(context.max, 0)} scale`,
    );
    element.innerHTML = `<div class="metric-scale-track"><div class="metric-scale-bands">${context.bands
      .map((band) => {
        const segmentWidth = ((band.max - band.min) / width) * 100;
        return `<span class="metric-scale-band is-${band.tone}" style="width:${segmentWidth.toFixed(2)}%" title="${escapeHtml(`${band.label}: ${formatNumber(band.min, 1)}–${formatNumber(band.max, 1)}`)}"></span>`;
      })
      .join("")}</div><span class="metric-scale-marker" style="left:${marker.toFixed(2)}%"></span></div>`;
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
    const metrics = calculateMetrics();
    const latest = getLatestEntry();
    const weeklyGroups = groupEntriesByWeek(state.entries, "weight");
    const latestWeek = weeklyGroups.length ? weeklyGroups[weeklyGroups.length - 1] : null;
    const previousWeek = weeklyGroups.length > 1 ? weeklyGroups[weeklyGroups.length - 2] : null;
    const weeklyBodyFatGroups = groupEntriesByWeek(state.entries, "bodyFat");
    const latestBodyFatWeek = weeklyBodyFatGroups.length
      ? weeklyBodyFatGroups[weeklyBodyFatGroups.length - 1]
      : null;
    dom.weeklyAverageUnit.textContent = unit;
    dom.goalUnit.textContent = unit;

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

    if (latestBodyFatWeek) {
      dom.weeklyBodyFatValue.textContent = formatNumber(latestBodyFatWeek.avg, 1);
      dom.weeklyBodyFatNote.textContent = `${formatWeekRange(latestBodyFatWeek.weekStart)} · ${pluralize(latestBodyFatWeek.entries.length, "reading")}`;
    } else {
      dom.weeklyBodyFatValue.textContent = "—";
      dom.weeklyBodyFatNote.textContent = "No body fat readings";
    }

    if (state.goal.weightKg !== null) {
      const targetWeight = state.goal.weightKg;
      const targetBodyFat = state.goal.bodyFatPct;
      dom.goalValue.textContent = formatNumber(toDisplayWeight(targetWeight), 1);
      dom.goalDate.textContent = state.goal.date ? formatGoalDate(state.goal.date) : "No deadline";
      dom.goalDivider.hidden = false;
      dom.goalBodyFatRow.hidden = false;

      if (targetBodyFat !== null) {
        dom.goalBodyFatValue.textContent = formatNumber(targetBodyFat, 1);
      } else {
        dom.goalBodyFatValue.textContent = "—";
      }

      if (metrics.leanMassKg !== null && targetWeight > metrics.leanMassKg) {
        const expectedBodyFat = (1 - metrics.leanMassKg / targetWeight) * 100;
        dom.goalBodyFatNote.textContent = `At target: ~${formatNumber(expectedBodyFat, 1)}%`;
      } else if (metrics.leanMassKg !== null) {
        dom.goalBodyFatNote.textContent = "Below current lean mass";
      } else {
        dom.goalBodyFatNote.textContent = "Add body fat for an estimate";
      }

      if (latest) {
        const start = state.entries[0];
        const goal = getGoalProgress(latest.weightKg, start.weightKg, targetWeight);
        const progressPercent = Math.round(goal.progress * 100);
        dom.goalProgressWrap.hidden = false;
        dom.goalProgressBar.style.width = `${progressPercent}%`;
        dom.goalProgressLabel.textContent = `${progressPercent}%`;

        if (goal.reached) {
          dom.goalProgressLabel.textContent = "100%";
          dom.goalFoot.textContent = "Goal reached. Nicely done.";
        } else {
          const remaining = Math.abs(latest.weightKg - targetWeight);
          let copy = `${formatNumber(toDisplayWeight(remaining), 1)} ${unit} to go`;
          if (state.goal.date) {
            const targetDate = parseDateOnly(state.goal.date);
            const daysLeft = targetDate
              ? Math.ceil((targetDate.getTime() - new Date().getTime()) / DAY_MS)
              : null;
            if (daysLeft !== null && daysLeft > 0) {
              const weeksLeft = daysLeft / 7;
              const pace = toDisplayWeight(remaining) / weeksLeft;
              copy += ` · ${formatNumber(pace, 1)} ${unit}/wk needed`;
            } else if (daysLeft !== null) {
              copy += " · target date passed";
            }
          }
          dom.goalFoot.textContent = copy;
        }
      } else {
        dom.goalProgressWrap.hidden = true;
        dom.goalFoot.textContent = "Log a weigh-in to start tracking progress.";
      }
    } else {
      dom.goalValue.textContent = "—";
      dom.goalDate.textContent = "Not set";
      dom.goalProgressWrap.hidden = true;
      dom.goalDivider.hidden = true;
      dom.goalBodyFatRow.hidden = true;
      dom.goalFoot.textContent = "Set a target weight in settings.";
    }
  }

  function renderComposition() {
    const metrics = calculateMetrics();
    const unit = weightUnit();
    const sex = state.profile.referenceSex;

    dom.compositionSubtitle.textContent = state.profile.heightCm
      ? "Ranges are general fitness references, not medical advice."
      : "Add your height to unlock BMI, lean mass, and FFMI.";

    if (metrics.bmi !== null) {
      const context = getBmiContext(metrics.bmi);
      dom.bmiValue.textContent = formatNumber(metrics.bmi, 1);
      setMetricTag(dom.bmiTag, context);
      renderMetricScale(dom.bmiScale, context, metrics.bmi);
    } else {
      dom.bmiValue.textContent = "—";
      setMetricTag(dom.bmiTag, null);
      renderMetricScale(dom.bmiScale, null);
    }

    if (metrics.bodyFatPct !== null) {
      dom.metricBodyFatValue.textContent = formatNumber(metrics.bodyFatPct, 1);
      if (sex) {
        const context = getBodyFatContext(metrics.bodyFatPct, sex);
        setMetricTag(dom.bodyFatTag, context);
        renderMetricScale(dom.bodyFatScale, context, metrics.bodyFatPct);
      } else {
        setMetricTag(dom.bodyFatTag, { label: "Set sex", tone: "neutral" });
        renderMetricScale(dom.bodyFatScale, null);
      }
    } else {
      dom.metricBodyFatValue.textContent = "—";
      setMetricTag(dom.bodyFatTag, null);
      renderMetricScale(dom.bodyFatScale, null);
    }

    const adjustedFfmi = state.profile.ffmiMode === "adjusted";
    const ffmiDisplayValue = adjustedFfmi ? metrics.normalizedFfmi : metrics.ffmi;
    dom.ffmiLabel.textContent = adjustedFfmi ? "Adjusted FFMI" : "FFMI";

    if (ffmiDisplayValue !== null) {
      dom.ffmiValue.textContent = formatNumber(ffmiDisplayValue, 1);
      if (sex) {
        const context = getFfmiContext(ffmiDisplayValue, sex);
        setMetricTag(dom.ffmiTag, context);
        renderMetricScale(dom.ffmiScale, context, ffmiDisplayValue);
      } else {
        setMetricTag(dom.ffmiTag, { label: "Set sex", tone: "neutral" });
        renderMetricScale(dom.ffmiScale, null);
      }
    } else {
      dom.ffmiValue.textContent = "—";
      setMetricTag(dom.ffmiTag, null);
      renderMetricScale(dom.ffmiScale, null);
    }
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
    if (ui.chartMetric === "leanMass") {
      return {
        key: "leanMass",
        label: "lean mass",
        unit: weightUnit(),
        axisUnit: weightUnit(),
        value: (entry) =>
          entry.bodyFatPct !== null
            ? entry.weightKg * (1 - entry.bodyFatPct / 100)
            : null,
        display: (value) => toDisplayWeight(value),
        goal: null,
        format: (value) => `${formatNumber(value, 1)} ${weightUnit()}`,
        defaultPadding: unitSystem() === "imperial" ? 2 : 1,
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
      (entry) => config.value(entry) !== null && config.value(entry) !== undefined,
    );

    dom.chartSubtitle.textContent = `Weekly ${config.label} averages${config.unit ? ` in ${config.unit}` : ""} · ${rangeLabel(ui.chartRange)}.`;

    if (!metricEntries.length) {
      if (ui.chartMetric === "bodyFat") {
        showChartEmpty(
          "No body fat readings yet",
          "Add a body fat percentage to a weigh-in and its weekly average will appear here.",
        );
      } else if (ui.chartMetric === "leanMass") {
        showChartEmpty(
          "No lean mass readings yet",
          "Add a body fat percentage to a weigh-in to start the lean mass trend.",
        );
      } else {
        showChartEmpty(
          "Your trend starts here",
          "Log a few weigh-ins and your weekly averages will take shape.",
        );
      }
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

    dom.chartStage.__chartModel = {
      points: weeklyPoints,
      plot,
      width,
      height,
      config,
      showGoal,
    };

    if (weeklyGroups.length > 1) {
      const latest = weeklyGroups.at(-1);
      const previous = weeklyGroups.at(-2);
      const delta = config.display(latest.avg) - config.display(previous.avg);
      const formattedDelta = formatNumber(Math.abs(delta), 1);
      if (Math.abs(delta) < 0.05) {
        dom.chartInsight.innerHTML = "Your weekly averages are holding steady.";
      } else {
        const direction = delta > 0 ? "higher" : "lower";
        const unit = config.key === "bodyFat" ? "pts" : config.unit;
        dom.chartInsight.innerHTML = `Latest weekly average is <strong>${formattedDelta} ${unit} ${direction}</strong> than the week before.`;
      }
    } else {
      dom.chartInsight.textContent =
        "One week logged. Keep checking in to build a clearer trend.";
    }
  }

  function showChartEmpty(title, copy) {
    dom.chartSvg.hidden = true;
    dom.chartEmpty.hidden = false;
    dom.chartTooltip.classList.remove("is-visible");
    dom.goalLegend.classList.add("is-hidden");
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

  const HISTORY_LIMIT = 5;

  function buildHistoryRowsHtml(sorted) {
    const unit = weightUnit();
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
    return `${`<div class="history-columns" role="row" aria-hidden="true"><span>Date</span><span>Weight</span><span>Body fat</span><span>Lean mass</span><span></span></div>`}${rows.join("")}`;
  }

  function renderHistory() {
    const sorted = [...state.entries].sort((a, b) => new Date(b.at) - new Date(a.at));
    const visible = sorted.slice(0, HISTORY_LIMIT);

    dom.historySubtitle.textContent = sorted.length
      ? sorted.length > HISTORY_LIMIT
        ? `Latest ${HISTORY_LIMIT} of ${pluralize(sorted.length, "weigh-in")}.`
        : `${pluralize(sorted.length, "weigh-in")} saved locally.`
      : "Every entry, saved locally.";
    dom.historyEmpty.hidden = sorted.length > 0;
    dom.historyFooter.hidden = sorted.length === 0;
    dom.historyCount.textContent =
      sorted.length > HISTORY_LIMIT
        ? `Showing ${HISTORY_LIMIT} of ${pluralize(sorted.length, "entry", "entries")}`
        : pluralize(sorted.length, "entry", "entries");
    dom.openFullLogButton.hidden = sorted.length <= HISTORY_LIMIT;
    dom.historyList.innerHTML = visible.length
      ? buildHistoryRowsHtml(visible)
      : "";
  }

  function renderFullLog() {
    const sorted = [...state.entries].sort((a, b) => new Date(b.at) - new Date(a.at));
    dom.fullLogSubtitle.textContent = sorted.length
      ? `${pluralize(sorted.length, "weigh-in")} · newest first.`
      : "Newest first.";
    dom.fullLogEmpty.hidden = sorted.length > 0;
    dom.fullLogList.innerHTML = sorted.length ? buildHistoryRowsHtml(sorted) : "";
  }

  function openFullLog() {
    renderFullLog();
    dom.fullLogScroll.scrollTop = 0;
    dom.logDialog.showModal();
  }

  function render() {
    sortEntries();
    updateTodayLabel();
    renderSummary();
    renderComposition();
    renderChart();
    renderHistory();
    if (dom.logDialog.open) renderFullLog();
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
    dom.referenceSexInput.value = state.profile.referenceSex || "";
    const ffmiMode = state.profile.ffmiMode === "adjusted" ? "adjusted" : "standard";
    const ffmiRadio = dom.settingsForm.querySelector(
      `input[name="ffmiMode"][value="${ffmiMode}"]`,
    );
    if (ffmiRadio) ffmiRadio.checked = true;
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
    state.profile.referenceSex = ["male", "female"].includes(dom.referenceSexInput.value)
      ? dom.referenceSexInput.value
      : null;
    state.profile.ffmiMode =
      dom.settingsForm.querySelector('input[name="ffmiMode"]:checked')?.value === "adjusted"
        ? "adjusted"
        : "standard";
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
    dom.introLogButton.addEventListener("click", () => openEntryDialog());
    dom.openSettingsButton.addEventListener("click", openSettings);
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
    dom.fullLogList.addEventListener("click", handleHistoryClick);
    dom.openFullLogButton.addEventListener("click", openFullLog);

    dom.settingsForm
      .querySelectorAll('input[name="unitSystem"]')
      .forEach((radio) => radio.addEventListener("change", handleSettingsUnitChange));

    document.addEventListener("click", handleGlobalClick);
    [dom.entryDialog, dom.settingsDialog, dom.confirmDialog, dom.logDialog].forEach((dialog) => {
      dialog.addEventListener("click", handleDialogBackdropClick);
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

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
