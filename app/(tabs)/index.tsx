import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import useColors from '../hooks/useColors';
import { formatTime, formatLongDate } from '../utils/time';
import { ContainerThemes } from '../constants/Colors';
import { TimeContainerSwitcher } from '../components/TimeContainerSwitcher';
import { AnchorCard } from '../components/AnchorCard';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { CraftMomentModal } from '../modal';

export default function HomeScreen() {
  const {
    items,
    activeContainer,
    setActiveContainer,
    toggleCompletion,
    isCompleted,
    loading,
    addItem,
  } = useApp();

  const colors = useColors(activeContainer, true);
  const [currentTime, setCurrentTime] = useState(formatTime());
  const [isCraftMomentModalVisible, setIsCraftMomentModalVisible] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // Filter items by container and category
  const timeAnchors = items.filter(
    item => item.container === activeContainer && item.category === 'time'
  );
  const situationalAnchors = items.filter(item => item.category === 'situational');
  const upliftAnchors = items.filter(item => item.category === 'uplift');

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Container Switcher */}
        <View style={{ paddingTop: 16, marginBottom: 16 }}>
          <TimeContainerSwitcher
            active={activeContainer}
            onSelect={setActiveContainer}
            colors={colors}
          />
        </View>

        {/* Time and Date Display */}
        <View style={styles.timeSection}>
          <View style={styles.timeRow}>
            <Text style={[styles.time, { color: colors.text }]}>{currentTime}</Text>
            <View style={[styles.themeCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.themeText, { color: colors.text }]}>
                {ContainerThemes[activeContainer]}
              </Text>
            </View>
          </View>
          <Text style={[styles.date, { color: colors.dim }]}>{formatLongDate()}</Text>
        </View>

        {/* Resonant Grounding Field */}
        <Text style={[styles.sectionHeader, { color: colors.dim }]}>
          RESONANT GROUNDING FIELD
        </Text>

        {/* Time-based Anchors - Collapsed by default */}
        <CollapsibleSection
          title={`${activeContainer.toUpperCase()} ANCHORS`}
          icon="☀️"
          colors={colors}
          defaultExpanded={false}
        >
          {timeAnchors.map(item => (
            <AnchorCard
              key={item.id}
              item={item}
              completed={isCompleted(item.id)}
              onToggle={() => toggleCompletion(item.id)}
              colors={colors}
            />
          ))}
        </CollapsibleSection>

        {/* Situational Grounding - Collapsed by default */}
        <CollapsibleSection
          title="SITUATIONAL GROUNDING"
          icon="⚡"
          colors={colors}
          defaultExpanded={false}
        >
          {situationalAnchors.map(item => (
            <AnchorCard
              key={item.id}
              item={item}
              completed={isCompleted(item.id)}
              onToggle={() => toggleCompletion(item.id)}
              colors={colors}
            />
          ))}
        </CollapsibleSection>

        {/* Uplift & Expansion - Collapsed by default */}
        <CollapsibleSection
          title="UPLIFT & EXPANSION"
          icon="✨"
          colors={colors}
          defaultExpanded={false}
        >
          {upliftAnchors.map(item => (
            <AnchorCard
              key={item.id}
              item={item}
              completed={isCompleted(item.id)}
              onToggle={() => toggleCompletion(item.id)}
              colors={colors}
            />
          ))}
        </CollapsibleSection>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomButtons, { backgroundColor: colors.bg }]}>
        <TouchableOpacity
          style={[styles.craftButton, { backgroundColor: colors.accent }]}
          onPress={() => setIsCraftMomentModalVisible(true)}
        >
          <Text style={[styles.craftButtonText, { color: colors.card }]}>
            + Craft a Moment
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <CraftMomentModal
        isVisible={isCraftMomentModalVisible}
        onClose={() => setIsCraftMomentModalVisible(false)}
        onSave={(title, container, category, body_cue, micro, desire) => {
          addItem({
            title,
            container,
            category,
            body_cue,
            micro,
            desire,
          });
        }}
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
  timeSection: {
    marginBottom: 32,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -1,
  },
  themeCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  themeText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  craftButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  craftButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

