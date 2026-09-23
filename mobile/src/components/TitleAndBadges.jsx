import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const TitleAndBadges = ({ title, tags = [] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.tagsRow}>
        {tags.map((tag, idx) => (
          <View key={idx} style={styles.tagPill}>
            {tag.toLowerCase().includes('certif') && (
              <Ionicons name="ribbon-outline" size={13} color="#0D9488" style={{ marginRight: 2 }} />
            )}
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
    marginBottom: 6
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563'
  }
});
