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

      <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>{item.title}</Text>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}>
        {/* Notice Label */}
        <Text style={[styles.fieldLabel, { color: colors.dim }]}>Notice</Text>
        
        {/* Desire Block - Largest */}
        <View style={[styles.softBlock, styles.largeBlock, { backgroundColor: colors.card, borderColor: colors.dim }]}>
          <Text style={[styles.softText, styles.largeText, { color: colors.text }]}>{item.body_cue || 'No desire provided'}</Text>
        </View>

        {/* Act Label */}
        <Text style={[styles.fieldLabel, { color: colors.dim, marginTop: 8 }]}>Act</Text>
        
        {/* Convince Yourself Block - Medium */}
        <View style={[styles.softBlock, styles.mediumBlock, { backgroundColor: colors.card, borderColor: colors.dim, marginTop: 4 }]}>
          <Text style={[styles.softText, styles.mediumText, { color: colors.text }]}>{item.micro || 'No convincing provided'}</Text>
        </View>
        
        {/* Reflect Label */}
        {item.desire && (
          <>
            <Text style={[styles.fieldLabel, { color: colors.dim, marginTop: 8 }]}>Reflect</Text>
            <View style={[styles.softBlock, styles.smallBlock, { backgroundColor: colors.card, borderColor: colors.dim, marginTop: 4 }]}>
              <Text style={[styles.softText, styles.smallText, { color: colors.text }]}>{item.desire}</Text>
            </View>
          </>
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
	    fontSize: 20, // Compressed for no-scroll
	    fontWeight: '700',
	    marginBottom: 6, // Minimal margin
	  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
    marginTop: 4,
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
    minHeight: 60,
    padding: 10,
  },
  mediumBlock: {
    minHeight: 50,
    padding: 10,
  },
  smallBlock: {
    minHeight: 40,
    padding: 8,
  },
  softText: {
	    fontSize: 13, // Compressed
	    fontWeight: '600',
	    lineHeight: 18,
	  },
  largeText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  mediumText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },
  smallText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  microLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
	  didItButton: {
	    width: '100%',
	    paddingVertical: 10, // Compressed
	    marginBottom: 6,
	  },
	  didItText: {
	    fontSize: 16, // Smaller
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
	    paddingVertical: 8, // Compressed
	    alignItems: 'center',
	    justifyContent: 'center',
	    marginBottom: 6,
	  },
  actionText: {
    fontSize: 14, // Smaller
    fontWeight: '500',
  },
  noteInput: {
	    minHeight: 35, // Compressed
	    borderRadius: 12,
	    padding: 10,
	    marginBottom: 8,
	    marginTop: 4,
	    borderWidth: 1,
	    fontSize: 12,
	    lineHeight: 16,
	  },
});
