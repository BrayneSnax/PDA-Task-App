import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';

// --- AddAllyModal (Existing) ---

interface AddAllyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (name: string, face: string, invocation: string, func: string, shadow: string, ritual: string) => void;
  colors: ColorScheme;
}

export const AddAllyModal: React.FC<AddAllyModalProps> = ({ isVisible, onClose, onSave, colors }) => {
  const [name, setName] = useState('');
  const [face, setFace] = useState('');
  const [invocation, setInvocation] = useState('');
  const [func, setFunc] = useState('');
  const [shadow, setShadow] = useState('');
  const [ritual, setRitual] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, face || '✨', invocation, func, shadow, ritual);
      // Reset form
      setName('');
      setFace('');
      setInvocation('');
      setFunc('');
      setShadow('');
      setRitual('');
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.bg }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Ally</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Name* (e.g., Caffeine, Sunlight)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setName}
                value={name}
                placeholder="Ally Name"
                placeholderTextColor={colors.dim}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Face (Emoji Icon)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setFace}
                value={face}
                placeholder="✨"
                placeholderTextColor={colors.dim}
                maxLength={2}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Invocation (How you call it to action)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setInvocation}
                value={invocation}
                placeholder="A gentle nudge"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Function (What it does for you)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setFunc}
                value={func}
                placeholder="Boosts focus and energy"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Shadow (The downside/risk)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setShadow}
                value={shadow}
                placeholder="Jitters, crash, dependence"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Ritual (How you use it mindfully)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setRitual}
                value={ritual}
                placeholder="Only before 12pm, with a glass of water"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.dim }]}
              onPress={onClose}
            >
              <Text style={[styles.textStyle, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={[styles.textStyle, { color: colors.card }]}>Save Ally</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- EditAllyModal (New) ---

interface EditAllyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (ally: Ally) => void;
  colors: ColorScheme;
  ally: Ally;
}

export const EditAllyModal: React.FC<EditAllyModalProps> = ({ isVisible, onClose, onSave, colors, ally }) => {
  const [name, setName] = useState(ally.name);
  const [face, setFace] = useState(ally.face);
  const [invocation, setInvocation] = useState(ally.invocation);
  const [func, setFunc] = useState(ally.function);
  const [shadow, setShadow] = useState(ally.shadow);
  const [ritual, setRitual] = useState(ally.ritual);

  useEffect(() => {
    if (ally) {
      setName(ally.name);
      setFace(ally.face);
      setInvocation(ally.invocation);
      setFunc(ally.function);
      setShadow(ally.shadow);
      setRitual(ally.ritual);
    }
  }, [ally]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        ...ally,
        name,
        face: face || '✨',
        invocation,
        function: func,
        shadow,
        ritual,
      });
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.bg }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Ally: {ally.name}</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Name* (e.g., Caffeine, Sunlight)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setName}
                value={name}
                placeholder="Ally Name"
                placeholderTextColor={colors.dim}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Face (Emoji Icon)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setFace}
                value={face}
                placeholder="✨"
                placeholderTextColor={colors.dim}
                maxLength={2}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Invocation (How you call it to action)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setInvocation}
                value={invocation}
                placeholder="A gentle nudge"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Function (What it does for you)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setFunc}
                value={func}
                placeholder="Boosts focus and energy"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Shadow (The downside/risk)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setShadow}
                value={shadow}
                placeholder="Jitters, crash, dependence"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Ritual (How you use it mindfully)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setRitual}
                value={ritual}
                placeholder="Only before 12pm, with a glass of water"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.dim }]}
              onPress={onClose}
            >
              <Text style={[styles.textStyle, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={[styles.textStyle, { color: colors.card }]}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- CraftMomentModal (Existing) ---

interface CraftMomentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (title: string, container: ContainerId, category: 'time' | 'situational' | 'uplift', body_cue: string, micro: string, desire: string) => void;
  colors: ColorScheme;
}

const containerOptions: { id: ContainerId; label: string }[] = [
  { id: 'morning', label: 'Morning Anchor' },
  { id: 'afternoon', label: 'Afternoon Anchor' },
  { id: 'evening', label: 'Evening Anchor' },
  { id: 'late', label: 'Late Anchor' },
];

const categoryOptions: { id: 'time' | 'situational' | 'uplift'; label: string }[] = [
  { id: 'time', label: 'Time-based Anchor' },
  { id: 'situational', label: 'Situational Grounding' },
  { id: 'uplift', label: 'Uplift & Expansion' },
];

export const CraftMomentModal: React.FC<CraftMomentModalProps> = ({ isVisible, onClose, onSave, colors }) => {
  const [title, setTitle] = useState('');
  const [selectedContainer, setSelectedContainer] = useState<ContainerId>('morning');
  const [selectedCategory, setSelectedCategory] = useState<'time' | 'situational' | 'uplift'>('time');
  const [bodyCue, setBodyCue] = useState('');
  const [micro, setMicro] = useState('');
  const [desire, setDesire] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title, selectedContainer, selectedCategory, bodyCue, micro, desire);
      // Reset form
      setTitle('');
      setSelectedContainer('morning');
      setSelectedCategory('time');
      setBodyCue('');
      setMicro('');
      setDesire('');
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.bg }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Craft a Moment</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Moment Title* (e.g., Hydrate, Stretch)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setTitle}
                value={title}
                placeholder="A simple, meaningful action"
                placeholderTextColor={colors.dim}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Container Type</Text>
              <View style={styles.radioGroup}>
                {categoryOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.radio,
                      { borderColor: colors.dim, backgroundColor: selectedCategory === option.id ? colors.accent : colors.card },
                    ]}
                    onPress={() => setSelectedCategory(option.id)}
                  >
                    <Text style={{ color: selectedCategory === option.id ? colors.card : colors.text }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedCategory === 'time' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.dim }]}>Time Container</Text>
                <View style={styles.radioGroup}>
                  {containerOptions.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.radio,
                        { 
                          borderColor: colors.dim, 
                          backgroundColor: selectedContainer === option.id ? colors.accent : colors.card,
                          flex: 1,
                        },
                      ]}
                      onPress={() => setSelectedContainer(option.id)}
                    >
                      <Text style={{ color: selectedContainer === option.id ? colors.card : colors.text }}>
                        {option.label.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Body Cue (The trigger)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setBodyCue}
                value={bodyCue}
                placeholder="When I feel a slump in energy..."
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Micro-Action (The smallest step)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setMicro}
                value={micro}
                placeholder="One deep breath"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.dim }]}>Desire (The underlying motivation)</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.dim, color: colors.text, backgroundColor: colors.card }]}
                onChangeText={setDesire}
                value={desire}
                placeholder="To feel present and grounded"
                placeholderTextColor={colors.dim}
                multiline
              />
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.dim }]}
              onPress={onClose}
            >
              <Text style={[styles.textStyle, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={handleSave}
              disabled={!title.trim()}
            >
              <Text style={[styles.textStyle, { color: colors.card }]}>Craft Moment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- Styles (Shared) ---

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: '80%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    opacity: 1, // Will be handled by disabled prop on TouchableOpacity
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radio: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
});
