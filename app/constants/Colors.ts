import { ContainerId } from "./Types";

export const CircadianPalette = {
  // --- Palette Refinement: Lower Contrast, Softer Glow ---
  morning: {
    bg: "#F5E6CC", // Muted Pale Gold/Lemon Chiffon (Core background)
    accent: "#A2B8A6", // Muted Sage (Accent background)
    text: "#4D483B", // Deep brown-gray (Text)
    dim: "#B3A698", // Warm taupe (Secondary text)
    signal: "#F2A08E", // Gentle coral (Signal color)
    card: "#FFFFFF",
  },
  afternoon: {
    bg: "#E0FFFF", // Near Electric Blue (Core background - #7DF9FF is too bright)
    accent: "#B0E0E6", // Pale sand/desaturated turquoise (Accent background)
    text: "#3B4D48", // Dark gray with faint green tint (Text)
    dim: "#A9A9A9", // Cool stone (Secondary text)
    signal: "#40E0D0", // Aqua/Teal (Signal color)
    card: "#FFFFFF",
  },
  evening: {
    bg: "#4D3A30", // Deep Copper/Brown (Ancient Copper - Core background)
    accent: "#8C4B3F", // Deeper rust (Accent background)
    text: "#4D3B36", // Dark walnut brown (Text)
    dim: "#B87333", // Copper/umber (Secondary text)
    signal: "#D4AF37", // Muted amber (Signal color)
    card: "#1A1A1A",
  },
  late: {
    bg: "#4B0082", // Indigo (Core background)
    accent: "#5A6E5A", // Dark moss (Accent background)
    text: "#F0F0F0", // Off-white (Text)
    dim: "#A9B8A6", // Muted sage (Secondary text)
    signal: "#4682B4", // Moon-blue (Signal color)
    card: "#333333", // Darker card
  },
  // Neutral/Utility Containers
  situational: {
    bg: "#D3D3D3", // Neutral gray with whisper of blue (Core background)
    accent: "#A9A9A9", // Light slate (Accent background)
    text: "#36454F", // Charcoal (Text)
    dim: "#C0C0C0", // Mist gray (Secondary text)
    signal: "#B19CD9", // Gentle lavender (Signal color)
    card: "#FFFFFF",
  },
  uplift: {
    bg: "#E6E6FA", // Very light periwinkle (Core background)
    accent: "#B19CD9", // Soft lilac (Accent background)
    text: "#000080", // Dark indigo (Text)
    dim: "#B19CD9", // Muted violet (Secondary text)
    signal: "#00CED1", // Thin line of cyan (Signal color)
    card: "#FFFFFF",
  },
};

export const StateIndicators = {
  mint: "#A2B8A6", // Rest
  grey: "#A9A9A9", // Neutral
  violet: "#B19CD9", // Focus
};

export const ContainerThemes: Record<ContainerId, string> = {
  morning: "orient gently; don't command yourself awake",
  afternoon: "release built-up charge, re-enter presence",
  evening: "unwind; let cognition return to body",
  late: "signal safety; prepare for rest without force",
  situational: "Situational Resonance",
  uplift: "Uplift & Expansion",
};
