// Theme engine: turns (background colour + accent colour) into the CSS variables
// used by Tailwind (see tailwind.config.js). Every module reads these variables,
// so changing the background in Settings re-tints the whole site.

export type Mode = "dark" | "light";
type RGB = [number, number, number];

export interface BackgroundOption {
  id: string;
  name: string;
  mode: Mode;
  rgb: RGB;
}
export interface AccentOption {
  id: string;
  name: string;
  rgb: RGB;
  secondary: RGB;
} // secondary = 2nd colour of the main-theme gradient

/** Page background choices (swatches in Settings). */
export const BACKGROUNDS: BackgroundOption[] = [
  { id: "aurora", name: "Aurora Night", mode: "dark", rgb: [19, 11, 35] }, // main theme: deep violet
  { id: "midnight", name: "Midnight", mode: "dark", rgb: [17, 20, 29] },
  { id: "charcoal", name: "Charcoal", mode: "dark", rgb: [24, 24, 27] },
  { id: "ocean", name: "Deep Ocean", mode: "dark", rgb: [9, 22, 41] },
  { id: "wine", name: "Wine", mode: "dark", rgb: [32, 11, 20] },
  { id: "forest", name: "Forest", mode: "dark", rgb: [9, 27, 21] },
  { id: "plum", name: "Plum", mode: "dark", rgb: [27, 14, 40] },
  {
    id: "lavender",
    name: "Lavender Mist",
    mode: "light",
    rgb: [243, 239, 252],
  }, // main theme (light)
  { id: "snow", name: "Snow", mode: "light", rgb: [247, 248, 250] },
  { id: "cream", name: "Cream", mode: "light", rgb: [251, 246, 236] },
  { id: "mint", name: "Mint", mode: "light", rgb: [235, 247, 240] },
  { id: "sky", name: "Sky", mode: "light", rgb: [235, 243, 252] },
  { id: "blush", name: "Blush", mode: "light", rgb: [253, 239, 243] },
];

/**
 * Main-theme colour pairs (used by Home, About, Settings, login, sidebar and admin;
 * movies / music / books keep their own palettes).
 * "Aurora" = mint green + violet, taken from the new theme artwork.
 */
export const ACCENTS: AccentOption[] = [
  {
    id: "aurora",
    name: "Aurora",
    rgb: [52, 245, 170],
    secondary: [137, 48, 208],
  }, // default
  {
    id: "violet",
    name: "Violet",
    rgb: [167, 118, 245],
    secondary: [52, 245, 170],
  },
  {
    id: "emerald",
    name: "Emerald",
    rgb: [3, 226, 89],
    secondary: [137, 48, 208],
  },
  {
    id: "ocean",
    name: "Ocean",
    rgb: [56, 189, 248],
    secondary: [139, 92, 246],
  },
  { id: "teal", name: "Teal", rgb: [45, 212, 191], secondary: [124, 58, 237] },
  {
    id: "fuchsia",
    name: "Fuchsia",
    rgb: [232, 121, 249],
    secondary: [52, 245, 170],
  },
  { id: "rose", name: "Rose", rgb: [251, 113, 133], secondary: [168, 85, 247] },
  {
    id: "amber",
    name: "Amber",
    rgb: [251, 191, 36],
    secondary: [251, 113, 60],
  },
  {
    id: "crimson",
    name: "Crimson",
    rgb: [239, 68, 68],
    secondary: [137, 48, 208],
  },
];

export const DEFAULT_BG: Record<Mode, string> = {
  dark: "aurora",
  light: "lavender",
};

const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

/** Blend colour a towards b (t = 0..1). */
const mix = (a: RGB, b: RGB, t: number): RGB =>
  [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as RGB;
const str = (c: RGB) => c.join(" ");
/** Perceived brightness 0..1 - decides if text on the accent should be dark or white. */
const luminance = ([r, g, b]: RGB) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

/** Builds every CSS variable for the chosen background + accent. */
export function buildTokens(
  bg: BackgroundOption,
  accent: AccentOption
): Record<string, string> {
  const dark = bg.mode === "dark";
  // in light mode the accent is darkened so it stays readable on white
  const a = dark ? accent.rgb : mix(accent.rgb, BLACK, 0.35);

  return {
    "--bg": str(bg.rgb),
    "--surface": str(
      dark ? mix(bg.rgb, WHITE, 0.06) : mix(bg.rgb, WHITE, 0.75)
    ),
    "--elevated": str(
      dark ? mix(bg.rgb, WHITE, 0.12) : mix(bg.rgb, BLACK, 0.05)
    ),
    "--sidebar": str(dark ? mix(bg.rgb, BLACK, 0.35) : mix(bg.rgb, WHITE, 0.9)),
    "--line": str(dark ? mix(bg.rgb, WHITE, 0.2) : mix(bg.rgb, BLACK, 0.12)),
    "--fg": dark ? "238 236 236" : "17 20 29",
    "--muted": dark ? "160 164 178" : "100 108 125",
    "--accent": str(a),
    // 2nd gradient colour of the main theme (modules override it with their own palette)
    "--m2": str(dark ? accent.secondary : mix(accent.secondary, BLACK, 0.15)),
    "--accent-fg": luminance(a) > 0.55 ? "17 20 29" : "255 255 255",
  };
}
