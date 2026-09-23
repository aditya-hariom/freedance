import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { THEME } from '../constants/theme';

export const PreviousWinners = ({ winners = [] }) => {
  const defaultWinners = [
    {
      name: 'Riya Shah',
      rank: '1st',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Aarav Mehta',
      rank: '2nd',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Neha Verma',
      rank: '3rd',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Rohit C',
      rank: '4th',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80'
    }
  ];

  const displayList = (winners && winners.length > 0) ? winners : defaultWinners;

  const getRankColor = (rank) => {
    if (rank && rank.includes('1')) return '#F59E0B'; // Gold
    if (rank && rank.includes('2')) return '#94A3B8'; // Silver
    if (rank && rank.includes('3')) return '#B45309'; // Bronze
    return '#0D9488';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Winners</Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {displayList.map((winner, idx) => {
          const badgeColor = getRankColor(winner.rank);

          return (
            <View key={idx} style={styles.winnerCard}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: winner.avatarUrl }}
                  style={[styles.avatar, { borderColor: badgeColor }]}
                />
                <View style={[styles.rankBadge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.rankText}>{winner.rank}</Text>
                </View>
              </View>

              <Text style={styles.winnerName} numberOfLines={1}>{winner.name}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.md
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: 8
  },
  scrollList: {
    paddingHorizontal: THEME.spacing.lg,
    gap: 14
  },
  winnerCard: {
    alignItems: 'center',
    width: 68
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 4
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5
  },
  rankBadge: {
    position: 'absolute',
    bottom: -3,
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
  rankText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  winnerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center'
  }
});
