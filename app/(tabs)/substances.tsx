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
import { AddAllyModal, EditAllyModal } from '../modal';
import { JournalisticSynthesisModal } from '../modal/JournalisticSynthesisModal';

export default function SubstancesScreen() {
  const {
    allies,
    activeContainer,
    removeAlly,
    updateAlly,
    addAlly,
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
          Chemical Companions
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
      <JournalisticSynthesisModal
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
});

