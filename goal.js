(() => {
  "use strict";

  const STORAGE_KEY = "weighline:data";
  const THEME_KEY = "weighline:theme";
  const DAY_MS = 86400000;
  const LB_PER_KG = 2.2046226218487757;

  const dom = {
    html: document.documentElement,
    themeToggle: document.getElementById("themeToggle"),
    empty: document.getElementById("plannerEmpty"),
    content: document.getElementById("plannerContent"),
    target: document.getElementById("plannerTarget"),
    targetUnit: document.getElementById("plannerTargetUnit"),
    targetMeta: document.getElementById("plannerTargetMeta"),
    paceFlare: document.getElementById("plannerPaceFlare"),
    progressBar: document.getElementById("plannerProgressBar"),
    progressPercent: document.getElementById("plannerProgressPercent"),
    progressMeta: document.getElementById("plannerProgressMeta"),
    start: document.getElementById("plannerStart"),
    startMeta: document.getElementById("plannerStartMeta"),
    current: document.getElementById("plannerCurrent"),
    currentMeta: document.getElementById("plannerCurrentMeta"),
    remaining: document.getElementById("plannerRemaining"),
    remainingMeta: document.getElementById("plannerRemainingMeta"),
    deadline: document.getElementById("plannerDeadline"),
    deadlineMeta: document.getElementById("plannerDeadlineMeta"),
    bmiValue: document.getElementById("plannerBmiValue"),
    bmiNote: document.getElementById("plannerBmiNote"),
    bfValue: document.getElementById("plannerBfValue"),
    bfNote: document.getElementById("plannerBfNote"),
    lbmValue: document.getElementById("plannerLbmValue"),
    lbmNote: document.getElementById("plannerLbmNote"),
    ffmiValue: document.getElementById("plannerFfmiValue"),
    ffmiNote: document.getElementById("plannerFfmiNote"),
    projectionNote: document.getElementById("plannerProjectionNote"),
    scenarioRate: document.getElementById("scenarioRate"),
    scenarioRateUnit: document.getElementById("scenarioRateUnit"),
    scenarioPaceFlare: document.getElementById("scenarioPaceFlare"),
    scenarioWeightLabel: document.getElementById("scenarioWeightLabel"),
    scenarioWeight: document.getElementById("scenarioWeight"),
    scenarioBf: document.getElementById("scenarioBf"),
    scenarioEta: document.getElementById("scenarioEta"),
    scenarioEtaMeta: document.getElementById("scenarioEtaMeta"),
    scenarioCopy: document.getElementById("scenarioCopy"),
    hints: document.getElementById("plannerHints"),
  };

  let state = loadState();
  let scenarioInitialized = false;

  function createEmptyState() {
    return {
      unitSystem: "metric",
      profile: { heightCm: null, referenceSex: null, ffmiMode: "standard" },
      entries: [],
      goal: { weightKg: null, bodyFatPct: null, startDate: null, date: null },
    };
  }

  function validDate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? value
      : null;
  }

  function normalizeState(input) {
    const base = createEmptyState();
    if (!input || typeof input !== "object") return base;

    base.unitSystem = input.unitSystem === "imperial" ? "imperial" : "metric";
    const height = Number(input.profile?.heightCm);
    base.profile.heightCm = Number.isFinite(height) && height > 0 ? height : null;
    base.profile.referenceSex = ["male", "female"].includes(input.profile?.referenceSex)
      ? input.profile.referenceSex
      : null;
    base.profile.ffmiMode = input.profile?.ffmiMode === "adjusted" ? "adjusted" : "standard";

    const entries = Array.isArray(input.entries) ? input.entries : [];
    base.entries = entries
      .map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const at = new Date(entry.at);
        const weightKg = Number(entry.weightKg);
        if (Number.isNaN(at.getTime()) || !Number.isFinite(weightKg) || weightKg <= 0) {
          return null;
        }
        const bodyFat = Number(entry.bodyFatPct);
        return {
          id: String(entry.id || `${at.getTime()}-${Math.random()}`),
          at: at.toISOString(),
          weightKg,
          bodyFatPct:
            Number.isFinite(bodyFat) && bodyFat >= 0 && bodyFat <= 80
              ? bodyFat
              : null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.at) - new Date(b.at));

    const goal = input.goal || {};
    const weight = Number(goal.weightKg);
    const bodyFat = Number(goal.bodyFatPct);
    base.goal = {
      weightKg: Number.isFinite(weight) && weight > 0 ? weight : null,
      bodyFatPct: Number.isFinite(bodyFat) && bodyFat >= 0 ? bodyFat : null,
      startDate: validDate(goal.startDate),
      date: validDate(goal.date),
    };
    if (base.goal.weightKg === null) {
      base.goal.bodyFatPct = null;
      base.goal.startDate = null;
      base.goal.date = null;
    }
    return base;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? normalizeState(JSON.parse(raw)) : createEmptyState();
    } catch {
      return createEmptyState();
    }
  }

  function weightUnit() {
    return state.unitSystem === "imperial" ? "lb" : "kg";
  }

  function heightUnit() {
    return state.unitSystem === "imperial" ? "in" : "cm";
  }

  function toDisplayWeight(kg) {
    return state.unitSystem === "imperial" ? kg * LB_PER_KG : kg;
  }

  function toKg(displayWeight) {
    return state.unitSystem === "imperial" ? displayWeight / LB_PER_KG : displayWeight;
  }

  function toDisplayHeight(cm) {
    return state.unitSystem === "imperial" ? cm / 2.54 : cm;
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
    return `${formatNumber(toDisplayWeight(kg), digits)} ${weightUnit()}`;
  }

  function formatDateShort(date) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
    }).format(date);
  }

  function formatDateFull(date) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
    }).format(date);
  }

  function formatWeekRange(start) {
    const end = new Date(start.getTime() + 6 * DAY_MS);
    const startMonth = new Intl.DateTimeFormat(undefined, { month: "short" }).format(start);
    const endMonth = new Intl.DateTimeFormat(undefined, { month: "short" }).format(end);
    const year = start.getFullYear() !== new Date().getFullYear() ? `, ${start.getFullYear()}` : "";
    return startMonth === endMonth
      ? `${startMonth} ${start.getDate()}–${end.getDate()}${year}`
      : `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}${year}`;
  }

  function parseDateOnly(value) {
    if (!value) return null;
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function startOfWeekMonday(date) {
    const copy = startOfDay(date);
    copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7));
    return copy;
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
          weekEnd: new Date(weekStart.getTime() + 6 * DAY_MS),
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
      .sort((a, b) => a.weekStart - b.weekStart);
  }

  function getWeeklySnapshot() {
    const weightWeeks = groupEntriesByWeek(state.entries, "weight");
    const bodyFatWeeks = groupEntriesByWeek(state.entries, "bodyFat");
    const weightWeek = weightWeeks.length ? weightWeeks.at(-1) : null;
    const bodyFatWeek = bodyFatWeeks.length ? bodyFatWeeks.at(-1) : null;
    const compositionWeightKg =
      bodyFatWeek && bodyFatWeek.entries.length
        ? bodyFatWeek.entries.reduce((sum, entry) => sum + entry.weightKg, 0) /
          bodyFatWeek.entries.length
        : null;
    return {
      weightWeeks,
      bodyFatWeeks,
      weightWeek,
      bodyFatWeek,
      weightAvgKg: weightWeek ? weightWeek.avg : null,
      bodyFatAvgPct: bodyFatWeek ? bodyFatWeek.avg : null,
      compositionWeightKg,
    };
  }

  function getGoalStartSnapshot(snapshot) {
    if (!snapshot.weightWeeks.length) {
      return { date: null, week: null, weightKg: null, usedNearest: false };
    }
    if (!state.goal.startDate) {
      const first = snapshot.weightWeeks[0];
      return { date: first.weekStart, week: first, weightKg: first.avg, usedNearest: false };
    }
    const selectedDate = parseDateOnly(state.goal.startDate);
    if (!selectedDate) {
      const first = snapshot.weightWeeks[0];
      return { date: first.weekStart, week: first, weightKg: first.avg, usedNearest: false };
    }
    let week = snapshot.weightWeeks.find(
      (candidate) => selectedDate >= candidate.weekStart && selectedDate <= candidate.weekEnd,
    );
    let usedNearest = false;
    if (!week) {
      let nearestDistance = Infinity;
      snapshot.weightWeeks.forEach((candidate) => {
        const distance = Math.min(
          Math.abs(selectedDate - candidate.weekStart),
          Math.abs(selectedDate - candidate.weekEnd),
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          week = candidate;
          usedNearest = true;
        }
      });
    }
    return {
      date: selectedDate,
      week,
      weightKg: week ? week.avg : null,
      usedNearest,
    };
  }

  function getCompositionMetrics(snapshot) {
    const heightCm = state.profile.heightCm;
    const heightM = heightCm ? heightCm / 100 : null;
    const bodyFatPct = snapshot.bodyFatAvgPct;
    const weightKg = snapshot.compositionWeightKg;
    const leanMassKg =
      weightKg !== null && bodyFatPct !== null
        ? weightKg * (1 - bodyFatPct / 100)
        : null;
    const fatMassKg =
      weightKg !== null && bodyFatPct !== null
        ? weightKg * (bodyFatPct / 100)
        : null;
    const bmi =
      snapshot.weightAvgKg !== null && heightM
        ? snapshot.weightAvgKg / (heightM * heightM)
        : null;
    const ffmi =
      leanMassKg !== null && heightM ? leanMassKg / (heightM * heightM) : null;
    const normalizedFfmi =
      ffmi !== null && heightM ? ffmi + 6.3 * (1.8 - heightM) : null;
    return {
      heightCm,
      heightM,
      bodyFatPct,
      weightKg,
      leanMassKg,
      fatMassKg,
      bmi,
      ffmi,
      normalizedFfmi,
    };
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
    if (reached) progress = 1;
    else if (Math.abs(startKg - goalKg) > 0.01) {
      progress = clamp((startKg - currentKg) / (startKg - goalKg), 0, 1);
    }
    return { progress, reached };
  }

  function getGoalPace(snapshot) {
    if (state.goal.weightKg === null || snapshot.weightAvgKg === null) return null;
    const targetDate = parseDateOnly(state.goal.date);
    if (!targetDate) return { kind: "no-deadline" };
    const daysLeft = Math.ceil(
      (targetDate.getTime() - startOfDay(new Date()).getTime()) / DAY_MS,
    );
    if (daysLeft <= 0) return { kind: "deadline-passed", targetDate };
    const weeksLeft = daysLeft / 7;
    const requiredKgPerWeek =
      (state.goal.weightKg - snapshot.weightAvgKg) / weeksLeft;
    return {
      kind: "pace",
      targetDate,
      daysLeft,
      weeksLeft,
      requiredKgPerWeek,
      category: window.WeighlinePace.classify(
        requiredKgPerWeek,
        snapshot.weightAvgKg,
      ),
    };
  }

  function setFlare(element, text, tone, description = "") {
    if (!element) return;
    element.hidden = !text;
    element.textContent = text || "";
    element.className = `pace-flare is-${tone}`;
    element.title = description;
  }

  function paceText(requiredKgPerWeek, category) {
    if (category.direction === "maintain") return "Maintain";
    const action = category.direction === "cut" ? "Cut" : "Gain";
    const display = Math.abs(toDisplayWeight(requiredKgPerWeek));
    return `${action} ${formatNumber(display, display < 0.1 ? 2 : 1)} ${weightUnit()}/wk · ${category.shortLabel}`;
  }

  function getShareRange(category, gain) {
    if (!category) {
      category = window.WeighlinePace.classify(
        gain ? 0.2 : -0.2,
        getWeeklySnapshot().weightAvgKg || 1,
      );
    }
    const key = category.key;
    const ranges = {
      "cut-gentle": [0.05, 0.15],
      "cut-steady": [0.15, 0.25],
      "cut-aggressive": [0.25, 0.35],
      "cut-extreme": [0.35, 0.5],
      "bulk-gentle": [0.65, 0.8],
      "bulk-lean": [0.55, 0.7],
      "bulk-moderate": [0.4, 0.55],
      "bulk-aggressive": [0.25, 0.4],
      maintain: [0, 0],
    };
    return ranges[key] || (gain ? [0.4, 0.55] : [0.15, 0.25]);
  }

  function projectComposition(metrics, targetWeightKg, category) {
    if (
      metrics.leanMassKg === null ||
      metrics.fatMassKg === null ||
      metrics.weightKg === null
    ) {
      return null;
    }
    const delta = targetWeightKg - metrics.weightKg;
    const gain = delta >= 0;
    const shares = getShareRange(category, gain);
    const results = shares
      .map((share) => {
        const lean = metrics.leanMassKg + delta * share;
        const fat = metrics.fatMassKg + delta * (1 - share);
        const weight = lean + fat;
        if (!Number.isFinite(weight) || weight <= 0 || lean <= 0 || fat < 0) {
          return null;
        }
        return { lean, fat, weight, bodyFat: (fat / weight) * 100 };
      })
      .filter(Boolean);
    if (!results.length) return null;
    return {
      bodyFatLow: Math.min(...results.map((result) => result.bodyFat)),
      bodyFatHigh: Math.max(...results.map((result) => result.bodyFat)),
      leanLow: Math.min(...results.map((result) => result.lean)),
      leanHigh: Math.max(...results.map((result) => result.lean)),
      shareRange: shares,
    };
  }

  function bmiLabel(bmi) {
    if (bmi < 18.5) return "Underweight range";
    if (bmi < 25) return "Healthy weight range";
    if (bmi < 30) return "Overweight range";
    if (bmi < 35) return "Class 1 obesity range";
    if (bmi < 40) return "Class 2 obesity range";
    return "Class 3 obesity range";
  }

  function renderSummary(snapshot, metrics) {
    const goal = state.goal;
    const unit = weightUnit();
    dom.target.textContent = formatNumber(toDisplayWeight(goal.weightKg), 1);
    dom.targetUnit.textContent = unit;
    const targetParts = [];
    if (goal.date) targetParts.push(`Target ${formatDateFull(parseDateOnly(goal.date))}`);
    if (goal.bodyFatPct !== null) targetParts.push(`${formatNumber(goal.bodyFatPct, 1)}% body fat`);
    dom.targetMeta.textContent = targetParts.length
      ? targetParts.join(" · ")
      : "No deadline or body-fat target";

    const start = getGoalStartSnapshot(snapshot);
    const pace = getGoalPace(snapshot);
    const current = snapshot.weightAvgKg;
    const canProgress = current !== null && start.weightKg !== null;
    const progress = canProgress
      ? getGoalProgress(current, start.weightKg, goal.weightKg)
      : { progress: 0, reached: false };
    const percent = Math.round(progress.progress * 100);
    dom.progressBar.style.width = `${percent}%`;
    dom.progressPercent.textContent = canProgress ? `${percent}%` : "—";
    dom.progressMeta.textContent = progress.reached
      ? "Target weight reached."
      : canProgress
        ? `${formatNumber(toDisplayWeight(Math.abs(goal.weightKg - current)), 1)} ${unit} remaining`
        : "Log a weigh-in to calculate progress.";

    if (progress.reached) {
      setFlare(dom.paceFlare, "Goal reached", "good");
    } else if (pace?.kind === "pace") {
      setFlare(
        dom.paceFlare,
        paceText(pace.requiredKgPerWeek, pace.category),
        pace.category.tone,
        pace.category.description,
      );
    } else if (pace?.kind === "deadline-passed") {
      setFlare(dom.paceFlare, "Deadline passed", "warm");
    } else {
      setFlare(
        dom.paceFlare,
        "No deadline",
        "neutral",
        "Set a target date to calculate a required weekly pace.",
      );
    }

    dom.start.textContent = start.weightKg !== null ? formatWeight(start.weightKg) : "—";
    dom.startMeta.textContent = start.date
      ? start.usedNearest
        ? `Nearest week: ${formatWeekRange(start.week.weekStart)}`
        : `Week of ${formatDateShort(start.week.weekStart)}`
      : "No weigh-ins yet";

    dom.current.textContent = current !== null ? formatWeight(current) : "—";
    dom.currentMeta.textContent =
      snapshot.bodyFatAvgPct !== null
        ? `${formatNumber(snapshot.bodyFatAvgPct, 1)}% body fat average`
        : "No body-fat reading";

    dom.remaining.textContent =
      current !== null ? formatWeight(Math.abs(goal.weightKg - current)) : "—";
    dom.remainingMeta.textContent =
      current !== null
        ? current > goal.weightKg
          ? "to lose"
          : current < goal.weightKg
            ? "to gain"
            : "at target"
        : "";

    const targetDate = parseDateOnly(goal.date);
    dom.deadline.textContent = targetDate ? formatDateFull(targetDate) : "No deadline";
    dom.deadlineMeta.textContent = targetDate
      ? pace?.daysLeft > 0
        ? `${pace.daysLeft} days left`
        : "Date has passed"
      : "Add a target date for pace guidance";
  }

  function renderProjections(snapshot, metrics) {
    const goal = state.goal;
    const targetBmi =
      metrics.heightM ? goal.weightKg / (metrics.heightM * metrics.heightM) : null;
    dom.bmiValue.textContent = targetBmi !== null ? formatNumber(targetBmi, 1) : "—";
    dom.bmiNote.textContent = targetBmi !== null ? bmiLabel(targetBmi) : "Add your height in settings";

    const pace = getGoalPace(snapshot);
    let category = pace?.kind === "pace" ? pace.category : null;
    const targetDirection = goal.weightKg >= (snapshot.compositionWeightKg ?? 0);
    if (!category) {
      category = window.WeighlinePace.classify(
        targetDirection ? 0.2 : -0.2,
        snapshot.weightAvgKg || 1,
      );
    }
    const projection = projectComposition(metrics, goal.weightKg, category);

    if (projection) {
      dom.bfValue.textContent = `${formatNumber(projection.bodyFatLow, 1)}–${formatNumber(projection.bodyFatHigh, 1)}%`;
      dom.lbmValue.textContent = `${formatNumber(toDisplayWeight(projection.leanLow), 1)}–${formatNumber(toDisplayWeight(projection.leanHigh), 1)} ${weightUnit()}`;
      const ffmiValues = metrics.heightM
        ? [projection.leanLow, projection.leanHigh].map((lean) => {
            const raw = lean / (metrics.heightM * metrics.heightM);
            return state.profile.ffmiMode === "adjusted"
              ? raw + 6.3 * (1.8 - metrics.heightM)
              : raw;
          })
        : [];
      dom.ffmiValue.textContent = ffmiValues.length
        ? `${formatNumber(Math.min(...ffmiValues), 1)}–${formatNumber(Math.max(...ffmiValues), 1)}`
        : "—";
      dom.ffmiNote.textContent = metrics.heightM
        ? state.profile.ffmiMode === "adjusted"
          ? "Adjusted to 1.80 m"
          : "Raw FFMI"
        : "Add your height in settings";

      if (goal.bodyFatPct !== null) {
        const targetInside =
          goal.bodyFatPct >= projection.bodyFatLow - 0.5 &&
          goal.bodyFatPct <= projection.bodyFatHigh + 0.5;
        dom.bfNote.textContent = targetInside
          ? `In line with your ${formatNumber(goal.bodyFatPct, 1)}% target`
          : `Your target is ${formatNumber(goal.bodyFatPct, 1)}%`;
      } else {
        dom.bfNote.textContent = "Estimated from rate-based fat and lean changes";
      }
      dom.lbmNote.textContent = "If lean mass changes according to the modeled pace";
      const gain = goal.weightKg >= metrics.weightKg;
      const lowShare = Math.round(projection.shareRange[0] * 100);
      const highShare = Math.round(projection.shareRange[1] * 100);
      dom.projectionNote.textContent = `Based on ${formatNumber(metrics.bodyFatPct, 1)}% body fat and ${formatWeight(metrics.leanMassKg)} lean mass. Assumes ${lowShare}–${highShare}% of ${gain ? "gain" : "loss"} is ${gain ? "lean mass" : "lean mass loss"}.`;
    } else {
      dom.bfValue.textContent = "—";
      dom.lbmValue.textContent = "—";
      dom.ffmiValue.textContent = "—";
      dom.bfNote.textContent = "Add body fat to a weigh-in for projections";
      dom.lbmNote.textContent = "Requires body fat";
      dom.ffmiNote.textContent = "Requires body fat and height";
      dom.projectionNote.textContent = "Log body fat and height to model body-composition changes.";
    }

    if (metrics.heightCm === null) {
      dom.bmiValue.textContent = "—";
      dom.bmiNote.textContent = "Add your height in settings";
      if (!projection) dom.ffmiValue.textContent = "—";
    }
  }

  function defaultScenarioRate(snapshot) {
    const pace = getGoalPace(snapshot);
    if (pace?.kind === "pace") return toDisplayWeight(pace.requiredKgPerWeek);
    if (snapshot.weightAvgKg !== null) {
      return toDisplayWeight(state.goal.weightKg >= snapshot.weightAvgKg ? 0.2 : -0.2);
    }
    return 0;
  }

  function renderScenario(snapshot, metrics) {
    const current = snapshot.weightAvgKg;
    if (current === null || !metrics.leanMassKg) {
      dom.scenarioRate.disabled = true;
      dom.scenarioPaceFlare.hidden = true;
      dom.scenarioWeight.textContent = "—";
      dom.scenarioBf.textContent = "—";
      dom.scenarioEta.textContent = "—";
      dom.scenarioEtaMeta.textContent = "";
      dom.scenarioCopy.textContent = "Log a weigh-in with body fat to use scenario planning.";
      return;
    }

    dom.scenarioRate.disabled = false;
    if (!scenarioInitialized) {
      dom.scenarioRate.value = String(round(defaultScenarioRate(snapshot), 2));
      scenarioInitialized = true;
    }
    dom.scenarioRateUnit.textContent = `${weightUnit()}/wk`;
    const rawRate = dom.scenarioRate.value.trim();
    const displayRate = rawRate === "" ? NaN : Number(rawRate);
    if (!Number.isFinite(displayRate)) {
      dom.scenarioPaceFlare.hidden = true;
      dom.scenarioWeight.textContent = "—";
      dom.scenarioBf.textContent = "—";
      dom.scenarioEta.textContent = "—";
      dom.scenarioCopy.textContent = "Enter a weekly change to model the outcome.";
      return;
    }

    const rateKg = toKg(displayRate);
    const category = window.WeighlinePace.classify(rateKg, current);
    setFlare(
      dom.scenarioPaceFlare,
      category.direction === "maintain"
        ? "Maintain"
        : `${category.direction === "cut" ? "Cut" : "Gain"} ${formatNumber(Math.abs(displayRate), Math.abs(displayRate) < 0.1 ? 2 : 1)} ${weightUnit()}/wk · ${category.shortLabel}`,
      category.tone,
      category.description,
    );

    const pace = getGoalPace(snapshot);
    const targetDate = parseDateOnly(state.goal.date);
    let outputWeight = null;
    let outputBf = null;
    let targetLabel = "At target date";
    let etaDate = null;

    if (targetDate && pace?.kind === "pace") {
      const weeks = Math.max(0, pace.daysLeft / 7);
      outputWeight = current + rateKg * weeks;
      targetLabel = `By ${formatDateShort(targetDate)}`;
    } else {
      outputWeight = state.goal.weightKg;
      targetLabel = "At goal weight";
    }

    const shareCategory =
      category.key === "maintain" ? null : category;
    const projection = outputWeight !== null
      ? projectComposition(metrics, outputWeight, shareCategory)
      : null;
    if (projection) {
      outputBf = `${formatNumber(projection.bodyFatLow, 1)}–${formatNumber(projection.bodyFatHigh, 1)}%`;
    }

    const goalDelta = state.goal.weightKg - current;
    const directionMatches =
      Math.abs(rateKg) >= 0.005 && Math.sign(goalDelta) === Math.sign(rateKg);
    if (directionMatches) {
      const weeks = Math.abs(goalDelta) / Math.abs(rateKg);
      etaDate = new Date(Date.now() + weeks * 7 * DAY_MS);
    }

    dom.scenarioWeightLabel.textContent = targetLabel;
    dom.scenarioWeight.textContent =
      outputWeight !== null ? formatWeight(outputWeight) : "—";
    dom.scenarioBf.textContent = outputBf
      ? `Estimated body fat ${outputBf}`
      : "Body-fat estimate unavailable";
    dom.scenarioEta.textContent = etaDate ? formatDateFull(etaDate) : "—";
    dom.scenarioEtaMeta.textContent = etaDate
      ? `${Math.ceil((etaDate - Date.now()) / DAY_MS)} days at this pace`
      : directionMatches
        ? "Already at goal"
        : "This pace does not move toward the goal";

    if (!directionMatches) {
      dom.scenarioCopy.textContent =
        "This weekly change moves away from your target weight. Reverse the sign or adjust the goal.";
    } else if (targetDate) {
      dom.scenarioCopy.textContent = `At ${formatNumber(Math.abs(displayRate), 1)} ${weightUnit()}/wk, you would weigh about ${formatWeight(outputWeight)} by your target date. ${outputBf ? `Estimated body fat: ${outputBf}.` : ""}`;
    } else {
      dom.scenarioCopy.textContent = `At ${formatNumber(Math.abs(displayRate), 1)} ${weightUnit()}/wk, you would reach your goal around ${etaDate ? formatDateShort(etaDate) : "an unknown date"}. ${outputBf ? `Estimated body fat at goal: ${outputBf}.` : ""}`;
    }
  }

  function renderHints(snapshot, metrics) {
    const hints = [];
    const goal = state.goal;
    const start = getGoalStartSnapshot(snapshot);
    const pace = getGoalPace(snapshot);
    const current = snapshot.weightAvgKg;

    if (!state.goal.startDate) {
      hints.push({
        text: "Progress currently starts from your first weekly average. Set a goal start date in settings if you want to reset the baseline.",
        tone: "normal",
      });
    } else if (start.usedNearest && start.week) {
      hints.push({
        text: `No weigh-ins were found in the selected start week, so the nearest weekly average (${formatWeekRange(start.week.weekStart)}) is being used.`,
        tone: "warning",
      });
    }

    if (pace?.kind === "pace") {
      hints.push({ text: pace.category.description, tone: "normal" });
      if (["cut-aggressive", "cut-extreme", "bulk-aggressive"].includes(pace.category.key)) {
        hints.push({
          text: "This is an aggressive pace. A later deadline or a slower weekly change is usually easier to sustain.",
          tone: "warning",
        });
      }
    } else if (pace?.kind === "deadline-passed") {
      hints.push({
        text: "The target date has passed. Update the deadline if you want a current pace recommendation.",
        tone: "warning",
      });
    } else {
      hints.push({
        text: "Set a target date to calculate the weekly change needed. Until then, body-fat projections use a moderate pace assumption.",
        tone: "normal",
      });
    }

    if (current !== null && goal.weightKg < metrics.leanMassKg) {
      hints.push({
        text: "The target weight is below your current lean mass. Reaching it would require losing lean mass as well as fat.",
        tone: "danger",
      });
    }

    const targetBf = goal.bodyFatPct;
    if (targetBf !== null && metrics.leanMassKg !== null) {
      const weightForTargetBf = metrics.leanMassKg / (1 - targetBf / 100);
      if (Number.isFinite(weightForTargetBf) && Math.abs(weightForTargetBf - goal.weightKg) > 1.5) {
        hints.push({
          text: `With current lean mass, ${formatNumber(targetBf, 1)}% body fat would correspond to about ${formatWeight(weightForTargetBf)}, not ${formatWeight(goal.weightKg)}.`,
          tone: "warning",
        });
      }
    }

    if (metrics.bodyFatPct === null) {
      hints.push({
        text: "Add a body-fat percentage to a weigh-in to unlock body-fat, lean-mass, and FFMI projections.",
        tone: "normal",
      });
    }
    if (metrics.heightCm === null) {
      hints.push({
        text: "Add your height in settings to unlock BMI and FFMI projections.",
        tone: "normal",
      });
    }
    if (state.entries.length === 0) {
      hints.push({
        text: "Log a few weigh-ins to establish a weekly average and make the plan more meaningful.",
        tone: "normal",
      });
    }

    if (!hints.length) {
      hints.push({
        text: "Your plan is set. Keep logging weigh-ins to keep the weekly averages current.",
        tone: "normal",
      });
    }

    dom.hints.innerHTML = hints
      .map(
        (hint) =>
          `<div class="planner-hint${hint.tone === "warning" ? " is-warning" : hint.tone === "danger" ? " is-danger" : ""}">${hint.text}</div>`,
      )
      .join("");
  }

  function render() {
    const snapshot = getWeeklySnapshot();
    const metrics = getCompositionMetrics(snapshot);
    const hasGoal = state.goal.weightKg !== null;
    dom.empty.hidden = hasGoal;
    dom.content.hidden = !hasGoal;
    if (!hasGoal) return;

    renderSummary(snapshot, metrics);
    renderProjections(snapshot, metrics);
    renderScenario(snapshot, metrics);
    renderHints(snapshot, metrics);
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
        return;
      }
    }
  }

  dom.themeToggle.addEventListener("click", () => {
    setTheme(dom.html.dataset.theme === "dark" ? "light" : "dark", true);
  });

  dom.scenarioRate.addEventListener("input", () => {
    scenarioInitialized = true;
    const snapshot = getWeeklySnapshot();
    renderScenario(snapshot, getCompositionMetrics(snapshot));
  });

  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      state = loadState();
      scenarioInitialized = false;
      render();
    }
    if (event.key === THEME_KEY && event.newValue) {
      setTheme(event.newValue === "dark" ? "dark" : "light", false);
    }
  });

  setTheme(dom.html.dataset.theme || "dark", false);
  render();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
