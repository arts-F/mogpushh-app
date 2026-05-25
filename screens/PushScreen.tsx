import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
} from 'react-native';
import { Mic, CheckCircle, Heart } from 'lucide-react-native';
import { theme } from '../App';

export default function PushScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const scaleAnim = new Animated.Value(1);

  const currentBurden = {
    title: 'Family Healing',
    description: 'Pray for wisdom and restoration',
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(
        secs
      ).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePrayed30Min = () => {
    console.log('Marked 30 minutes of prayer');
    setSeconds(1800);
    setIsRunning(false);
  };

  const handleVoiceNote = () => {
    console.log('Start voice note recording');
  };

  const handleMarkAnswered = () => {
    console.log('Mark prayer as answered');
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Current Burden Section */}
      <View style={styles.burdenSection}>
        <Text style={styles.burdenLabel}>Current Prayer Focus</Text>
        <View style={styles.burdenCard}>
          <Text style={styles.burdenTitle}>{currentBurden.title}</Text>
          <Text style={styles.burdenDescription}>
            {currentBurden.description}
          </Text>
        </View>
      </View>

      {/* Timer Section */}
      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>Prayer Time</Text>

        <Animated.View
          style={[
            styles.timerCircle,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.timerInner}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          </View>
        </Animated.View>

        {/* Timer Toggle Button */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isRunning && styles.toggleButtonActive,
          ]}
          onPress={handleToggleTimer}
        >
          <Text style={styles.toggleButtonText}>
            {isRunning ? 'Pause' : 'Start Prayer'}
          </Text>
        </TouchableOpacity>

        {/* Timer Status */}
        <Text style={styles.timerStatus}>
          {isRunning ? '🙏 Praying...' : 'Ready to pray'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handlePrayed30Min}
        >
          <Heart size={24} color={theme.white} />
          <Text style={styles.actionButtonText}>Prayed 30min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleVoiceNote}
        >
          <Mic size={24} color={theme.white} />
          <Text style={styles.actionButtonText}>Voice Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.markAnsweredButton]}
          onPress={handleMarkAnswered}
        >
          <CheckCircle size={24} color={theme.white} />
          <Text style={styles.actionButtonText}>Mark Answered</Text>
        </TouchableOpacity>
      </View>

      {/* Prayer Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Prayer Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Today's Total:</Text>
          <Text style={styles.statValue}>{formatTime(seconds)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Prayers This Week:</Text>
          <Text style={styles.statValue}>12</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Answered Prayers:</Text>
          <Text style={styles.statValue}>5</Text>
        </View>
      </View>
    </ScrollView>
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
  burdenSection: {
    marginBottom: 24,
  },
  burdenLabel: {
    fontSize: 12,
    color: theme.lightText,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  burdenCard: {
    backgroundColor: theme.white,
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
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
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 14,
    color: theme.lightText,
    fontWeight: '600',
    marginBottom: 20,
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  timerInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: theme.secondary,
    fontVariant: ['tabular-nums'],
  },
  toggleButton: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 12,
    minWidth: 180,
  },
  toggleButtonActive: {
    backgroundColor: theme.primary,
    borderWidth: 2,
    borderColor: theme.secondary,
  },
  toggleButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.toggleButtonActive ? theme.white : theme.primary,
  },
  timerStatus: {
    fontSize: 14,
    color: theme.lightText,
    fontStyle: 'italic',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAnsweredButton: {
    backgroundColor: theme.success,
  },
  actionButtonText: {
    color: theme.white,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsSection: {
    backgroundColor: theme.white,
    borderRadius: 10,
    padding: 16,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  statLabel: {
    fontSize: 13,
    color: theme.lightText,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
  },
});
