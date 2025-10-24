import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ContainerItem, ColorScheme } from '../constants/Types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  item: ContainerItem;
  colors: ColorScheme;
  onClose: () => void;
  onComplete: () => void;
}

export const TaskDetailScreen = ({ item, colors, onClose, onComplete }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Text style={[styles.backText, { color: colors.text }]}>← back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Cue Block */}
        <View style={[styles.cueBlock, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.cueLabel, { color: colors.dim }]}>body cue:</Text>
          <Text style={[styles.cueText, { color: colors.text }]}>{item.body_cue || 'No main cue provided'}</Text>
        </View>

        {/* Micro Cue Block */}
        <View style={[styles.microBlock, { backgroundColor: colors.accent + '20' }]}>
          <Text style={[styles.microLabel, { color: colors.dim }]}>or try micro version:</Text>
          <Text style={[styles.microText, { color: colors.text }]}>{item.micro || 'No micro cue provided'}</Text>
        </View>
        
        {/* Optional Desire/Why Block */}
        {item.desire && (
          <View style={[styles.microBlock, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.microLabel, { color: colors.dim }]}>why:</Text>
            <Text style={[styles.microText, { color: colors.text }]}>{item.desire}</Text>
          </View>
        )}

        {/* Did It Button */}
        <TouchableOpacity
          style={[styles.didItButton, { backgroundColor: colors.accent }]}
          onPress={onComplete}
        >
          <Text style={[styles.didItText, { color: colors.card }]}>did it</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          {['skipped', 'forgot', 'couldn\'t', 'not relevant'].map((action, index) => (
            <TouchableOpacity
              key={action}
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.accent + '10',
                  // Darken the 'not relevant' button to match the screenshot's faded look
                  opacity: action === 'not relevant' ? 0.6 : 1,
                },
              ]}
              // Placeholder for actual action logic
              onPress={() => console.log(action)}
            >
              <Text style={[styles.actionText, { color: colors.text }]}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
  },
  scrollContent: {
    paddingBottom: 40, // Space for the bottom nav/tab bar
  },
  cueBlock: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cueLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  cueText: {
    fontSize: 18,
    fontWeight: '600',
  },
  microBlock: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  microLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  microText: {
    fontSize: 16,
    fontWeight: '500',
  },
  didItButton: {
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  didItText: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
