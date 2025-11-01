import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';

interface ThresholdCardProps {
  isVisible: boolean;
  fromContainer: ContainerId;
  toContainer: ContainerId;
  colors: ColorScheme;
  onDismiss: () => void;
}

// Ritual prompts for each transition
const THRESHOLD_RITUALS: Record<string, string[]> = {
  'morning-afternoon': [
    'The sun climbs higher. Wash your hands under warm water.',
    'Midday approaches. Take three breaths at the window.',
    'Energy shifts upward. Stretch your shoulders once.',
  ],
  'afternoon-evening': [
    'Light begins to soften. Dim one lamp.',
    'The day releases its grip. Place your hand on your heart.',
    'Dusk settles in. Look once toward the horizon.',
  ],
  'evening-late': [
    'Stillness deepens. Close one door gently.',
    'Night arrives. Light a candle or turn off a screen.',
    'The day completes itself. Whisper "thank you".',
  ],
  'late-morning': [
    'Dawn returns. Open a window to fresh air.',
    'A new cycle begins. Drink water slowly.',
    'You wake again. Say your name aloud.',
  ],
};

const getTransitionKey = (from: ContainerId, to: ContainerId): string => {
  return `${from}-${to}`;
};

const getRandomRitual = (from: ContainerId, to: ContainerId): string => {
  const key = getTransitionKey(from, to);
  const rituals = THRESHOLD_RITUALS[key] || ['Time shifts. Pause for a moment.'];
  return rituals[Math.floor(Math.random() * rituals.length)];
};

const getContainerLabel = (container: ContainerId): string => {
  const labels: Record<ContainerId, string> = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    late: 'Late',
  };
  return labels[container];
};

export const ThresholdCard: React.FC<ThresholdCardProps> = ({ 
  isVisible, 
  fromContainer,
  toContainer,
  colors,
  onDismiss 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const ritual = useRef(getRandomRitual(fromContainer, toContainer)).current;

  useEffect(() => {
    if (isVisible) {
      // Fade in and scale up gently
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 3 seconds (evaporates quickly)
      const timer = setTimeout(() => {
        dismissCard();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const dismissCard = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!isVisible && fadeAnim._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={dismissCard}
        style={styles.backdrop}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.accent + '20',
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.transition, { color: colors.dim }]}>
            {getContainerLabel(fromContainer)} → {getContainerLabel(toContainer)}
          </Text>
          
          <Text style={[styles.ritual, { color: colors.text }]}>
            {ritual}
          </Text>

          <TouchableOpacity
            onPress={dismissCard}
            style={[styles.dismissButton, { backgroundColor: colors.accent + '15' }]}
          >
            <Text style={[styles.dismissText, { color: colors.accent }]}>
              continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  transition: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  ritual: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: 28,
  },
  dismissButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  dismissText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
