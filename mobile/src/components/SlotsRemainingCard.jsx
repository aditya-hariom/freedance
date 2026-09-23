import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const SlotsRemainingCard = ({
  totalSlots = 20,
  bookedSlots = 1,
  spotsLeft = 19
}) => {
  const percentage = Math.min(100, Math.max(0, (bookedSlots / totalSlots) * 100));
  const isUrgent = spotsLeft <= 5;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.spotsLeftWrap}>
          <Ionicons 
            name="flame" 
            size={16} 
            color={isUrgent ? THEME.colors.danger : THEME.colors.primary} 
          />
          <Text style={[styles.spotsLeftText, isUrgent && styles.urgentText]}>
            Only {spotsLeft} spots left
          </Text>
        </View>

        <Text style={styles.bookedText}>
          {bookedSlots}/{totalSlots} Booked
        </Text>
      </View>

      {/* Progress Bar Container */}
      <View style={styles.progressBarTrack}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%` },
            isUrgent && styles.urgentFill
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.lg,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    marginBottom: THEME.spacing.md,
    ...THEME.shadows.card
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  spotsLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  spotsLeftText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: 0.2
  },
  urgentText: {
    color: THEME.colors.danger
  },
  bookedText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 4
  },
  urgentFill: {
    backgroundColor: THEME.colors.danger
  }
});
