import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ColorScheme } from '../constants/Types';

interface AddFoodModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (entry: {
    name: string;
    portion?: string;
    notes?: string;
    mood_before?: string;
    mood_after?: string;
    energy_level?: string;
  }) => void;
  colors: ColorScheme;
}

export function AddFoodModal({ isVisible, onClose, onSave, colors }: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [portion, setPortion] = useState('');
  const [notes, setNotes] = useState('');
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');
  const [energyLevel, setEnergyLevel] = useState<string>('');

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        portion: portion.trim() || undefined,
        notes: notes.trim() || undefined,
        mood_before: moodBefore.trim() || undefined,
        mood_after: moodAfter.trim() || undefined,
        energy_level: energyLevel || undefined,
      });
      // Reset form
      setName('');
      setPortion('');
      setNotes('');
      setMoodBefore('');
      setMoodAfter('');
      setEnergyLevel('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setPortion('');
    setNotes('');
    setMoodBefore('');
    setMoodAfter('');
    setEnergyLevel('');
    onClose();
  };

  const energyLevels = [
    { id: 'low', label: 'Low', icon: '🔋' },
    { id: 'medium', label: 'Medium', icon: '⚡' },
    { id: 'high', label: 'High', icon: '✨' },
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.bg }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Log Nourishment</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeButton, { color: colors.accent }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* What did you eat? */}
            <Text style={[styles.label, { color: colors.dim }]}>What did you eat?</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.dim + '40',
              }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Oatmeal with berries"
              placeholderTextColor={colors.dim}
            />

            {/* Portion (optional) */}
            <Text style={[styles.label, { color: colors.dim, marginTop: 16 }]}>Portion (optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.dim + '40',
              }]}
              value={portion}
              onChangeText={setPortion}
              placeholder="e.g., One bowl, small serving"
              placeholderTextColor={colors.dim}
            />

            {/* Energy Level */}
            <Text style={[styles.label, { color: colors.dim, marginTop: 16 }]}>Energy Level (optional)</Text>
            <View style={styles.energyGrid}>
              {energyLevels.map(level => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.energyButton,
                    { backgroundColor: colors.card },
                    energyLevel === level.id && { backgroundColor: colors.accent + '30', borderColor: colors.accent, borderWidth: 2 }
                  ]}
                  onPress={() => setEnergyLevel(level.id)}
                >
                  <Text style={styles.energyIcon}>{level.icon}</Text>
                  <Text style={[styles.energyLabel, { color: colors.text }]}>{level.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Mood Before (optional) */}
            <Text style={[styles.label, { color: colors.dim, marginTop: 16 }]}>How did you feel before? (optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.dim + '40',
              }]}
              value={moodBefore}
              onChangeText={setMoodBefore}
              placeholder="e.g., Hungry, tired, anxious"
              placeholderTextColor={colors.dim}
            />

            {/* Mood After (optional) */}
            <Text style={[styles.label, { color: colors.dim, marginTop: 16 }]}>How do you feel after? (optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.dim + '40',
              }]}
              value={moodAfter}
              onChangeText={setMoodAfter}
              placeholder="e.g., Satisfied, energized, calm"
              placeholderTextColor={colors.dim}
            />

            {/* Notes (optional) */}
            <Text style={[styles.label, { color: colors.dim, marginTop: 16 }]}>Notes (optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.dim + '40',
                minHeight: 80,
              }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any observations about this meal..."
              placeholderTextColor={colors.dim}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.card }]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={[styles.buttonText, { color: colors.card }]}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
  },
  scrollView: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  energyGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  energyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  energyIcon: {
    fontSize: 24,
  },
  energyLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {},
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

