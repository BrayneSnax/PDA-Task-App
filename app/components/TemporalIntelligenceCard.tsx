import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ColorScheme } from '../constants/Types';

interface Props {
  colors: ColorScheme;
}

// Initial message for the card, as the adaptive state is a future feature.
const getInitialMessage = () => {
  return "The system is listening. As patterns emerge, I will offer a quiet observation here.";
};

export const TemporalIntelligenceCard = React.memo(({ colors }: Props) => {
  const message = getInitialMessage(); // In a future version, this would be dynamic

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.dim }]}>
      <Text style={[styles.title, { color: colors.dim }]}>
        THE FIELD'S WHISPER
      </Text>
      <Text style={[styles.message, { color: colors.text }]}>
        {message}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 18, // Consistent with other card styles
    padding: 16,
    marginBottom: 24,
    borderWidth: 1, // Use a subtle border to differentiate it from other cards
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

