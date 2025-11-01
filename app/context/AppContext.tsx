import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppState, ContainerItem, Ally, Moment, Completion, ContainerId, Pattern, FoodEntry, Archetype } from '../constants/Types';
import { JournalEntry } from '../constants/Types'; // Keep JournalEntry for backward compatibility if needed, but Moment is the new primary type
import { DEFAULT_ALLIES, DEFAULT_GROUNDING_ITEMS, DEFAULT_ARCHETYPES } from '../constants/DefaultData';
import { saveAppState, loadAppState } from '../utils/storage';
import { formatDate, generateId, getCurrentContainer } from '../utils/time';

interface AppContextType extends AppState {

  addItem: (item: Omit<ContainerItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<ContainerItem>) => void;
  toggleCompletion: (itemId: string) => void;
  isCompleted: (itemId: string) => boolean;
  addAlly: (ally: Omit<Ally, 'id'>) => void;
  updateAlly: (ally: Ally) => void;
  removeAlly: (id: string) => void;
  logAllyUse: (allyName: string, details?: Partial<Moment>) => void;
  addMoment: (moment: Omit<Moment, 'id' | 'timestamp' | 'date'>) => void;
  addSubstanceMoment: (moment: Omit<Moment, 'id' | 'timestamp' | 'date'>) => void;
  addPattern: (pattern: Omit<Pattern, 'id' | 'timestamp' | 'date'>) => void;
  removePattern: (id: string) => void;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp' | 'date'>) => void;
  removeFoodEntry: (id: string) => void;
  addArchetype: (archetype: Omit<import('../constants/Types').Archetype, 'id'>) => void;
  updateArchetype: (archetype: import('../constants/Types').Archetype) => void;
  removeArchetype: (id: string) => void;
  setActiveContainer: (container: ContainerId) => void;
  activeArchetypeId: string | null;
  setActiveArchetypeId: (id: string | null) => void;
  loading: boolean;
  removeJournalEntry: (id: string) => void;
  removeSubstanceJournalEntry: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ContainerItem[]>(DEFAULT_GROUNDING_ITEMS);
  const [allies, setAllies] = useState<Ally[]>(DEFAULT_ALLIES);
  const [journalEntries, setJournalEntries] = useState<Moment[]>([]);
  const [substanceJournalEntries, setSubstanceJournalEntries] = useState<Moment[]>([]);
  
  const removeJournalEntry = useCallback((id: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);
  
  const removeSubstanceJournalEntry = useCallback((id: string) => {
    setSubstanceJournalEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [archetypes, setArchetypes] = useState<Archetype[]>(DEFAULT_ARCHETYPES);
  const [activeContainer, setActiveContainer] = useState<ContainerId>(getCurrentContainer());
  const [activeArchetypeId, setActiveArchetypeId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data whenever state changes (debounced)
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        saveData();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [items, allies, journalEntries, substanceJournalEntries, completions, patterns, foodEntries, archetypes, activeContainer, loading]);

  const loadData = useCallback(async () => {
    const savedState = await loadAppState();
    if (savedState) {
      // normalize incoming state for backward compatibility
      const normalizeMoment = (m: any) => ({
        ...m,
        tone: m.tone || '',
        frequency: m.frequency || '',
        presence: m.presence || '',
        context: m.context || '',
        action_reflection: m.action_reflection || '',
        result_shift: m.result_shift || '',
        conclusion_offering: m.conclusion_offering || '',
        text: m.text || '',
      });

      const normalized = {
        items: Array.isArray(savedState.items) && savedState.items.length > 0 ? savedState.items : DEFAULT_GROUNDING_ITEMS,
        allies: Array.isArray(savedState.allies) && savedState.allies.length > 0 ? savedState.allies : DEFAULT_ALLIES,
        journalEntries: Array.isArray(savedState.journalEntries) ? savedState.journalEntries.map(normalizeMoment) : [],
        substanceJournalEntries: Array.isArray(savedState.substanceJournalEntries) ? savedState.substanceJournalEntries.map(normalizeMoment) : [],
        completions: Array.isArray(savedState.completions) ? savedState.completions : [],
        patterns: Array.isArray(savedState.patterns) ? savedState.patterns : [],
        foodEntries: Array.isArray(savedState.foodEntries) ? savedState.foodEntries : [],
        archetypes: Array.isArray(savedState.archetypes) && savedState.archetypes.length > 0 ? savedState.archetypes : DEFAULT_ARCHETYPES,
        activeContainer: savedState.activeContainer || getCurrentContainer(),
      } as AppState;

      setItems(normalized.items);
      setAllies(normalized.allies);
      setJournalEntries(normalized.journalEntries);
      setSubstanceJournalEntries(normalized.substanceJournalEntries);
      setCompletions(normalized.completions);
      setPatterns(normalized.patterns);
      setFoodEntries(normalized.foodEntries);
      setArchetypes(normalized.archetypes);
      setActiveContainer(normalized.activeContainer);

    }
    setLoading(false);
  }, []);

  const saveData = useCallback(async () => {
    await saveAppState({
      items,
      allies,
      journalEntries,
      substanceJournalEntries,
      completions,
      patterns,
      foodEntries,
      archetypes,
      activeContainer,

    });
  }, [items, allies, journalEntries, substanceJournalEntries, completions, patterns, foodEntries, archetypes, activeContainer]);

  const addItem = useCallback((item: Omit<ContainerItem, 'id'>) => {
    const newItem: ContainerItem = {
      ...item,
      id: generateId(),
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setCompletions(prev => prev.filter(c => c.itemId !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ContainerItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const toggleCompletion = useCallback((itemId: string) => {
    const today = formatDate();
    const existingCompletion = completions.find(
      c => c.itemId === itemId && c.date === today
    );

    if (existingCompletion) {
      // Remove completion
      setCompletions(prev => prev.filter(c => c !== existingCompletion));
    } else {
      // Add completion
      const newCompletion: Completion = {
        itemId,
        date: today,
        timestamp: Date.now(),
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  }, [completions]);

  const isCompleted = useCallback((itemId: string): boolean => {
    const today = formatDate();
    return completions.some(c => c.itemId === itemId && c.date === today);
  }, [completions]);

  const addAlly = useCallback((ally: Omit<Ally, 'id'>) => {
    const newAlly: Ally = {
      ...ally,
      id: generateId(),
    };
    setAllies(prev => [...prev, newAlly]);
  }, []);

  const updateAlly = useCallback((ally: Ally) => {
    setAllies(prev => prev.map(a => a.id === ally.id ? ally : a));
  }, []);

  const removeAlly = useCallback((id: string) => {
    setAllies(prev => prev.filter(a => a.id !== id));
  }, []);

  const addMoment = useCallback((moment: Omit<Moment, 'id' | 'timestamp' | 'date'>) => {
    const newMoment: Moment = {
      ...moment,
      id: generateId(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };
    setJournalEntries(prev => [newMoment, ...prev]);

    // Update ally log if an ally was involved
    if (newMoment.allyId) {
      setAllies(prevAllies => prevAllies.map(ally => {
        if (ally.id === newMoment.allyId) {
          return {
            ...ally,
            log: [newMoment, ...ally.log],
          };
        }
        return ally;
      }));
    }
  }, [activeContainer]);

  // Add moment specifically to Substances journal (separate from main journal)
  const addSubstanceMoment = useCallback((moment: Omit<Moment, 'id' | 'timestamp' | 'date'>) => {
    const newMoment: Moment = {
      ...moment,
      id: generateId(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };
    setSubstanceJournalEntries(prev => [newMoment, ...prev]);

    // Update ally log if an ally was involved
    if (newMoment.allyId) {
      setAllies(prevAllies => prevAllies.map(ally => {
        if (ally.id === newMoment.allyId) {
          return {
            ...ally,
            log: [newMoment, ...ally.log],
          };
        }
        return ally;
      }));
    }
  }, [activeContainer]);

  // Keeping logAllyUse for now, but redirecting it to the new addMoment
  const logAllyUse = useCallback((ally: Ally, details?: Partial<Moment>) => {
    // Ally object is passed directly from AllyCard/index.tsx
    if (!ally || !ally.name) {
      console.error(`Ally object invalid: ${ally}`);
      return;
    }
    const moment: Omit<Moment, 'id' | 'timestamp' | 'date'> = {
      text: `Used ${ally.name}`,
      container: activeContainer,
      allyId: ally.id,
      allyName: ally.name,
      // Default values for new fields
      tone: details?.tone || '',
      frequency: details?.frequency || '',
      presence: details?.presence || '',
      ...details,
    };
    addMoment(moment);
  }, [activeContainer, allies, addMoment]);


  const addPattern = useCallback((pattern: Omit<Pattern, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newPattern: Pattern = {
      ...pattern,
      id: generateId(),
      date: now.toISOString(),
      timestamp: now.getTime(),
    };
    setPatterns(prev => [newPattern, ...prev]);
  }, []);

  const removePattern = useCallback((id: string) => {
    setPatterns(prev => prev.filter(p => p.id !== id));
  }, []);

  const addFoodEntry = useCallback((entry: Omit<FoodEntry, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newEntry: FoodEntry = {
      ...entry,
      id: generateId(),
      date: now.toISOString(),
      timestamp: now.getTime(),
    };
    setFoodEntries(prev => [newEntry, ...prev]);
  }, []);

  const removeFoodEntry = useCallback((id: string) => {
    setFoodEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const addArchetype = useCallback((archetype: Omit<Archetype, 'id'>) => {
    const newArchetype: Archetype = {
      ...archetype,
      id: generateId(),
      isDefault: false,
    };
    setArchetypes(prev => [...prev, newArchetype]);
  }, []);

  const updateArchetype = useCallback((archetype: Archetype) => {
    setArchetypes(prev => prev.map(a => a.id === archetype.id ? archetype : a));
  }, []);

  const removeArchetype = useCallback((id: string) => {
    setArchetypes(prev => prev.filter(a => a.id !== id));
  }, []);



  const value: AppContextType = {
    removeJournalEntry,
    removeSubstanceJournalEntry,
    items,
    allies,
    journalEntries,
    substanceJournalEntries,
    completions,
    patterns,
    foodEntries,
    archetypes,
    activeContainer,


    addItem,
    removeItem,
    updateItem,
    toggleCompletion,
    isCompleted,
    addAlly,
    updateAlly,
    removeAlly,
    logAllyUse,
    addMoment,
    addSubstanceMoment,
    addPattern,
    removePattern,
    addFoodEntry,
    removeFoodEntry,
    addArchetype,
    updateArchetype,
    removeArchetype,
    setActiveContainer,
    activeArchetypeId,
    setActiveArchetypeId,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

