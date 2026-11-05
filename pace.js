(() => {
  "use strict";

  function classify(kgPerWeek, currentWeightKg) {
    const percentPerWeek =
      currentWeightKg > 0 ? (Math.abs(kgPerWeek) / currentWeightKg) * 100 : 0;
    const direction =
      Math.abs(kgPerWeek) < 0.02 ? "maintain" : kgPerWeek < 0 ? "cut" : "bulk";

    if (direction === "maintain") {
      return {
        key: "maintain",
        label: "Maintain",
        shortLabel: "Maintain",
        direction,
        percentPerWeek,
        tone: "neutral",
        description: "Your target pace is close to stable weight.",
      };
    }

    if (direction === "cut") {
      if (percentPerWeek < 0.25) {
        return {
          key: "cut-gentle",
          label: "Gentle cut",
          shortLabel: "Gentle",
          direction,
          percentPerWeek,
          tone: "cool",
          description: "A slow, gentle cut.",
        };
      }
      if (percentPerWeek <= 0.75) {
        return {
          key: "cut-steady",
          label: "Steady cut",
          shortLabel: "Steady",
          direction,
          percentPerWeek,
          tone: "good",
          description: "A moderate, commonly sustainable cut.",
        };
      }
      if (percentPerWeek <= 1) {
        return {
          key: "cut-aggressive",
          label: "Aggressive cut",
          shortLabel: "Aggressive",
          direction,
          percentPerWeek,
          tone: "warm",
          description: "A fast cut; recovery and lean-mass retention need attention.",
        };
      }
      return {
        key: "cut-extreme",
        label: "Very aggressive cut",
        shortLabel: "Very aggressive",
        direction,
        percentPerWeek,
        tone: "hot",
        description: "A very aggressive cut.",
      };
    }

    if (percentPerWeek < 0.1) {
      return {
        key: "bulk-gentle",
        label: "Gentle bulk",
        shortLabel: "Gentle",
        direction,
        percentPerWeek,
        tone: "cool",
        description: "A slow, controlled gain.",
      };
    }
    if (percentPerWeek <= 0.3) {
      return {
        key: "bulk-lean",
        label: "Lean gain",
        shortLabel: "Lean",
        direction,
        percentPerWeek,
        tone: "good",
        description: "A controlled pace intended to favor lean gain.",
      };
    }
    if (percentPerWeek <= 0.5) {
      return {
        key: "bulk-moderate",
        label: "Moderate bulk",
        shortLabel: "Moderate",
        direction,
        percentPerWeek,
        tone: "warm",
        description: "A moderate bulk; fat gain becomes more likely.",
      };
    }
    return {
      key: "bulk-aggressive",
      label: "Aggressive bulk",
      shortLabel: "Aggressive",
      direction,
      percentPerWeek,
      tone: "hot",
      description: "A fast bulk; a larger share of the gain is likely to be fat.",
    };
  }

  window.WeighlinePace = Object.freeze({ classify });
})();
