import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ally, ColorScheme } from '../constants/Types';

interface Props {
  ally: Ally;
  onEdit: (ally: Ally) => void;
  onRemove: () => void;
  onLogUse: () => void;
  colors: ColorScheme;
}

export const AllyCard = React.memo(({ ally, onEdit, onRemove, onLogUse, colors }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={{ flex: 1 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.name, { color: colors.text }]}>
            {ally.face} {ally.name}
          </Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onEdit(ally)}
            style={[styles.editButton, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.editButtonText, { color: colors.card }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onRemove}
            style={[styles.deleteButton, { borderColor: colors.dim }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.deleteText, { color: colors.dim }]}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={styles.details}>
          <Text style={[styles.invocation, { color: colors.accent, fontStyle: 'italic' }]}>
            "{ally.invocation}"
          </Text>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.dim }]}>Function:</Text>
            <Text style={[styles.text, { color: colors.text }]}>{ally.function}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.dim }]}>Shadow:</Text>
            <Text style={[styles.text, { color: colors.text }]}>{ally.shadow}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.dim }]}>Ritual:</Text>
            <Text style={[styles.text, { color: colors.text }]}>{ally.ritual}</Text>
          </View>

          <TouchableOpacity
            onPress={onLogUse}
            style={[styles.logButton, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.logButtonText, { color: colors.card }]}>+ log interaction</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 22,
    fontWeight: '300',
    marginTop: -2,
  },
  details: {
    marginTop: 16,
    gap: 14,
  },
  invocation: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  logButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  logButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});