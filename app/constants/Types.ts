export type ContainerId = 'morning' | 'afternoon' | 'evening' | 'late' | 'situational' | 'uplift';

export interface ColorScheme {
  bg: string;
  accent: string;
  text: string;
  dim: string;
  signal: string;
  card: string;
}

export interface ContainerItem {
  id: string;
  title: string;
  container: ContainerId;
  category: 'time' | 'situational' | 'uplift' | 'crafted';
  body_cue: string;
  micro: string;
  desire: string;
}

export interface Ally {
  id: string;
  name: string;
  face: string;
  invocation: string;
  function: string;
  shadow: string;
  ritual: string;
  log: Moment[];
}

export interface Moment {
  id: string;
  date: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  timestamp: number;
  allyId?: string;
  anchorId?: string;
  allyName?: string;
  anchorTitle?: string;
  container: ContainerId;
  
  // Journalistic Synthesis Fields
  // Journalistic Synthesis Fields (The 3-part check-in)
  tone: string; // e.g., "Lighter", "Same", "Spikier"
  frequency: string; // e.g., "Water", "Light", "Movement"
  presence: string; // e.g., "The Setting of the Altar", "The Invocation", "The Field Report"

  // Guided Reflection Prompts
  context: string; // "The Setting of the Altar"
  action_reflection: string; // "The Invocation"
  result_shift: string; // "The Field Report"
  conclusion_offering: string; // "The Offering"
  
  // Old JournalEntry fields, now part of Moment
  text: string;
}

export interface Completion {
  itemId: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface Pattern {
  id: string;
  date: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  timestamp: number;
  text: string; // The pattern observation
  category?: string; // Optional: 'anchor', 'substance', 'time', 'general'
}

export interface FoodEntry {
  id: string;
  date: string; // YYYY-MM-DDTHH:mm:ss.sssZ
  timestamp: number;
  name: string; // What was eaten
  feeling?: string; // Optional: how you feel
  notes?: string; // Optional: observations about the meal
  energy_level?: string; // Optional: 'low', 'medium', 'high'
}

export interface AppState {
  items: ContainerItem[];
  allies: Ally[];
  journalEntries: Moment[];
  substanceJournalEntries: Moment[]; // Separate journal for Substances section
  completions: Completion[];
  patterns: Pattern[];
  foodEntries: FoodEntry[];
  activeContainer: ContainerId;

}
