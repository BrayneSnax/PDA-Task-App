import React, { useCallback } from 'react';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContainerItem, ColorScheme } from '../constants/Types';
import { getRandomNarrativePhrase, showMicroNote, triggerSoftPulseAnimation } from '../utils/feedback';

interface Props {
  item: ContainerItem;
  completed: boolean;
  onToggle: () => void;
  colors: ColorScheme;
  onPress: () => void; // New prop to handle press
  onDelete: () => void; // New prop to handle long press delete
}

export const AnchorCard = React.memo(({ item, completed, onToggle, colors, onPress, onDelete }: Props) => {
  const opacity = useSharedValue(1);

  const handleToggle = useCallback(() => {
    onToggle();
    if (!completed) {
      // Logic for completion: Somatic Layer & Narrative Layer
      const phrase = getRandomNarrativePhrase();
      showMicroNote(phrase);
      triggerSoftPulseAnimation(item.id);

      // Simple animation for the card itself (soft pulse effect)
      opacity.value = withTiming(0.95, { duration: 100 }, () => {
        opacity.value = withTiming(1, { duration: 300 });
      });
    }
  }, [completed, onToggle, item.id, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: opacity.value === 1 ? 1 : 0.98 }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, styles.animatedWrapper]}>
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress} // Use the new onPress prop
      onLongPress={onDelete} // Use the new onLongPress prop for deletion
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.bullet, { color: completed ? colors.accent : colors.dim }]}>
            {completed ? '✓' : '•'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        {/* Aesthetic elements for the new card look */}
        <Text style={[styles.chevron, { color: colors.dim }]}>
          {item.category === 'time' ? '🌅' : item.category === 'situational' ? '⚡' : '✨'}
        </Text>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  animatedWrapper: {
    marginBottom: 10, // Added wrapper for animation and margin
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  // Removed header style since the whole card is now the touchable area

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16, // Add padding to the row now that it's the main content
  },
  bullet: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20, // Make the icon larger
    fontWeight: '300',
  },
  // Removed all detail-related styles as they are now in TaskDetailScreen

});