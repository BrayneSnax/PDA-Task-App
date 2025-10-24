import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContainerId, ColorScheme } from '../constants/Types';

interface Props {
  active: ContainerId;
  onSelect: (container: ContainerId) => void;
  colors: ColorScheme;
}

const CONTAINERS: { id: ContainerId; label: string }[] = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
  { id: 'late', label: 'Late Night' },
];

export const TimeContainerSwitcher = React.memo(({ active, onSelect, colors }: Props) => {
  return (
    <View style={styles.container}>
      {CONTAINERS.map(container => {
        const isActive = container.id === active;
        return (
          <TouchableOpacity
            key={container.id}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.accent : 'transparent',
                borderColor: colors.dim,
              },
            ]}
            onPress={() => onSelect(container.id)}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isActive ? colors.card : colors.text,
                  fontWeight: isActive ? '600' : '400',
                },
              ]}
            >
              {container.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 15,
  },
});

