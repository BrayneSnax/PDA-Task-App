import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ContainerItem, ColorScheme } from '../constants/Types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  item: ContainerItem;
  colors: ColorScheme;
  onClose: () => void;
  onComplete: (status: 'did it' | 'skipped' | 'forgot' | 'couldn\'t' | 'not relevant', note: string) => void;
}

export const TaskDetailScreen = ({ item, colors, onClose, onComplete }: Props) => {
  const insets = useSafeAreaInsets();
	  const [note, setNote] = useState('');
	  const allActionButtons = ['skipped', 'forgot', 'couldn\'t', 'not relevant'];
	  const actionButtons = allActionButtons.slice(0, item.actionButtons || 4);  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingBottom: insets.bottom }]}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Text style={[styles.backText, { color: colors.text }]}>← back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}>
        {/* Desire Block - Largest */}
        <View style={[styles.softBlock, styles.largeBlock, { backgroundColor: colors.card, borderColor: colors.dim }]}>
          <Text style={[styles.softText, styles.largeText, { color: colors.text }]}>{item.body_cue || 'No desire provided'}</Text>
        </View>

        {/* Convince Yourself Block - Medium */}
        <View style={[styles.softBlock, styles.mediumBlock, { backgroundColor: colors.card, borderColor: colors.dim, marginTop: -10 }]}>
          <Text style={[styles.softText, styles.mediumText, { color: colors.text }]}>{item.micro || 'No convincing provided'}</Text>
        </View>
        
        {/* Result Block - Smallest */}
        {item.desire && (
          <View style={[styles.softBlock, styles.smallBlock, { backgroundColor: colors.card, borderColor: colors.dim, marginTop: -10 }]}>
            <Text style={[styles.softText, styles.smallText, { color: colors.text }]}>{item.desire}</Text>
          </View>
        )}

        {/* Note Input */}
        <TextInput
          style={[
            styles.noteInput,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.dim,
            },
          ]}
          placeholder="Sprawl text if the moment drives you..."
          placeholderTextColor={colors.dim}
          value={note}
          onChangeText={setNote}
          multiline={true}
          numberOfLines={2}
        />

	        {/* Action Buttons */}
	        <View style={styles.actionGrid}>
	          {/* Did It Button */}
	          <TouchableOpacity
	            style={[styles.actionButton, styles.didItButton, { backgroundColor: colors.accent }]}
	            onPress={() => onComplete('did it', note)}
	          >
	            <Text style={[styles.didItText, { color: colors.card }]}>did it</Text>
	          </TouchableOpacity>
	
	          {actionButtons.map((action) => (
	            <TouchableOpacity
	              key={action}
	              style={[
	                styles.actionButton,
	                {
	                  backgroundColor: colors.accent + '10',
	                  // Darken the 'not relevant' button to match the screenshot's faded look
	                  opacity: action === 'not relevant' ? 0.6 : 1,
	                },
	              ]}
	              onPress={() => onComplete(action as any, note)}
	            >
	              <Text style={[styles.actionText, { color: colors.text }]}>{action}</Text>
	            </TouchableOpacity>
	          ))}
	        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
	  container: {
	    flex: 1,
	    paddingHorizontal: 16, // Reduced padding
	    paddingTop: 16, // Reduced top padding
	  },
  backButton: {
	    paddingVertical: 8,
	    marginBottom: 16, // Reduced margin
	  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
	    fontSize: 24, // Further reduced font size
	    fontWeight: '700',
	    marginBottom: 10, // Further reduced margin
	  },
  scrollContent: {
    paddingBottom: 40, // Space for the bottom nav/tab bar
  },
  softBlock: {
    borderRadius: 12,
	    padding: 10, // Aggressively reduced padding
	    marginBottom: 8, // Aggressively reduced margin
	    borderWidth: 1,
	  },
  largeBlock: {
    minHeight: 100,
    padding: 16,
  },
  mediumBlock: {
    minHeight: 70,
    padding: 12,
  },
  smallBlock: {
    minHeight: 50,
    padding: 10,
  },
  softText: {
	    fontSize: 14, // Reduced font size
	    fontWeight: '600',
	  },
  largeText: {
    fontSize: 18,
    fontWeight: '700',
  },
  mediumText: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
    fontWeight: '500',
  },
  microLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
	  didItButton: {
	    // Overrides for the 'did it' button to make it full width and primary
	    width: '100%',
	    paddingVertical: 12, // Reduced padding
	    marginBottom: 8, // Reduced margin
	  },
	  didItText: {
	    fontSize: 20,
	    fontWeight: '700',
	    textTransform: 'uppercase',
	  },
  actionGrid: {
	    flexDirection: 'row',
	    flexWrap: 'wrap',
	    justifyContent: 'space-between',
	  },
	  actionButton: {
	    width: '48%',
	    borderRadius: 12,
	    paddingVertical: 10, // Reduced padding
	    alignItems: 'center',
	    justifyContent: 'center',
	    marginBottom: 8, // Reduced margin
	  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noteInput: {
	    minHeight: 40, // Reduced min height
	    borderRadius: 12,
	    padding: 12, // Reduced padding
	    marginBottom: 16, // Reduced margin
	    borderWidth: 1,
	    fontSize: 13, // Reduced font size
	    lineHeight: 18,
	  },
});
