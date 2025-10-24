import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContainerItem, ColorScheme } from '../constants/Types';

interface Props {
  item: ContainerItem;
  completed: boolean;
  onToggle: () => void;
  colors: ColorScheme;
}

export const AnchorCard = React.memo(({ item, completed, onToggle, colors }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.row}>
          <TouchableOpacity
            onPress={onToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.bullet, { color: completed ? colors.accent : colors.dim }]}>
              {completed ? '✓' : '•'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.chevron, { color: colors.dim }]}>
            {expanded ? '∧' : '∨'}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          {item.body_cue && (
            <Text style={[styles.cue, { color: colors.dim }]}>{item.body_cue}</Text>
          )}
          {item.micro && (
            <View style={styles.microSection}>
              <Text style={[styles.microLabel, { color: colors.dim }]}>micro:</Text>
              <Text style={[styles.microText, { color: colors.text }]}>{item.micro}</Text>
            </View>
          )}
          {item.desire && (
            <View style={styles.desireSection}>
              <Text style={[styles.desireLabel, { color: colors.dim }]}>why:</Text>
              <Text style={[styles.desireText, { color: colors.text, fontStyle: 'italic' }]}>
                {item.desire}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 16,
    fontWeight: '300',
  },
  details: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 12,
  },
  cue: {
    fontSize: 14,
    lineHeight: 20,
  },
  microSection: {
    flexDirection: 'row',
    gap: 6,
  },
  microLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  microText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  desireSection: {
    flexDirection: 'row',
    gap: 6,
  },
  desireLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  desireText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});