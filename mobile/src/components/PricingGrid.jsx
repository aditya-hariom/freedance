import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const PricingGrid = ({
  prizePool = 1500,
  entryFee = 99,
  spotsLeft = 19,
  bookedSlots = 1,
  totalSlots = 20
}) => {
  const percentage = Math.min(100, Math.max(0, (bookedSlots / totalSlots) * 100));

  return (
    <View style={styles.container}>
      {/* 1. Prize Pool */}
      <View style={styles.column}>
        <Text style={styles.label}>Prize Pool</Text>
        <Text style={styles.prizeValue}>₹ {Number(prizePool).toLocaleString('en-IN')}</Text>
      </View>

      <View style={styles.divider} />

      {/* 2. Entry Fee */}
      <View style={styles.column}>
        <Text style={styles.label}>Entry Fee</Text>
        <Text style={styles.feeValue}>₹ {Number(entryFee).toLocaleString('en-IN')}</Text>
      </View>

      <View style={styles.divider} />

      {/* 3. Spots Left & Progress Bar */}
      <View style={[styles.column, styles.spotsColumn]}>
        <View style={styles.spotsHeader}>
          <Ionicons name="flame" size={13} color="#D97706" />
          <Text style={styles.spotsLabel}>Only {spotsLeft} spots left</Text>
        </View>

        <Text style={styles.bookedText}>{bookedSlots} / {totalSlots} Booked</Text>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    marginBottom: THEME.spacing.sm
  },
  column: {
    flex: 1
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2
  },
  prizeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669', // Emerald green from Page 3
    letterSpacing: -0.5
  },
  feeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5
  },
  spotsColumn: {
    flex: 1.3
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2
  },
  spotsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309'
  },
  bookedText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 2
  }
});
