import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useCountdown } from '../hooks/useCountdown';

export const CountdownTimer = ({ targetDate }) => {
  const { formatted, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <View style={styles.container}>
        <View style={styles.expiredRow}>
          <Ionicons name="time-outline" size={15} color="#9CA3AF" />
          <Text style={styles.expiredText}>Registration has closed</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Left: Hourglass & Label */}
        <View style={styles.labelCluster}>
          <Ionicons name="hourglass-outline" size={14} color="#0D9488" />
          <Text style={styles.labelText}>Registration closes in</Text>
        </View>

        {/* Middle: 01d : 06h : 28m : 32s */}
        <Text style={styles.countdownDigits}>{formatted}</Text>

        {/* Right: ⚡ Hurry up! */}
        <View style={styles.hurryBadge}>
          <Ionicons name="flash" size={10} color="#DC2626" />
          <Text style={styles.hurryText}>Hurry up!</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA', // Soft teal tint from Page 3
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#CCFBF1'
  },
  expiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: THEME.borderRadius.lg
  },
  expiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280'
  },
  labelCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151'
  },
  countdownDigits: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.2
  },
  hurryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 3
  },
  hurryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626'
  }
});
