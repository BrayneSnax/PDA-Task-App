import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ColorScheme } from '../constants/Types';

type ActionType = 'did it' | 'skipped' | 'forgot' | 'couldn\'t' | 'not relevant';

interface ActionToastProps {
  isVisible: boolean;
  actionType: ActionType;
  colors: ColorScheme;
  onDismiss: () => void;
}

// Get message and duration for each action type
const getActionConfig = (actionType: ActionType) => {
  const configs: Record<ActionType, { message: string; duration: number; animation: string }> = {
    'did it': {
      message: 'Feel that shift?',
      duration: 2000,
      animation: 'fade',
    },
    'skipped': {
      message: "Noted. You're staying fluid.",
      duration: 1800,
      animation: 'ripple',
    },
    'forgot': {
      message: 'Forgetfulness is part of rhythm. Remembering returns.',
      duration: 2000,
      animation: 'shimmer',
    },
    "couldn't": {
      message: "The field holds what couldn't move today.",
      duration: 2000,
      animation: 'dim',
    },
    'not relevant': {
      message: 'Not every thread belongs here. Noted.',
      duration: 1500,
      animation: 'fade-through',
    },
  };

  return configs[actionType] || configs['did it'];
};

export const ActionToast: React.FC<ActionToastProps> = ({ 
  isVisible, 
  actionType,
  colors,
  onDismiss 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current; // Slide up from bottom
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const config = getActionConfig(actionType);

  useEffect(() => {
    if (isVisible) {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      scaleAnim.setValue(0.95);
      shimmerAnim.setValue(0);

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

      // Shimmer effect for "forgot" action
      if (config.animation === 'shimmer') {
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      }

      // Auto-dismiss based on action duration
      const timer = setTimeout(() => {
        dismissToast();
      }, config.duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, actionType]);

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

  // Apply different opacity based on animation type
  const getOpacityStyle = () => {
    if (config.animation === 'dim') {
      return fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.85], // Slightly dimmed
      });
    }
    if (config.animation === 'fade-through') {
      return fadeAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0], // Fade in then out
      });
    }
    return fadeAnim;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: getOpacityStyle(),
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          { 
            backgroundColor: colors.card + 'F0',
            borderColor: colors.accent + '25',
          },
        ]}
      >
        {/* Shimmer overlay for "forgot" */}
        {config.animation === 'shimmer' && (
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                opacity: shimmerAnim,
                backgroundColor: colors.accent + '20',
              },
            ]}
          />
        )}
        
        <Text style={[styles.text, { color: colors.text }]}>
          {config.message}
        </Text>
      </View>
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
    overflow: 'hidden',
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 18,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
