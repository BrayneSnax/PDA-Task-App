import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContainerItem, ColorScheme } from '../constants/Types';

interface Props {
  item: ContainerItem;
  completed: boolean;
  onToggle: () => void;
  colors: ColorScheme;
  onPress: () => void; // New prop to handle press
  onDelete: () => void; // New prop to handle long press delete
}

export const AnchorCard = React.memo(({ item, completed, onToggle, colors, onPress, onDelete }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress} // Use the new onPress prop
      onLongPress={onDelete} // Use the new onLongPress prop for deletion
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
        {/* Aesthetic elements for the new card look */}
        <Text style={[styles.chevron, { color: colors.dim }]}>
          {item.category === 'time' ? '🌅' : item.category === 'situational' ? '⚡' : '✨'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  // Removed header style since the whole card is now the touchable area

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16, // Add padding to the row now that it's the main content
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
    fontSize: 20, // Make the icon larger
    fontWeight: '300',
  },
  // Removed all detail-related styles as they are now in TaskDetailScreen

});