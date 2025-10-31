import { useState, useEffect } from 'react';
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

// Updated modal with text inputs instead of dropdowns
export const SubstanceSynthesisModal = ({ isVisible, onClose, momentData }: Props) => {
  const colors = useColors(momentData?.container || 'morning');
  const { addSubstanceMoment } = useApp();

  const [synthesisState, setSynthesisState] = useState({
    intention: '',
    sensation: '',
    reflection: '',
    synthesis: '',
  });

  useEffect(() => {
    if (isVisible && momentData) {
      setSynthesisState({
        intention: '',
        sensation: '',
        reflection: '',
        synthesis: '',
      });
    }
  }, [isVisible]);

  const handleSave = () => {
    if (!synthesisState.intention || !synthesisState.sensation || !synthesisState.reflection) {
      alert('Please fill in Intention, Sensation, and Reflection before saving.');
      return;
    }

    const finalMoment: Omit<Moment, 'id' | 'timestamp' | 'date'> = {
      ...momentData,
      // Map new fields to Moment type structure
      tone: synthesisState.intention,
      frequency: synthesisState.sensation,
      presence: synthesisState.reflection,
      context: synthesisState.synthesis,
      action_reflection: '',
      result_shift: '',
      conclusion_offering: '',
      text: momentData.text || 'Substance moment recorded',
      container: momentData.container || 'morning',
    } as Omit<Moment, 'id' | 'timestamp' | 'date'>;

    addSubstanceMoment(finalMoment);
    onClose();
  };

  const handleTextChange = (key: keyof typeof synthesisState, value: string) => {
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
            Reflect on the Moment.
          </Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.checkInSection}>
              <Text style={[styles.sectionTitle, { color: colors.accent }]}>THE 3-PART CHECK-IN</Text>

              <View style={styles.horizontalFieldsRow}>
                <View style={styles.horizontalField}>
                  <Text style={[styles.label, { color: colors.text }]}>Intention</Text>
                  <TextInput
                    style={[styles.textInput, styles.miniTextInput, { color: colors.text, backgroundColor: colors.bg, borderColor: colors.dim }]}
                    placeholder="..."
                    placeholderTextColor={colors.dim}
                    value={synthesisState.intention}
                    onChangeText={(text) => handleTextChange('intention', text)}
                  />
                </View>

                <View style={styles.horizontalField}>
                  <Text style={[styles.label, { color: colors.text }]}>Sensation</Text>
                  <TextInput
                    style={[styles.textInput, styles.miniTextInput, { color: colors.text, backgroundColor: colors.bg, borderColor: colors.dim }]}
                    placeholder="..."
                    placeholderTextColor={colors.dim}
                    value={synthesisState.sensation}
                    onChangeText={(text) => handleTextChange('sensation', text)}
                  />
                </View>

                <View style={styles.horizontalField}>
                  <Text style={[styles.label, { color: colors.text }]}>Reflection</Text>
                  <TextInput
                    style={[styles.textInput, styles.miniTextInput, { color: colors.text, backgroundColor: colors.bg, borderColor: colors.dim }]}
                    placeholder="..."
                    placeholderTextColor={colors.dim}
                    value={synthesisState.reflection}
                    onChangeText={(text) => handleTextChange('reflection', text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.promptSection}>
              <Text style={[styles.guidedReflectionTitle, { color: colors.accent }]}>GUIDED REFLECTION</Text>
              <Text style={[styles.promptTitle, { color: colors.text }]}>Synthesis & Invocation</Text>
              <TextInput
                style={[styles.textInput, styles.largeTextInput, { color: colors.text, backgroundColor: colors.bg, borderColor: colors.dim }]}
                placeholder="Trace the atmosphere of the ritual — sensations, emotions, and any shift that followed..."
                placeholderTextColor={colors.dim}
                value={synthesisState.synthesis}
                onChangeText={(text) => handleTextChange('synthesis', text)}
                multiline
                numberOfLines={8}
              />
            </View>
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
  horizontalFieldsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  horizontalField: {
    flex: 1,
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
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
  },
  miniTextInput: {
    minHeight: 44,
  },
  largeTextInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  promptSection: {
    marginBottom: 20,
  },
  guidedReflectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
