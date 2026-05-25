import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Flame, Plus, Trash2, X } from 'lucide-react-native';
import dayjs from 'dayjs';
import { theme } from '../App';
import { useApp, PrayerBurden } from '../context/AppContext';

export default function HomeScreen({ navigation }: any) {
  const { user, burdens, addBurden, removeBurden, setCurrentBurdenId } =
    useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBurdenTitle, setNewBurdenTitle] = useState('');
  const [newBurdenDesc, setNewBurdenDesc] = useState('');

  const dailyVerse =
    '"For the Spirit God gave us does not make us timid, but gives us power, love and a sound mind." - 2 Timothy 1:7';

  const handleAddBurden = () => {
    if (!newBurdenTitle.trim()) {
      Alert.alert('Error', 'Please enter a burden title');
      return;
    }

    addBurden({
      title: newBurdenTitle,
      description: newBurdenDesc,
      createdAt: new Date().toISOString(),
      answered: false,
      timeSpent: 0,
    });

    setNewBurdenTitle('');
    setNewBurdenDesc('');
    setShowAddModal(false);
  };

  const handleSelectBurden = (burdenId: string) => {
    setCurrentBurdenId(burdenId);
    navigation.navigate('Push');
  };

  const renderBurden = ({ item }: { item: PrayerBurden }) => (
    <TouchableOpacity
      style={[
        styles.burdenCard,
        item.answered && styles.burdenCardAnswered,
      ]}
      onPress={() => handleSelectBurden(item.id)}
    >
      <View style={styles.burdenContent}>
        <Text style={styles.burdenTitle}>{item.title}</Text>
        <Text style={styles.burdenDescription}>{item.description}</Text>
        <Text style={styles.burdenDate}>
          {dayjs(item.createdAt).format('MMM DD, YYYY')}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeBurden(item.id)}
        style={styles.deleteButton}
      >
        <Trash2 size={16} color={theme.error} />
      </TouchableOpacity>
      {item.answered && (
        <Text style={styles.answeredBadge}>✓ Answered</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak Section */}
        <View style={styles.streakCard}>
          <View style={styles.streakContent}>
            <Flame size={48} color={theme.secondary} />
            <View style={styles.streakText}>
              <Text style={styles.streakLabel}>Prayer Streak</Text>
              <Text style={styles.streakValue}>{user.streak} Days</Text>
            </View>
          </View>
        </View>

        {/* Daily Verse Section */}
        <View style={styles.verseCard}>
          <Text style={styles.verseLabel}>Today's Verse</Text>
          <Text style={styles.verseText}>{dailyVerse}</Text>
        </View>

        {/* Start Prayer Button */}
        <TouchableOpacity
          style={styles.startPrayerButton}
          onPress={() => navigation.navigate('Push')}
        >
          <Text style={styles.startPrayerText}>Start Prayer Session</Text>
        </TouchableOpacity>

        {/* Prayer Burdens Header */}
        <View style={styles.burdensHeader}>
          <Text style={styles.burdensTitle}>Prayer Burdens</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color={theme.white} />
          </TouchableOpacity>
        </View>

        {/* Prayer Burdens List */}
        {burdens.length > 0 ? (
          <FlatList
            data={burdens}
            renderItem={renderBurden}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.burdensList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No prayer burdens yet. Add one to get started!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Burden Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Prayer Burden</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Burden title"
              value={newBurdenTitle}
              onChangeText={setNewBurdenTitle}
              placeholderTextColor={theme.lightText}
            />

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description (optional)"
              value={newBurdenDesc}
              onChangeText={setNewBurdenDesc}
              placeholderTextColor={theme.lightText}
              multiline
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddBurden}
            >
              <Text style={styles.submitButtonText}>Add Burden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  streakCard: {
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 16,
  },
  streakLabel: {
    fontSize: 14,
    color: theme.lightText,
    fontWeight: '500',
  },
  streakValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.primary,
    marginTop: 4,
  },
  verseCard: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  verseLabel: {
    fontSize: 12,
    color: theme.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  verseText: {
    fontSize: 16,
    color: theme.white,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  startPrayerButton: {
    backgroundColor: theme.secondary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: theme.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startPrayerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
  },
  burdensHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  burdensTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
  },
  addButton: {
    backgroundColor: theme.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  burdensList: {
    paddingBottom: 20,
  },
  burdenCard: {
    backgroundColor: theme.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  burdenCardAnswered: {
    opacity: 0.6,
    borderLeftColor: theme.success,
  },
  burdenContent: {
    flex: 1,
  },
  burdenTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary,
    marginBottom: 4,
  },
  burdenDescription: {
    fontSize: 13,
    color: theme.lightText,
    marginBottom: 8,
  },
  burdenDate: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  answeredBadge: {
    color: theme.success,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.lightText,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
  },
  input: {
    backgroundColor: theme.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: theme.text,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
  },
  submitButtonText: {
    textAlign: 'center',
    color: theme.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
