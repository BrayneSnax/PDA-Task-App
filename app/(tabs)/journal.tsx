import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useApp } from '../context/AppContext';
import useColors from '../hooks/useColors';

export default function JournalScreen() {
  const { activeContainer, journalEntries } = useApp();
  const colors = useColors(activeContainer, true);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.containerTitle, { color: colors.text }]}>
          Field Transmissions
        </Text>
        <Text style={[styles.containerSubtitle, { color: colors.dim }]}>
          pattern recognition in progress
        </Text>

        {/* Placeholder for AI Pattern Recognition */}
        <View style={[styles.placeholderCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.placeholderIcon, { color: colors.accent }]}>🌌</Text>
          <Text style={[styles.placeholderTitle, { color: colors.text }]}>
            Pattern Recognition Module
          </Text>
          <Text style={[styles.placeholderText, { color: colors.dim }]}>
            This space will soon reveal the hidden rhythms in your practice — tracking how anchors, allies, and moments weave together across time.
          </Text>
          <Text style={[styles.placeholderText, { color: colors.dim, marginTop: 12 }]}>
            For now, your transmissions are being collected and stored, waiting for the pattern-weaver to arrive.
          </Text>
        </View>

        {/* Recent Transmissions */}
        <Text style={[styles.sectionHeader, { color: colors.dim, marginTop: 32 }]}>
          RECENT TRANSMISSIONS
        </Text>

        {journalEntries.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.dim }]}>
              No transmissions yet. Log your first interaction with an anchor or ally to begin.
            </Text>
          </View>
        ) : (
          journalEntries.slice(0, 10).map((entry) => (
            <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.card }]}>
              <View style={styles.entryHeader}>
                <Text style={[styles.entryTitle, { color: colors.text }]}>
                  {entry.allyName || entry.anchorTitle || 'Moment'}
                </Text>
                <Text style={[styles.entryDate, { color: colors.dim }]}>
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
              </View>
              
              {entry.tone && (
                <View style={styles.checkInRow}>
                  <Text style={[styles.checkInLabel, { color: colors.dim }]}>Tone:</Text>
                  <Text style={[styles.checkInValue, { color: colors.text }]}>{entry.tone}</Text>
                </View>
              )}
              
              {entry.frequency && (
                <View style={styles.checkInRow}>
                  <Text style={[styles.checkInLabel, { color: colors.dim }]}>Frequency:</Text>
                  <Text style={[styles.checkInValue, { color: colors.text }]}>{entry.frequency}</Text>
                </View>
              )}
              
              {entry.presence && (
                <View style={styles.checkInRow}>
                  <Text style={[styles.checkInLabel, { color: colors.dim }]}>Presence:</Text>
                  <Text style={[styles.checkInValue, { color: colors.text }]}>{entry.presence}</Text>
                </View>
              )}

              {entry.context && (
                <View style={styles.reflectionSection}>
                  <Text style={[styles.reflectionLabel, { color: colors.accent }]}>The Setting:</Text>
                  <Text style={[styles.reflectionText, { color: colors.text }]}>{entry.context}</Text>
                </View>
              )}

              {entry.result_shift && (
                <View style={styles.reflectionSection}>
                  <Text style={[styles.reflectionLabel, { color: colors.accent }]}>The Shift:</Text>
                  <Text style={[styles.reflectionText, { color: colors.text }]}>{entry.result_shift}</Text>
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  containerTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 16,
  },
  containerSubtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  placeholderCard: {
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  emptyCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  entryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  entryDate: {
    fontSize: 13,
  },
  checkInRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  checkInLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkInValue: {
    fontSize: 13,
  },
  reflectionSection: {
    marginTop: 12,
    gap: 4,
  },
  reflectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reflectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

