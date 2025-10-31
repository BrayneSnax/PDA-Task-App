import React, { useCallback, useState } from 'react';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { ContainerItem, ColorScheme } from '../constants/Types';
import { getRandomNarrativePhrase, showMicroNote, triggerSoftPulseAnimation } from '../utils/feedback';

interface Props {
  item: ContainerItem;
  completed: boolean;
  onToggle: () => void;
  colors: ColorScheme;
  onPress: () => void;
  onDelete: () => void;
  onEdit?: () => void; // Optional edit handler
}

export const AnchorCard = React.memo(({ item, completed, onToggle, colors, onPress, onDelete, onEdit }: Props) => {
  const opacity = useSharedValue(1);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = useCallback(() => {
    onToggle();
    if (!completed) {
      // Logic for completion: Somatic Layer & Narrative Layer
      const phrase = getRandomNarrativePhrase();
      showMicroNote(phrase);
      triggerSoftPulseAnimation(item.id);

      // Simple animation for the card itself (soft pulse effect)
      opacity.value = withTiming(0.95, { duration: 100 }, () => {
        opacity.value = withTiming(1, { duration: 300 });
      });
    }
  }, [completed, onToggle, item.id, opacity]);

  const handleLongPress = useCallback(() => {
    setShowMenu(true);
  }, []);

  const handleEdit = useCallback(() => {
    setShowMenu(false);
    if (onEdit) {
      onEdit();
    }
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    setShowMenu(false);
    onDelete();
  }, [onDelete]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: opacity.value === 1 ? 1 : 0.98 }],
    };
  });

  return (
    <>
      <Animated.View style={[animatedStyle, styles.animatedWrapper]}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={onPress}
          onLongPress={handleLongPress}
          activeOpacity={0.7}
        >
          <View style={styles.row}>
            <TouchableOpacity
              onPress={handleToggle}
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
      </Animated.View>

      {/* Edit/Delete Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
            
            {onEdit && (
              <TouchableOpacity
                style={[styles.menuButton, { borderBottomColor: colors.dim }]}
                onPress={handleEdit}
              >
                <Text style={[styles.menuButtonText, { color: colors.accent }]}>Edit</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.menuButton}
              onPress={handleDelete}
            >
              <Text style={[styles.menuButtonText, { color: '#ff4444' }]}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.menuButton, { marginTop: 8 }]}
              onPress={() => setShowMenu(false)}
            >
              <Text style={[styles.menuButtonText, { color: colors.dim }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  animatedWrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  bullet: {
    fontSize: 20,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
