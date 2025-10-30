import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import useColors from '../hooks/useColors';
import { AllyCard } from '../components/AllyCard';
// ⧈replace-start:imports
import { AddAllyModal, EditAllyModal, SubstanceJournalisticSynthesisModal } from '../modal';
// ⧈replace-end:imports

export default function SubstancesScreen() {
  const {
    allies,
    activeContainer,
    removeAlly,
    updateAlly,
    addAlly,
    substanceJournalEntries,
    loading,
  } = useApp();

  const colors = useColors(activeContainer, true);
  const [isAddAllyModalVisible, setIsAddAllyModalVisible] = useState(false);
  const [isEditAllyModalVisible, setIsEditAllyModalVisible] = useState(false);
  const [isSynthesisModalVisible, setIsSynthesisModalVisible] = useState(false);
  const [allyToEdit, setAllyToEdit] = useState(null);
  const [momentToSynthesize, setMomentToSynthesize] = useState<any>({});

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.containerTitle, { color: colors.text }]}>
          Substances
        </Text>
        <Text style={[styles.containerSubtitle, { color: colors.dim }]}>
          your living pharmacopoeia
        </Text>

        <Text style={[styles.sectionHeader, { color: colors.dim, marginTop: 24 }]}>
          YOUR SUBSTANCES
        </Text>

        {allies.map(ally => (
          <AllyCard
            key={ally.id}
            ally={ally}
            onEdit={(ally) => {
              setAllyToEdit(ally);
              setIsEditAllyModalVisible(true);
            }}
            onRemove={() => removeAlly(ally.id)}
            onLogUse={() => {
              setMomentToSynthesize({
                allyId: ally.id,
                allyName: ally.name,
                container: activeContainer,
                text: `Used ${ally.name}`,
              });
              setIsSynthesisModalVisible(true);
            }}
            colors={colors}
          />
        ))}

        <TouchableOpacity
          style={[styles.addAllyButton, { backgroundColor: colors.accent }]}
          onPress={() => setIsAddAllyModalVisible(true)}
        >
          <Text style={[styles.addAllyText, { color: colors.card }]}>+ Add New Companion</Text>
        </TouchableOpacity>

        {/* Substances Journal Section */}
        <Text style={[styles.sectionHeader, { color: colors.dim, marginTop: 32 }]}>
          SUBSTANCE TRANSMISSIONS
        </Text>
        <Text style={[styles.journalSubtitle, { color: colors.dim, marginBottom: 16 }]}>
          Your personal log of substance experiences
        </Text>

        {substanceJournalEntries.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyText, { color: colors.dim }]}>
              No substance transmissions yet. Log your first interaction to begin.
            </Text>
          </View>
        ) : (
          substanceJournalEntries.slice(0, 10).map((entry) => (
            <View key={entry.id} style={[styles.entryCard, { backgroundColor: colors.card }]}>
              <View style={styles.entryHeader}>
                <Text style={[styles.entryTitle, { color: colors.text }]}>
                  {entry.allyName || 'Substance Moment'}
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
                  <Text style={[styles.reflectionLabel, { color: colors.accent }]}>Reflection:</Text>
                  <Text style={[styles.reflectionText, { color: colors.text }]}>{entry.context}</Text>
                </View>
              )}

              {entry.result_shift && (
                <View style={styles.reflectionSection}>
                  <Text style={[styles.reflectionLabel, { color: colors.accent }]}>Insight:</Text>
                  <Text style={[styles.reflectionText, { color: colors.text }]}>{entry.result_shift}</Text>
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Modals */}
      <AddAllyModal
        isVisible={isAddAllyModalVisible}
        onClose={() => setIsAddAllyModalVisible(false)}
        onSave={(name, face, invocation, func, shadow, ritual) => {
          addAlly({
            name,
            face,
            invocation,
            function: func,
            shadow,
            ritual,
            log: [],
          });
        }}
        colors={colors}
      />
      {allyToEdit && (
        <EditAllyModal
          isVisible={isEditAllyModalVisible}
          onClose={() => {
            setIsEditAllyModalVisible(false);
            setAllyToEdit(null);
          }}
          onSave={(ally) => {
            updateAlly(ally);
          }}
          colors={colors}
          ally={allyToEdit}
        />
      )}
      <SubstanceJournalisticSynthesisModal
        isVisible={isSynthesisModalVisible}
        onClose={() => {
          setIsSynthesisModalVisible(false);
          setMomentToSynthesize({});
        }}
        momentData={momentToSynthesize}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  addAllyButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  addAllyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  journalSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
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