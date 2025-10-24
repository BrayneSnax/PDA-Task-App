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
import { AnchorCard } from '../components/AnchorCard';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { CraftMomentModal } from '../modal';
import { ContainerId } from '../constants/Types';

type Screen = 'home' | 'substances' | 'journal' | 'patterns';

export default function HomeScreen() {
  const {
    items,
    allies,
    activeContainer,
    setActiveContainer,
    toggleCompletion,
    isCompleted,
    loading,
    addItem,
    removeAlly,
    updateAlly,
    addAlly,
    journalEntries,
  } = useApp();

  const colors = useColors(activeContainer, true);
  const [currentTime, setCurrentTime] = useState(formatTime());
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isCraftMomentModalVisible, setIsCraftMomentModalVisible] = useState(false);
  const [isAddAllyModalVisible, setIsAddAllyModalVisible] = useState(false);
  const [isEditAllyModalVisible, setIsEditAllyModalVisible] = useState(false);
  const [isSynthesisModalVisible, setIsSynthesisModalVisible] = useState(false);
  const [allyToEdit, setAllyToEdit] = useState(null);
  const [momentToSynthesize, setMomentToSynthesize] = useState<any>({});

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

  // Render compact action buttons at top
  const renderActionGrid = () => (
    <View style={styles.actionGrid}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={() => setCurrentScreen('substances')}
      >
        <Text style={[styles.actionIcon, { color: colors.accent }]}>🍃</Text>
        <Text style={[styles.actionText, { color: colors.text }]}>Chemical Relationships</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={() => setCurrentScreen('journal')}
      >
        <Text style={[styles.actionIcon, { color: colors.accent }]}>📖</Text>
        <Text style={[styles.actionText, { color: colors.text }]}>Alchemical Journal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={() => setCurrentScreen('patterns')}
      >
        <Text style={[styles.actionIcon, { color: colors.accent }]}>🌌</Text>
        <Text style={[styles.actionText, { color: colors.text }]}>Patterns</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.card }]}
        onPress={() => setIsCraftMomentModalVisible(true)}
      >
        <Text style={[styles.actionIcon, { color: colors.accent }]}>✨</Text>
        <Text style={[styles.actionText, { color: colors.text }]}>Craft a Moment</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Time Container Navigation at bottom
  const renderTimeContainerNav = () => {
    const containers: ContainerId[] = ['morning', 'afternoon', 'evening', 'late'];
    const icons = { morning: '🌅', afternoon: '🌞', evening: '🌇', late: '🌙' };
    
    return (
      <View style={[styles.timeContainerNav, { backgroundColor: colors.bg, borderTopColor: colors.dim }]}>
        {containers.map(container => (
          <TouchableOpacity
            key={container}
            style={[
              styles.timeButton,
              activeContainer === container && { backgroundColor: colors.accent + '20' }
            ]}
            onPress={() => {
              setActiveContainer(container);
              setCurrentScreen('home');
            }}
          >
            <Text style={[styles.timeIcon, { color: colors.accent }]}>{icons[container]}</Text>
            <Text style={[
              styles.timeText,
              { color: activeContainer === container ? colors.accent : colors.dim }
            ]}>
              {container.charAt(0).toUpperCase() + container.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // HOME SCREEN (Anchors)
  if (currentScreen === 'home') {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        
        {/* 2x2 Action Grid at Top */}
        <View style={styles.topSection}>
          {renderActionGrid()}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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

          {/* Situational Grounding */}
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

          {/* Uplift & Expansion */}
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

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Time Container Navigation at Bottom */}
        {renderTimeContainerNav()}

        {/* Modals */}
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

  // SUBSTANCES SCREEN
  if (currentScreen === 'substances') {
    const { AllyCard } = require('../components/AllyCard');
    const { AddAllyModal, EditAllyModal } = require('../modal');
    const { JournalisticSynthesisModal } = require('../modal/JournalisticSynthesisModal');

    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        
        {/* 2x2 Action Grid at Top */}
        <View style={styles.topSection}>
          {renderActionGrid()}
        </View>

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
              onEdit={(ally: any) => {
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
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => setIsAddAllyModalVisible(true)}
          >
            <Text style={[styles.addButtonText, { color: colors.card }]}>+ Add New Companion</Text>
          </TouchableOpacity>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Time Container Navigation at Bottom */}
        {renderTimeContainerNav()}

        {/* Modals */}
        <AddAllyModal
          isVisible={isAddAllyModalVisible}
          onClose={() => setIsAddAllyModalVisible(false)}
          onSave={(name: string, face: string, invocation: string, func: string, shadow: string, ritual: string) => {
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
            onSave={(ally: any) => {
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

  // JOURNAL SCREEN
  if (currentScreen === 'journal') {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        
        {/* 2x2 Action Grid at Top */}
        <View style={styles.topSection}>
          {renderActionGrid()}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.containerTitle, { color: colors.text }]}>
            Alchemical Journal
          </Text>
          <Text style={[styles.containerSubtitle, { color: colors.dim }]}>
            field transmissions & reflections
          </Text>

          <Text style={[styles.sectionHeader, { color: colors.dim, marginTop: 24 }]}>
            RECENT TRANSMISSIONS
          </Text>

          {journalEntries.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.dim }]}>
                No transmissions yet. Log your first interaction to begin.
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
                  <Text style={[styles.checkInText, { color: colors.dim }]}>
                    Tone: <Text style={{ color: colors.text }}>{entry.tone}</Text>
                  </Text>
                )}
                
                {entry.context && (
                  <View style={styles.reflectionSection}>
                    <Text style={[styles.reflectionLabel, { color: colors.accent }]}>The Setting:</Text>
                    <Text style={[styles.reflectionText, { color: colors.text }]}>{entry.context}</Text>
                  </View>
                )}
              </View>
            ))
          )}

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Time Container Navigation at Bottom */}
        {renderTimeContainerNav()}
      </View>
    );
  }

  // PATTERNS SCREEN
  if (currentScreen === 'patterns') {
    const { patterns, removePattern } = useApp();
    const [isAddPatternModalVisible, setIsAddPatternModalVisible] = useState(false);
    const { AddPatternModal } = require('../modal/AddPatternModal');

    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        
        {/* 2x2 Action Grid at Top */}
        <View style={styles.topSection}>
          {renderActionGrid()}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.containerTitle, { color: colors.text }]}>
            Pattern Recognition
          </Text>
          <Text style={[styles.containerSubtitle, { color: colors.dim }]}>
            witnessing the rhythms
          </Text>

          <Text style={[styles.sectionHeader, { color: colors.dim, marginTop: 24 }]}>
            YOUR PATTERNS
          </Text>

          {patterns.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyText, { color: colors.dim }]}>
                No patterns recorded yet. Tap below to add your first observation.
              </Text>
            </View>
          ) : (
            patterns.map((pattern) => (
              <View key={pattern.id} style={[styles.patternCard, { backgroundColor: colors.card }]}>
                <View style={styles.patternHeader}>
                  <View style={styles.patternHeaderLeft}>
                    {pattern.category && (
                      <Text style={[styles.patternCategory, { color: colors.accent }]}>
                        {pattern.category === 'anchor' && '⚓'}
                        {pattern.category === 'substance' && '🍃'}
                        {pattern.category === 'time' && '⏰'}
                        {pattern.category === 'general' && '🌌'}
                      </Text>
                    )}
                    <Text style={[styles.patternDate, { color: colors.dim }]}>
                      {new Date(pattern.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removePattern(pattern.id)}>
                    <Text style={[styles.deleteButton, { color: colors.dim }]}>×</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.patternText, { color: colors.text }]}>{pattern.text}</Text>
              </View>
            ))
          )}

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.accent }]}
            onPress={() => setIsAddPatternModalVisible(true)}
          >
            <Text style={[styles.addButtonText, { color: colors.card }]}>+ Record a Pattern</Text>
          </TouchableOpacity>

          <View style={[styles.placeholderCard, { backgroundColor: colors.card, marginTop: 32 }]}>
            <Text style={[styles.placeholderIcon, { color: colors.accent }]}>🌌</Text>
            <Text style={[styles.placeholderTitle, { color: colors.text }]}>
              AI Pattern Weaver
            </Text>
            <Text style={[styles.placeholderText, { color: colors.dim }]}>
              Soon, this space will automatically reveal hidden rhythms — tracking how anchors, allies, and moments weave together across time.
            </Text>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Time Container Navigation at Bottom */}
        {renderTimeContainerNav()}

        {/* Modal */}
        <AddPatternModal
          isVisible={isAddPatternModalVisible}
          onClose={() => setIsAddPatternModalVisible(false)}
          onSave={(text, category) => {
            const { addPattern } = useApp();
            addPattern({ text, category });
          }}
          colors={colors}
        />
      </View>
    );
  }

  return null;
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
  topSection: {
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  actionGrid: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  timeSection: {
    marginBottom: 24,
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
  timeContainerNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  timeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  timeIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
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
  addButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
  checkInText: {
    fontSize: 13,
    marginBottom: 6,
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
  patternCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  patternHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patternCategory: {
    fontSize: 16,
  },
  patternDate: {
    fontSize: 12,
  },
  deleteButton: {
    fontSize: 24,
    fontWeight: '300',
    padding: 4,
  },
  patternText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

