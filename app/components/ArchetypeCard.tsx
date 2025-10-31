import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Archetype } from '../constants/Types';

interface ArchetypeCardProps {
  archetype: Archetype;
  onPress: () => void;
  colors: any;
}

export function ArchetypeCard({ archetype, onPress, colors }: ArchetypeCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card + 'CC' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{archetype.icon}</Text>
        <View style={styles.titleContainer}>
          <Text style={[styles.name, { color: colors.text }]}>{archetype.name}</Text>
          <Text style={[styles.subtitle, { color: colors.dim }]}>"{archetype.subtitle}"</Text>
        </View>
      </View>
      <Text style={[styles.bio, { color: colors.text }]} numberOfLines={2}>
        {archetype.bio}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
});
