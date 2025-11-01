import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorScheme, ContainerId } from '../constants/Types';

interface ShiftToastProps {
  isVisible: boolean;
  colors: ColorScheme;
  container: ContainerId;
  onDismiss: () => void;
}

// Get time-of-day background color for toast
const getToastBackground = (container: ContainerId) => {
  const backgrounds = {
    morning: '#D4A574E6',
    afternoon: '#5FA8B8E6',
    evening: '#E8B4A8E6',
    late: '#8B9DC3E6',
  };
  return backgrounds[container] || backgrounds.morning;
};

export const ShiftToast: React.FC<ShiftToastProps> = ({ 
  isVisible, 
  colors,
  container,
  onDismiss 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current; // Slide up from bottom
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const ringPulseAnim = useRef(new Animated.Value(0)).current; // Ring pulse animation

  useEffect(() => {
    if (isVisible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      scaleAnim.setValue(0.95);
      ringPulseAnim.setValue(0);

      // Fade in and slide up gently
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Ring pulse animation - expands outward like a soft wave
      Animated.timing(ringPulseAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after 2 seconds (matching "did it" duration)
      const timer = setTimeout(() => {
        dismissToast();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!isVisible && fadeAnim._value === 0) return null;

  const ringScale = ringPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });

  const ringOpacity = ringPulseAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.6, 0.3, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* Ring pulse - expands outward like a soft wave */}
      <Animated.View
        style={[
          styles.ringPulse,
          {
            borderColor: getToastBackground(container).slice(0, 7) + '80',
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={dismissToast}
        style={[
          styles.toast,
          { 
            backgroundColor: getToastBackground(container),
            borderColor: colors.accent + '30',
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>
          Completion hums softly through the weave.
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 1001,
    alignItems: 'center',
  },
  ringPulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 18,
  },
});
