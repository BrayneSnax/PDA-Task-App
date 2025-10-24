import { ContainerId } from "./Types";

export const CircadianPalette = {
  morning: {
    bg: "#F7E6A2",
    accent: "#a2b8a6", // Muted Sage
    text: "#4d483b", // Deep Brown-Gray
    dim: "#b3a698", // Warm Taupe
    signal: "#f2a08e", // Gentle Coral
  },
  afternoon: {
    bg: "#7DF9FF",
    accent: "#c2e0e0", // Pale Sand
    text: "#3b4d48", // Dark Gray with Green Tint
    dim: "#a9a9a9", // Cool Stone
    signal: "#00bfff", // Aqua
  },
  evening: {
    bg: "#PF543E",
    accent: "#8c4b3f", // Deeper Rust
    text: "#4a3f35", // Dark Walnut Brown
    dim: "#a67b5b", // Copper
    signal: "#d4af37", // Muted Amber
  },
  late: {
    bg: "#4B0082",
    accent: "#5a6e5a", // Dark Moss
    text: "#f0f0f0", // Off-White
    dim: "#a9b8a6", // Muted Sage
    signal: "#4682b4", // Moon-Blue
  },
  situational: {
    bg: "#e6e6fa", // Neutral Gray with Blue Whisper
    accent: "#d8d8e0", // Light Slate
    text: "#36454f", // Charcoal
    dim: "#d3d3d3", // Mist Gray
    signal: "#b19cd9", // Gentle Lavender
  },
  uplift: {
    bg: "#f0f8ff", // Very Light Periwinkle
    accent: "#e6e6fa", // Soft Lilac
    text: "#000080", // Dark Indigo
    dim: "#b19cd9", // Muted Violet
    signal: "#00ffff", // Cyan
  },
};

export const ContainerThemes: Record<ContainerId, string> = {
  morning: "Soft Ignition",
  afternoon: "Clarity & Balance",
  evening: "Integration & Release",
  late: "Descent & Safety",
};