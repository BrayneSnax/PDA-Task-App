import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppState, ContainerItem, Ally, Moment, Completion, ContainerId, Pattern, FoodEntry } from '../constants/Types';
import { JournalEntry } from '../constants/Types'; // Keep JournalEntry for backward compatibility if needed, but Moment is the new primary type
import { DEFAULT_ALLIES, DEFAULT_GROUNDING_ITEMS } from '../constants/DefaultData';
import { saveAppState, loadAppState } from '../utils/storage';
import { formatDate, generateId, getCurrentContainer } from '../utils/time';

interface AppContextType extends AppState {

  addItem: (item: Omit<ContainerItem, 'id'>) => void;
  removeItem: (id: string) => void;
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
  setActiveContainer: (container: ContainerId) => void;
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
  const [activeContainer, setActiveContainer] = useState<ContainerId>(getCurrentContainer());

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
  }, [items, allies, journalEntries, substanceJournalEntries, completions, patterns, foodEntries, activeContainer, loading]);

  const loadData = useCallback(async () => {
    const savedState = await loadAppState();
    if (savedState) {
      setItems(savedState.items.length > 0 ? savedState.items : DEFAULT_GROUNDING_ITEMS);
      setAllies(savedState.allies.length > 0 ? savedState.allies : DEFAULT_ALLIES);
      setJournalEntries(savedState.journalEntries || []);
      setSubstanceJournalEntries(savedState.substanceJournalEntries || []);
      setCompletions(savedState.completions || []);
      setPatterns(savedState.patterns || []);
      setFoodEntries(savedState.foodEntries || []);
      setActiveContainer(savedState.activeContainer || getCurrentContainer());

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
      activeContainer,

    });
  }, [items, allies, journalEntries, substanceJournalEntries, completions, patterns, foodEntries, activeContainer]);

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
    activeContainer,


    addItem,
    removeItem,
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
    setActiveContainer,
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

