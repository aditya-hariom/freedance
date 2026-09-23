import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const ImportantDatesGrid = ({ dates = {} }) => {
  const dateCards = [
    {
      title: 'Register Before',
      date: '10 Aug 26',
      time: '11:50 PM',
      icon: 'calendar-outline',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      title: 'Submission Starts',
      date: '11 Aug 26',
      time: '04:00 AM',
      icon: 'cloud-upload-outline',
      iconBg: '#DCFCE7',
      iconColor: '#16A34A'
    },
    {
      title: 'Submission Ends',
      date: '30 Aug 26',
      time: '11:55 PM',
      icon: 'time-outline',
      iconBg: '#FEE2E2',
      iconColor: '#DC2626'
    },
    {
      title: 'Result Date',
      date: '1 Sept 26',
      time: '11:50 PM',
      icon: 'trophy-outline',
      iconBg: '#FEF3C7',
      iconColor: '#D97706'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Important Dates</Text>

      <View style={styles.grid}>
        {dateCards.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={15} color={item.iconColor} />
              </View>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>

            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  card: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...THEME.shadows.card
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1
  },
  dateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 1
  },
  timeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF'
  }
});
