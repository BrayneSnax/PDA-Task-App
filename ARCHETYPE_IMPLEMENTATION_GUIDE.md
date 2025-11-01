# Archetype Edit/Delete Implementation Guide

## Overview
This guide documents the implementation of custom archetype creation with harmonic theme generation, plus edit/delete functionality for existing archetypes.

---

## ✅ Completed Components

### 1. Harmonic Theme Generator (`app/utils/themeGenerator.ts`)
- Generates random but coherent color schemes using color theory
- Supports complementary, analogous, triadic, and split-complementary harmonies
- Organized emoji sets by energy type (celestial, nature, elemental, mystical, cosmic, symbolic)
- Functions:
  - `generateHarmonicTheme()` - Full theme with colors + emoji
  - `regenerateColors(emoji)` - New colors, keep emoji
  - `regenerateEmoji(colors)` - New emoji, keep colors

### 2. Updated ArchetypeCard (`app/components/ArchetypeCard.tsx`)
- Added long-press menu for edit/delete
- Props: `onEdit`, `onDelete`, `isDefault`
- Protects default archetypes from deletion
- Modal menu with Edit/Delete/Cancel options

### 3. AddArchetypeModal (`app/modal/AddArchetypeModal.tsx`)
- Create custom archetypes with generated themes
- Live theme preview with color swatches
- Three regeneration buttons:
  - 🎲 New Theme (regenerate everything)
  - 🎨 New Colors (keep emoji)
  - ✨ New Icon (keep colors)
- Fields: Name*, Subtitle, Bio
- Validation: requires at least a name

### 4. EditArchetypeModal (`app/modal/EditArchetypeModal.tsx`)
- Edit existing archetypes
- Same theme regeneration as Add modal
- Pre-fills all fields from existing archetype
- Saves changes back to archetype

### 5. Type Updates
**`app/constants/Types.ts`:**
- Added `theme?` to Archetype interface (optional harmonic theme)
- Added `isDefault?` to Archetype interface
- Added `archetypes: Archetype[]` to AppState

**`app/constants/DefaultData.ts`:**
- All DEFAULT_ARCHETYPES now have `isDefault: true`

**`app/context/AppContext.tsx`:**
- Added to AppContextType interface:
  - `addArchetype()`
  - `updateArchetype()`
  - `removeArchetype()`
  - `updateItem()` (for task editing)

---

## ⏳ Remaining Implementation

### Step 1: Complete AppContext (`app/context/AppContext.tsx`)

Add archetype state and functions:

```typescript
import { DEFAULT_ARCHETYPES } from '../constants/DefaultData';
import { Archetype } from '../constants/Types';

// In AppProvider:
const [archetypes, setArchetypes] = useState<Archetype[]>(DEFAULT_ARCHETYPES);

// Add to loadData():
archetypes: Array.isArray(savedState.archetypes) && savedState.archetypes.length > 0 
  ? savedState.archetypes 
  : DEFAULT_ARCHETYPES,

// Add to saveData():
archetypes,

// Add to useEffect dependencies:
[items, allies, journalEntries, substanceJournalEntries, completions, patterns, foodEntries, archetypes, activeContainer, loading]

// Implement functions:
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

const updateItem = useCallback((id: string, updates: Partial<ContainerItem>) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
}, []);

// Add to context value:
archetypes,
addArchetype,
updateArchetype,
removeArchetype,
updateItem,
```

### Step 2: Wire Up UI in `app/(tabs)/index.tsx`

```typescript
// Add imports:
import { AddArchetypeModal } from '../modal/AddArchetypeModal';
import { EditArchetypeModal } from '../modal/EditArchetypeModal';

// Get archetypes from context:
const { archetypes, addArchetype, updateArchetype, removeArchetype, updateItem } = useApp();

// Add state:
const [isAddArchetypeModalVisible, setIsAddArchetypeModalVisible] = useState(false);
const [editingArchetype, setEditingArchetype] = useState<Archetype | null>(null);

// Replace DEFAULT_ARCHETYPES with archetypes from context:
{archetypes.map((archetype) => (
  <ArchetypeCard
    key={archetype.id}
    archetype={archetype}
    onPress={() => {
      setSelectedArchetype(archetype);
      setIsArchetypeModalVisible(true);
    }}
    onEdit={() => setEditingArchetype(archetype)}
    onDelete={() => removeArchetype(archetype.id)}
    isDefault={archetype.isDefault}
    colors={colors}
  />
))}

// Add "Create Custom Archetype" button:
<TouchableOpacity
  style={[styles.addButton, { backgroundColor: colors.accent }]}
  onPress={() => setIsAddArchetypeModalVisible(true)}
>
  <Text style={[styles.addButtonText, { color: colors.bg }]}>
    + Create Custom Archetype
  </Text>
</TouchableOpacity>

// Add modals before closing tag:
<AddArchetypeModal
  isVisible={isAddArchetypeModalVisible}
  onClose={() => setIsAddArchetypeModalVisible(false)}
  onSave={(archetype) => {
    addArchetype({
      ...archetype,
      activation_phrase: 'Invoke this archetype.',
      body_cue: 'Take a breath and embody this role.',
      invocation_visualization: 'See yourself stepping into this archetype.',
      deactivation_phrase: 'Return to center.',
      color_theme: {
        accent: archetype.theme.accent,
        overlay: archetype.theme.background + '26', // 15% opacity
      },
    });
  }}
  colors={colors}
/>

<EditArchetypeModal
  isVisible={!!editingArchetype}
  archetype={editingArchetype}
  onClose={() => setEditingArchetype(null)}
  onSave={(archetype) => {
    updateArchetype(archetype);
    setEditingArchetype(null);
  }}
  colors={colors}
/>
```

### Step 3: Add Styles

```typescript
addButton: {
  backgroundColor: colors.accent,
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 24,
},
addButtonText: {
  fontSize: 16,
  fontWeight: '600',
},
```

---

## 🎨 How It Works

### Creating Custom Archetypes:
1. User presses "+ Create Custom Archetype"
2. AddArchetypeModal opens with random harmonic theme
3. User can regenerate theme/colors/emoji until satisfied
4. User fills in Name (required), Subtitle, Bio
5. On save, archetype is added with:
   - Generated theme colors
   - Selected emoji as icon
   - Default activation phrases
   - `isDefault: false`

### Editing Archetypes:
1. User long-presses archetype card
2. Menu appears with Edit/Delete options
3. On Edit:
   - EditArchetypeModal opens with current data
   - User can modify name, subtitle, bio
   - User can regenerate theme
4. On Save, archetype is updated

### Deleting Archetypes:
1. User long-presses archetype card
2. Menu shows "Delete" (or "cannot delete" for defaults)
3. On Delete, archetype is removed from list
4. Default archetypes (`isDefault: true`) are protected

---

## 🧪 Testing Checklist

- [ ] Create custom archetype with generated theme
- [ ] Regenerate full theme (colors + emoji)
- [ ] Regenerate just colors
- [ ] Regenerate just emoji
- [ ] Edit custom archetype
- [ ] Edit default archetype
- [ ] Try to delete default archetype (should be protected)
- [ ] Delete custom archetype
- [ ] Verify archetypes persist across app restarts
- [ ] Check theme colors display correctly
- [ ] Verify long-press menu works on all archetypes

---

## 📝 Notes

- Harmonic themes use color theory to ensure visual coherence
- Default archetypes cannot be deleted, only edited
- Custom archetypes get default activation phrases (can be enhanced later)
- Theme colors are separate from existing color_theme (for backward compatibility)
- All archetype data persists in AsyncStorage via AppContext

---

## 🚀 Future Enhancements

- Allow editing activation phrases for custom archetypes
- Import/export custom archetypes
- Share archetypes between users
- More emoji sets and color palettes
- Preview archetype in action before saving
- Duplicate archetype feature
