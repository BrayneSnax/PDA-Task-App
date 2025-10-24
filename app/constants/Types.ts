// Core TypeScript types for PDA Task App

export type ContainerId = 'morning' | 'afternoon' | 'evening' | 'late';
export type MomentType = 'grounding' | 'custom' | 'appointment';
export type GroundingCategory = 'time' | 'situational' | 'uplift';

export interface ContainerItem {
  id: string;
  title: string;
  body_cue?: string;
  desire?: string;
  micro?: string;
  type: MomentType;
  container: ContainerId;
  category?: GroundingCategory;
}

export interface Ally {
  id: string;
  name: string;
  face: string;
  invocation: string;
  function: string;
  shadow: string;
  ritual: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  text: string;
  container: ContainerId;
  method?: string;
  dosage?: string;
  intention?: string;
  feeling?: string;
}

export interface Completion {
  itemId: string;
  date: string;
  timestamp: number;
}

export interface AppState {
  items: ContainerItem[];
  allies: Ally[];
  journalEntries: JournalEntry[];
  completions: Completion[];
  activeContainer: ContainerId;
}

export interface ColorScheme {
  bg: string;
  card: string;
  text: string;
  dim: string;
  accent: string;
}

