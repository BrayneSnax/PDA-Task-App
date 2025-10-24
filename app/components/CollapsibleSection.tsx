import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ColorScheme } from '../constants/Types';

interface Props {
  title: string;
  icon?: string;
  children: ReactNode;
  colors: ColorScheme;
  defaultExpanded?: boolean;
}

export const CollapsibleSection = React.memo(({ 
  title, 
  icon, 
  children, 
  colors,
  defaultExpanded = false 
}: Props) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: colors.card }]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.title, { color: colors.dim }]}>{title}</Text>
        </View>
        <Text style={[styles.chevron, { color: colors.dim }]}>
          {expanded ? '∧' : '∨'}
        </Text>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chevron: {
    fontSize: 16,
    fontWeight: '300',
  },
  content: {
    gap: 8,
  },
});

