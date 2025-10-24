import { ContainerId } from "./Types";

export const CircadianPalette = {
  // --- Palette Refinement: Lower Contrast, Softer Glow ---
  morning: {
    bg: "#F7F5EC", // Lighter, Softer Cream
    accent: "#A2B8A6", // Muted Sage (Same, good calm)
    text: "#4D483B", // Deep Brown-Gray (Slightly softer)
    dim: "#B3A698", // Warm Taupe (Same)
    signal: "#F2A08E", // Gentle Coral (Same)
    card: "#FFFFFF",
  },
  afternoon: {
    bg: "#E6F7FF", // Very Pale Blue/Cyan
    accent: "#7DF9FF", // Aqua (Slightly brighter, as a focus color)
    text: "#3B4D48", // Dark Gray with Green Tint (Same)
    dim: "#A9A9A9", // Cool Stone (Same)
    signal: "#00BFFF", // Deep Sky Blue (Same)
    card: "#FFFFFF",
  },
  evening: {
    bg: "#332D33", // Deep, muted purple-gray
    accent: "#D4AF37", // Muted Amber (Used as primary accent)
    text: "#F0E5D8", // Light Cream (Soft glow for text)
    dim: "#8C4B3F", // Deeper Rust (Used as dim color)
    signal: "#B87333", // Copper/Bronze (Used as signal)
    card: "#1A1A1A",
  },
  late: {
    bg: "#1A1A1A", // Darkest background
    accent: "#A9B8A6", // Muted Sage (Soft contrast)
    text: "#F0F0F0", // Off-White (Soft glow for text)
    dim: "#5A6E5A", // Dark Moss (Very subtle dim)
    signal: "#4682B4", // Moon-Blue (Same)
    card: "#333333", // Darker card
  },
  // Neutral/Utility Containers
  situational: {
    bg: "#F5F5F5", // Lighter Neutral Gray
    accent: "#B19CD9", // Gentle Lavender (Used as accent)
    text: "#36454F", // Charcoal (Same)
    dim: "#D3D3D3", // Mist Gray (Same)
    signal: "#E6E6FA", // Soft Lilac (Used as signal)
    card: "#FFFFFF",
  },
  uplift: {
    bg: "#FAFAFA", // Near-white
    accent: "#00BFFF", // Cyan (As a burst of energy)
    text: "#000080", // Dark Indigo (Same)
    dim: "#B19CD9", // Muted Violet (Same)
    signal: "#00FFFF", // Bright Cyan (Same)
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
  situational: "Situational Grounding",
  uplift: "Uplift & Expansion",
};
