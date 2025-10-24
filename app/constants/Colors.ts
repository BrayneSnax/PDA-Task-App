import { ContainerId } from "./Types";

// Hex values are chosen to match the named color and mood, ensuring adequate contrast
// and avoiding bright, "shiny" colors as requested.

export const CircadianPalette = {
  // --- Palette Refinement: Lower Contrast, Softer Glow ---
  morning: {
    // Mood: calm, bright, optimistic but not loud. Feels like filtered sunlight through linen.
    bg: "#F5E6CC", // Muted Pale Gold/Lemon Chiffon (Core background)
    accent: "#A2B8A6", // Muted Sage (Accent background)
    text: "#4D483B", // Deep brown-gray (Text)
    dim: "#B3A698", // Warm taupe (Secondary text)
    signal: "#F2A08E", // Gentle coral (Signal color)
    card: "#FFFFFF",
  },
  afternoon: {
    // Mood: hydrated, clear, open. Feels like light through water or sky reflection.
    bg: "#E0FFFF", // Near Electric Blue (Core background - #7DF9FF is too bright)
    accent: "#B0E0E6", // Pale sand/desaturated turquoise (Accent background)
    text: "#3B4D48", // Dark gray with faint green tint (Text)
    dim: "#A9A9A9", // Cool stone (Secondary text)
    signal: "#40E0D0", // Aqua/Teal (Signal color)
    card: "#FFFFFF",
  },
  evening: {
    // Mood: warm descent; the body exhales. Feels like candlelight on clay walls.
    bg: "#4D3A30", // Deep Copper/Brown (Ancient Copper - Core background)
    accent: "#8C4B3F", // Deeper rust (Accent background)
    text: "#F0E5D8", // Light Cream/Off-white (Text - High contrast for dark background)
    dim: "#B87333", // Copper/umber (Secondary text)
    signal: "#D4AF37", // Muted amber (Signal color)
    card: "#333333", // Darker card
  },
  late: {
    // Mood: cocooned, quiet, protective. Feels like deep forest or night air.
    bg: "#1A1A1A", // Near Black (Core background - Darkest for night)
    accent: "#5A6E5A", // Dark moss (Accent background)
    text: "#F0F0F0", // Off-white (Text - High contrast for dark background)
    dim: "#A9B8A6", // Muted sage (Secondary text)
    signal: "#4682B4", // Moon-blue (Signal color)
    card: "#333333", // Darker card
  },
  // Neutral/Utility Containers
  situational: {
    // Mood: flexible, mid-tone palette that can overlay all others.
    bg: "#D3D3D3", // Neutral gray with whisper of blue (Core background)
    accent: "#A9A9A9", // Light slate (Accent background)
    text: "#36454F", // Charcoal (Text)
    dim: "#C0C0C0", // Mist gray (Secondary text)
    signal: "#B19CD9", // Gentle lavender (Signal color)
    card: "#FFFFFF",
  },
  uplift: {
    // Mood: clear energy, upward flow without glare. Feels like dawn sky after rain.
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
