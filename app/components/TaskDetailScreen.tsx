import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ContainerItem, ColorScheme, ContainerId } from '../constants/Types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  item: ContainerItem;
  colors: ColorScheme;
  container: ContainerId;
  onClose: () => void;
  onComplete: (status: 'did it' | 'skipped' | 'forgot' | 'couldn\'t' | 'not relevant', note: string) => void;
}

// Get time-of-day responsive glow for boxes
const getTimeGlowStyle = (container: ContainerId) => {
  const glowStyles = {
    morning: {
      backgroundColor: '#F5E6CC15',
      borderColor: '#F5E6CC40',
      shadowColor: '#F5E6CC',
      labelColor: '#F5E6CC',
    },
    afternoon: {
      backgroundColor: '#B0E0E612',
      borderColor: '#B0E0E635',
      shadowColor: '#B0E0E6',
      labelColor: '#B0E0E6',
    },
    evening: {
      backgroundColor: '#8C4B3F18',
      borderColor: '#8C4B3F45',
      shadowColor: '#8C4B3F',
      labelColor: '#E8B4A8',
    },
    late: {
      backgroundColor: '#3A3F4515',
      borderColor: '#3A3F4540',
      shadowColor: '#3A3F45',
      labelColor: '#8B9DC3',
    },
  };

  return glowStyles[container] || glowStyles.morning;
};

export const TaskDetailScreen = ({ item, colors, container, onClose, onComplete }: Props) => {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  const allActionButtons = ['skipped', 'forgot', 'couldn\'t', 'not relevant'];
  const actionButtons = allActionButtons.slice(0, item.actionButtons || 4);
  
  const timeGlow = getTimeGlowStyle(container);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingBottom: insets.bottom }]}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Text style={[styles.backText, { color: colors.text }]}>← back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>{item.title}</Text>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}>
        {/* Notice Block with label inside */}
        <View style={[
          styles.glowBlock,
          styles.largeBlock,
          {
            backgroundColor: timeGlow.backgroundColor,
            borderColor: timeGlow.borderColor,
            shadowColor: timeGlow.shadowColor,
          }
        ]}>
          <Text style={[styles.inlineLabel, { color: timeGlow.labelColor }]}>NOTICE</Text>
          <Text style={[styles.glowText, styles.largeText, { color: colors.text }]}>
            {item.body_cue || 'No notice provided'}
          </Text>
        </View>

        {/* Act Block with label inside */}
        <View style={[
          styles.glowBlock,
          styles.mediumBlock,
          {
            backgroundColor: timeGlow.backgroundColor,
            borderColor: timeGlow.borderColor,
            shadowColor: timeGlow.shadowColor,
          }
        ]}>
          <Text style={[styles.inlineLabel, { color: timeGlow.labelColor }]}>ACT</Text>
          <Text style={[styles.glowText, styles.mediumText, { color: colors.text }]}>
            {item.micro || 'No action provided'}
          </Text>
        </View>
        
        {/* Reflect Block with label inside (if exists) */}
        {item.desire && (
          <View style={[
            styles.glowBlock,
            styles.smallBlock,
            {
              backgroundColor: timeGlow.backgroundColor,
              borderColor: timeGlow.borderColor,
              shadowColor: timeGlow.shadowColor,
            }
          ]}>
            <Text style={[styles.inlineLabel, { color: timeGlow.labelColor }]}>REFLECT</Text>
            <Text style={[styles.glowText, styles.smallText, { color: colors.text }]}>
              {item.desire}
            </Text>
          </View>
        )}

        {/* Note Input - compact */}
        <TextInput
          style={[
            styles.noteInput,
            {
              backgroundColor: timeGlow.backgroundColor,
              color: colors.text,
              borderColor: timeGlow.borderColor,
            },
          ]}
          placeholder="Sprawl text if the moment drives you..."
          placeholderTextColor={colors.dim}
          value={note}
          onChangeText={setNote}
          multiline={true}
          numberOfLines={2}
        />

        {/* Action Buttons - compact grid */}
        <View style={styles.actionGrid}>
          {/* Did It Button - full width, prominent */}
          <TouchableOpacity
            style={[styles.actionButton, styles.didItButton, { backgroundColor: colors.accent }]}
            onPress={() => onComplete('did it', note)}
          >
            <Text style={[styles.didItText, { color: colors.bg }]}>DID IT</Text>
          </TouchableOpacity>

          {actionButtons.map((action) => (
            <TouchableOpacity
              key={action}
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.accent + '15',
                  borderColor: colors.accent + '30',
                  borderWidth: 1,
                  opacity: action === 'not relevant' ? 0.7 : 1,
                },
              ]}
              onPress={() => onComplete(action as any, note)}
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
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  backButton: {
    paddingVertical: 4,
    marginBottom: 4,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  // Label inside the bubble - centered, same color as text
  inlineLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.6, // Slightly dimmed but same color
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Organic glow blocks
  glowBlock: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  largeBlock: {
    minHeight: 82,
  },
  mediumBlock: {
    minHeight: 85,
  },
  smallBlock: {
    minHeight: 80,
  },
  glowText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center', // Center the content text too
  },
  largeText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  mediumText: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
  },
  smallText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },
  didItButton: {
    width: '100%',
    paddingVertical: 12,
    marginBottom: 6,
    borderRadius: 14,
  },
  didItText: {
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
  },
  actionButton: {
    width: '48%',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noteInput: {
    minHeight: 40,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 19,
  },
});
