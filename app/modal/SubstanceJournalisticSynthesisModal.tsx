import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { ContainerId, ColorScheme, Moment } from '../constants/Types';
import { useApp } from '../context/AppContext';
import useColors from '../hooks/useColors';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  momentData: Partial<Moment>;
  colors: ColorScheme;
}

const synthesisPrompts = [
  { key: 'reflection', title: 'Reflection & Invocation', placeholder: 'Describe the physical and emotional landscape, and how the ritual felt in the body.' },
  { key: 'insight', title: 'Field Report & Offering', placeholder: 'What was the most surprising shift, and what is the one lesson you will carry forward?' },
];

const checkInOptions = {
  tone: ['Lighter', 'Same', 'Spikier'],
  frequency: ['Water', 'Light', 'Movement', 'Sound', 'Novelty', 'Social'],
  presence: ['Focused', 'Scattered', 'Present', 'Distant'],
};

export const SubstanceJournalisticSynthesisModal = ({ isVisible, onClose, momentData }: Props) => {
  const colors = useColors(momentData?.container || 'morning');
  const { addSubstanceMoment } = useApp();

  const [synthesisState, setSynthesisState] = useState({
    reflection: '',
    insight: '',
    tone: '',
    frequency: '',
    presence: '',
  });

  useEffect(() => {
    if (isVisible && momentData) {
      setSynthesisState({
        reflection: '',
        insight: '',
        tone: '',
        frequency: '',
        presence: '',
      });
    }
  }, [isVisible]);

  const handleSave = () => {
    if (!synthesisState.tone || !synthesisState.frequency || !synthesisState.presence) {
      alert('Please select Tone, Frequency, and Presence before saving.');
      return;
    }

    const finalMoment: Omit<Moment, 'id' | 'timestamp' | 'date'> = {
      ...momentData,
      ...synthesisState,
      context: synthesisState.reflection,
      action_reflection: '',
      result_shift: synthesisState.insight,
      conclusion_offering: '',
      text: momentData.text || 'Substance moment recorded',
      container: momentData.container || 'morning',
    } as Omit<Moment, 'id' | 'timestamp' | 'date'>;

    addSubstanceMoment(finalMoment);
    onClose();
  };

  const handleSelect = (key: keyof typeof synthesisState, value: string) => {
    setSynthesisState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.centeredView, { backgroundColor: colors.bg + 'CC' }]}>
        <View style={[styles.modalView, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Substance Journalistic Synthesis</Text>
          <Text style={[styles.modalSubtitle, { color: colors.dim }]}>
            Reflect on your substance experience with guided prompts.
          </Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.checkInSection}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>The 3-Part Check-in</Text>

              <Text style={[styles.label, { color: colors.text }]}>Tone</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.bg, borderColor: colors.dim }]}>
                <Picker
                  selectedValue={synthesisState.tone}
                  onValueChange={(value) => handleSelect('tone', value)}
                  style={[styles.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select..." value="" />
                  {checkInOptions.tone.map(option => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Frequency</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.bg, borderColor: colors.dim }]}>
                <Picker
                  selectedValue={synthesisState.frequency}
                  onValueChange={(value) => handleSelect('frequency', value)}
                  style={[styles.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select..." value="" />
                  {checkInOptions.frequency.map(option => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.label, { color: colors.text }]}>Presence</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.bg, borderColor: colors.dim }]}>
                <Picker
                  selectedValue={synthesisState.presence}
                  onValueChange={(value) => handleSelect('presence', value)}
                  style={[styles.picker, { color: colors.text }]}
                >
                  <Picker.Item label="Select..." value="" />
                  {checkInOptions.presence.map(option => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
            </View>

            {synthesisPrompts.map(prompt => (
              <View key={prompt.key} style={styles.promptSection}>
                <Text style={[styles.promptTitle, { color: colors.accent }]}>{prompt.title}</Text>
                <TextInput
                  style={[styles.textInput, { color: colors.text, backgroundColor: colors.bg, borderColor: colors.dim }]}
                  placeholder={prompt.placeholder}
                  placeholderTextColor={colors.dim}
                  value={synthesisState[prompt.key as keyof typeof synthesisState]}
                  onChangeText={(text) => handleSelect(prompt.key as keyof typeof synthesisState, text)}
                  multiline
                  numberOfLines={4}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.dim }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.card }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: colors.card }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 400,
  },
  checkInSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  promptSection: {
    marginBottom: 20,
  },
  promptTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {},
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
