import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
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
  { key: 'context', title: 'The Setting of the Altar', placeholder: 'Describe the physical and emotional landscape before the moment (Where were you? What was the dominant feeling?)' },
  { key: 'action_reflection', title: 'The Invocation', placeholder: 'How did the ritual feel in the body? What was the most impactful part of the Ally/Anchor use?' },
  { key: 'result_shift', title: 'The Field Report', placeholder: 'What was the single most surprising or notable shift in your state? What did the Ally/Anchor teach you in this moment?' },
  { key: 'conclusion_offering', title: 'The Offering', placeholder: 'What is the one truth or lesson you will carry forward from this Moment?' },
];

const checkInOptions = {
  tone: ['Lighter', 'Same', 'Spikier'],
  frequency: ['Water', 'Light', 'Movement', 'Sound', 'Novelty', 'Social'],
  presence: ['Focused', 'Scattered', 'Present', 'Distant'],
};

export const JournalisticSynthesisModal = ({ isVisible, onClose, momentData }: Props) => {
  const colors = useColors(momentData?.container || 'morning');
  const { addMoment } = useApp();

  const [synthesisState, setSynthesisState] = useState({
    context: '',
    action_reflection: '',
    result_shift: '',
    conclusion_offering: '',
    tone: '',
    frequency: '',
    presence: '',
  });

  useEffect(() => {
    if (isVisible && momentData) {
      // Reset state when modal opens
      setSynthesisState({
        context: '',
        action_reflection: '',
        result_shift: '',
        conclusion_offering: '',
        tone: '',
        frequency: '',
        presence: '',
      });
    }
  }, [isVisible]);

  const handleSave = () => {
    if (!synthesisState.tone || !synthesisState.frequency || !synthesisState.presence) {
      // Basic validation for the 3 core fields
      alert('Please select Tone, Frequency, and Presence before saving.');
      return;
    }

    const finalMoment: Omit<Moment, 'id' | 'timestamp' | 'date'> = {
      ...momentData,
      ...synthesisState,
      text: momentData.text || 'Moment recorded', // Fallback text
      container: momentData.container || 'morning', // Fallback container
    } as Omit<Moment, 'id' | 'timestamp' | 'date'>; // Cast to ensure correct type

    addMoment(finalMoment);
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
          <Text style={[styles.modalTitle, { color: colors.text }]}>Journalistic Synthesis</Text>
          <Text style={[styles.modalSubtitle, { color: colors.dim }]}>
            Reflect on the Moment with guided prompts.
          </Text>

          <ScrollView style={styles.scrollView}>
            {/* The 3-Part Check-in (Tone, Frequency, Presence) */}
            <View style={styles.checkInSection}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>The 3-Part Check-in</Text>
              
              {/* Tone */}
              <Text style={[styles.promptLabel, { color: colors.text }]}>Tone (How did it feel?)</Text>
              <View style={styles.optionRow}>
                {checkInOptions.tone.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { backgroundColor: synthesisState.tone === option ? colors.accent : colors.bg },
                      { borderColor: colors.dim, borderWidth: 1 }
                    ]}
                    onPress={() => handleSelect('tone', option)}
                  >
                    <Text style={[styles.optionText, { color: synthesisState.tone === option ? colors.card : colors.text }]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Frequency */}
              <Text style={[styles.promptLabel, { color: colors.text, marginTop: 12 }]}>Frequency (What helped?)</Text>
              <View style={styles.optionRow}>
                {checkInOptions.frequency.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { backgroundColor: synthesisState.frequency === option ? colors.accent : colors.bg },
                      { borderColor: colors.dim, borderWidth: 1 }
                    ]}
                    onPress={() => handleSelect('frequency', option)}
                  >
                    <Text style={[styles.optionText, { color: synthesisState.frequency === option ? colors.card : colors.text }]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Presence */}
              <Text style={[styles.promptLabel, { color: colors.text, marginTop: 12 }]}>Presence (Where was your mind?)</Text>
              <View style={styles.optionRow}>
                {checkInOptions.presence.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { backgroundColor: synthesisState.presence === option ? colors.accent : colors.bg },
                      { borderColor: colors.dim, borderWidth: 1 }
                    ]}
                    onPress={() => handleSelect('presence', option)}
                  >
                    <Text style={[styles.optionText, { color: synthesisState.presence === option ? colors.card : colors.text }]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Guided Reflection Prompts */}
            <View style={styles.reflectionSection}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>Guided Reflection</Text>
              {synthesisPrompts.map(prompt => (
                <View key={prompt.key} style={styles.promptContainer}>
                  <Text style={[styles.promptLabel, { color: colors.text }]}>{prompt.title}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.bg, color: colors.text, borderColor: colors.dim }]}
                    placeholder={prompt.placeholder}
                    placeholderTextColor={colors.dim}
                    multiline
                    numberOfLines={4}
                    value={synthesisState[prompt.key as keyof typeof synthesisState] as string}
                    onChangeText={(text) => handleSelect(prompt.key as keyof typeof synthesisState, text)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.dim, borderWidth: 1 }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.accent }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: colors.card }]}>Synthesize Moment</Text>
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
    maxWidth: 600,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: '75%',
    paddingVertical: 10,
  },
  checkInSection: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc3',
  },
  reflectionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptContainer: {
    marginBottom: 15,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    borderWidth: 1,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

