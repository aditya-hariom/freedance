import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const RewardsBreakdown = ({ rewards = [] }) => {
  const defaultRewards = [
    { rank: '1st Winner', amount: 500 },
    { rank: '2nd Winner', amount: 300 },
    { rank: '3rd Winner', amount: 240 },
    { rank: '4th Winner', amount: 200 },
    { rank: '5th Winner', amount: 130 },
    { rank: '6th Winner', amount: 80 }
  ];

  const list = (rewards && rewards.length > 0) ? rewards : defaultRewards;

  const getRankIcon = (rank) => {
    if (rank && rank.includes('1')) return { icon: 'trophy', color: '#F59E0B' };
    if (rank && rank.includes('2')) return { icon: 'medal', color: '#94A3B8' };
    if (rank && rank.includes('3')) return { icon: 'medal', color: '#B45309' };
    return { icon: 'star', color: '#6B7280' };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Rewards (All Positions)</Text>

      <View style={styles.listCard}>
        {list.map((reward, idx) => {
          const { icon, color } = getRankIcon(reward.rank);

          return (
            <View key={idx} style={styles.rewardRow}>
              <View style={styles.leftCol}>
                <Ionicons name={icon} size={15} color={color} />
                <Text style={styles.rankText}>{reward.rank}</Text>
              </View>

              <Text style={styles.amountText}>
                ₹ {Number(reward.amount).toLocaleString('en-IN')}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Disclaimer matching Page 3 */}
      <View style={styles.disclaimerRow}>
        <Ionicons name="information-circle-outline" size={13} color="#9CA3AF" />
        <Text style={styles.disclaimerText}>
          Disclaimer: Entry contributions from paid participants will be considered for judging.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...THEME.shadows.card
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  rankText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151'
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827'
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 2
  },
  disclaimerText: {
    fontSize: 10,
    color: '#9CA3AF',
    flex: 1
  }
});
