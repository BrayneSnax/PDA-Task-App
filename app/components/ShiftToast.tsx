import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorScheme } from '../constants/Types';

interface ShiftToastProps {
  isVisible: boolean;
  colors: ColorScheme;
  onDismiss: () => void;
}

export const ShiftToast: React.FC<ShiftToastProps> = ({ 
  isVisible, 
  colors,
  onDismiss 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (isVisible) {
      // Fade in and slide down gently
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        dismissToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 500,
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
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={dismissToast}
        style={[
          styles.toast,
          { 
            backgroundColor: colors.card,
            borderColor: colors.accent + '30',
          },
        ]}
      >
        <Text style={[styles.text, { color: colors.dim }]}>
          feel that shift?
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1001,
    alignItems: 'center',
  },
  toast: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});
