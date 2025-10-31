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
        <Text style={[styles.fieldLabel, { color: colors.dim, marginTop: 4 }]}>Act</Text>
        
        {/* Convince Yourself Block - Medium */}
        <View style={[styles.softBlock, styles.mediumBlock, { backgroundColor: colors.card, borderColor: colors.dim, marginTop: 2 }]}>
          <Text style={[styles.softText, styles.mediumText, { color: colors.text }]}>{item.micro || 'No convincing provided'}</Text>
        </View>
        
        {/* Reflect Label */}
        {item.desire && (
          <>
            <Text style={[styles.fieldLabel, { color: colors.dim, marginTop: 4 }]}>Reflect</Text>
            <View style={[styles.softBlock, styles.smallBlock, { backgroundColor: colors.card, borderColor: colors.dim, marginTop: 2 }]}>
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
	    paddingHorizontal: 16,
	    paddingTop: 12, // Reduced from 16
	  },
  backButton: {
	    paddingVertical: 6, // Reduced from 8
	    marginBottom: 10, // Reduced from 16
	  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
	    fontSize: 22, // Increased from 20
	    fontWeight: '700',
	    marginBottom: 4, // Reduced from 6
	  },
  fieldLabel: {
    fontSize: 11, // Increased from 10
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2, // Reduced from 3
    marginTop: 2, // Reduced from 4
  },
  scrollContent: {
    paddingBottom: 40, // Space for the bottom nav/tab bar
  },
  softBlock: {
    borderRadius: 12,
	    padding: 12, // Increased from 10
	    marginBottom: 4, // Reduced from 8
	    borderWidth: 1,
	  },
  largeBlock: {
    minHeight: 70, // Increased from 60
    padding: 12,
  },
  mediumBlock: {
    minHeight: 58, // Increased from 50
    padding: 12,
  },
  smallBlock: {
    minHeight: 46, // Increased from 40
    padding: 10, // Increased from 8
  },
  softText: {
	    fontSize: 14, // Increased from 13
	    fontWeight: '600',
	    lineHeight: 19, // Increased from 18
	  },
  largeText: {
    fontSize: 17, // Increased from 15
    fontWeight: '600',
    lineHeight: 22, // Increased from 20
  },
  mediumText: {
    fontSize: 15, // Increased from 14
    fontWeight: '600',
    lineHeight: 20, // Increased from 19
  },
  smallText: {
    fontSize: 14, // Increased from 13
    fontWeight: '500',
    lineHeight: 19, // Increased from 18
  },
  microLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
	  didItButton: {
	    width: '100%',
	    paddingVertical: 12, // Increased from 10
	    marginBottom: 4, // Reduced from 6
	  },
	  didItText: {
	    fontSize: 17, // Increased from 16
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
	    paddingVertical: 10, // Increased from 8
	    alignItems: 'center',
	    justifyContent: 'center',
	    marginBottom: 4, // Reduced from 6
	  },
  actionText: {
    fontSize: 15, // Increased from 14
    fontWeight: '500',
  },
  noteInput: {
	    minHeight: 40, // Increased from 35
	    borderRadius: 12,
	    padding: 12, // Increased from 10
	    marginBottom: 4, // Reduced from 8
	    marginTop: 2, // Reduced from 4
	    borderWidth: 1,
	    fontSize: 14, // Increased from 12
	    lineHeight: 18, // Increased from 16
	  },
});
