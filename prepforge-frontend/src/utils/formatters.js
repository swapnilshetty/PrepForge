// Converts "#rrggbb" to an [r, g, b] array.
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Blends two hex colors together. t = 0 returns colorA, t = 1 returns colorB.
function lerpColor(colorA, colorB, t) {
  const [r1, g1, b1] = hexToRgb(colorA);
  const [r2, g2, b2] = hexToRgb(colorB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// The "heat" concept behind PrepForge's progress bars: low progress reads
// as cool iron, and the color heats up toward ember and then spark as the
// percentage climbs toward 100. Purely presentational, no side effects.
export function getHeatColor(percent) {
  const p = Math.max(0, Math.min(100, percent));
  const IRON = "#c9c2b7";
  const EMBER = "#e1531f";
  const SPARK = "#f2a93c";

  if (p <= 50) {
    return lerpColor(IRON, EMBER, p / 50);
  }
  return lerpColor(EMBER, SPARK, (p - 50) / 50);
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "0%";
  return `${Math.round(value)}%`;
}

const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function difficultyLabel(value) {
  if (!value) return "—";
  return DIFFICULTY_LABELS[value.toLowerCase()] || value;
}

const INTERVIEW_TYPE_LABELS = {
  technical: "Technical",
  behavioral: "Behavioral",
  system_design: "System Design",
};

export function interviewTypeLabel(value) {
  if (!value) return "—";
  return INTERVIEW_TYPE_LABELS[value.toLowerCase()] || value;
}

// Turns "solved: 12, total: 40" into a safe percentage, guarding against
// divide-by-zero when a learner has no data yet.
export function safePercent(part, total) {
  if (!total) return 0;
  return (part / total) * 100;
}
