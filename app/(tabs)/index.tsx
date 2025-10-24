import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { useApp } from '../context/AppContext';
import useColors from '../hooks/useColors';
import { formatTime, formatLongDate } from '../utils/time';
import { ContainerThemes } from '../constants/Colors';
import { TimeContainerSwitcher } from '../components/TimeContainerSwitcher';
import { AnchorCard } from '../components/AnchorCard';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { AllyCard } from '../components/AllyCard';
import { AddAllyModal, CraftMomentModal, EditAllyModal } from '../modal'; // Assuming these are correct imports
import { ContainerId } from '../constants/Types';

export default function PDATaskApp() {
  const {
    items,
    allies,
    activeContainer,
    setActiveContainer,
    toggleCompletion,
    isCompleted,
    removeAlly,
    logAllyUse,
    loading,
    addItem,
    updateAlly,
    addAlly,
  }
  = useApp();

  const colors = useColors(activeContainer, true); // true = use circadian colors
  const [currentTime, setCurrentTime] = useState(formatTime());
  // The user's navigation is handled by this state, which is not ideal for Expo Router,
  // but I must respect the existing code structure.
  const [currentScreen, setCurrentScreen] = useState<'home' | 'substances' | 'patterns'>('home'); 
  const [isAddAllyModalVisible, setIsAddAllyModalVisible] = useState(false);
  const [isCraftMomentModalVisible, setIsCraftMomentModalVisible] = useState(false);
  const [isEditAllyModalVisible, setIsEditAllyModalVisible] = useState(false);
  const [allyToEdit, setAllyToEdit] = useState(null);

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

  // --- RENDERING LOGIC ---

  // Renders the bottom navigation bar
  const renderNav = (active: 'home' | 'substances') => (
    <View style={[styles.nav, { backgroundColor: colors.bg, borderTopColor: colors.dim }]}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={[styles.navText, { color: active === 'home' ? colors.accent : colors.text }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentScreen('substances')}
      >
        <Text style={[styles.navText, { color: active === 'substances' ? colors.accent : colors.text }]}>Substances</Text>
      </TouchableOpacity>
    </View>
  );

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Time Container Switcher */}
          <TimeContainerSwitcher
            active={activeContainer}
            onSelect={setActiveContainer}
            colors={colors}
          />

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

          {/* Time-based Anchors */}
          <CollapsibleSection
            title={`${activeContainer.toUpperCase()} ANCHORS`}
            icon="☀️"
            colors={colors}
            defaultExpanded={true}
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

          {/* Situational Grounding */}
          <CollapsibleSection
            title="SITUATIONAL GROUNDING"
            icon="⚡"
            colors={colors}
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

          {/* Uplift & Expansion */}
          <CollapsibleSection
            title="UPLIFT & EXPANSION"
            icon="✨"
            colors={colors}
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

          {/* Placeholder for Chemical Relationships */}
          <Text style={[styles.sectionHeader, { color: colors.dim, marginTop: 24 }]}>
            CHEMICAL RELATIONSHIPS
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
              onLogUse={() => logAllyUse(ally.name)}
              colors={colors}
            />
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={[styles.bottomButtons, { backgroundColor: colors.bg }]}>
          <TouchableOpacity
            style={[styles.craftButton, { backgroundColor: colors.accent }]}
            onPress={() => setIsCraftMomentModalVisible(true)}
          >
            <Text style={[styles.craftButtonText, { color: colors.card }]}>
              + craft a moment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notesButton, { backgroundColor: colors.card, borderColor: colors.dim }]}
            onPress={() => setCurrentScreen('patterns')}
          >
            <Text style={[styles.notesButtonText, { color: colors.text }]}>field notes</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation */}
        {renderNav('home')}

        {/* Modals are rendered once at the end */}
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
      </View>
    );
  }

  // SUBSTANCES SCREEN
  if (currentScreen === 'substances') {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.containerTitle, { color: colors.text }]}>
            Substance Relationships
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
              onLogUse={() => logAllyUse(ally.name)}
              colors={colors}
            />
          ))}

          <TouchableOpacity
            style={[styles.addAllyButton, { backgroundColor: colors.accent }]}
            onPress={() => setIsAddAllyModalVisible(true)}
          >
            <Text style={[styles.addAllyText, { color: colors.card }]}>+ Add New Ally</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Navigation */}
        {renderNav('substances')}


      </View>
    );
  }

  // PATTERNS SCREEN (placeholder)
  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      
      <View style={styles.centerContent}>
        <Text style={[styles.placeholderText, { color: colors.text }]}>
          Field Notes
        </Text>
        <Text style={[styles.placeholderSubtext, { color: colors.dim }]}>
          Pattern recognition coming soon
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.accent }]}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={[styles.backButtonText, { color: colors.card }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation */}
      {renderNav('patterns')}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (styles remain the same)
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
  containerTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 4,
  },
  containerSubtitle: {
    fontSize: 16,
    fontStyle: 'italic',
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
  bottomButtons: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  craftButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  craftButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  notesButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navText: {
    fontSize: 15,
    fontWeight: '500',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

