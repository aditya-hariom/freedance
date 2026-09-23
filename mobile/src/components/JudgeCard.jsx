import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const JudgeCard = ({ judge = {}, onPlayVideo }) => {
  const handlePlay = () => {
    if (onPlayVideo) {
      onPlayVideo();
    } else {
      Alert.alert(
        'Judge Introduction',
        `Playing intro video by ${judge.name || 'Judge'} (${judge.title || ''})`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Left: Judge Avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: judge.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' }}
            style={styles.avatar}
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-sharp" size={10} color="#FFFFFF" />
          </View>
        </View>

        {/* Middle: Details */}
        <View style={styles.details}>
          <Text style={styles.judgeLabel}>Judge</Text>
          <Text style={styles.judgeName}>{judge.name || 'Manju Dubey'}</Text>
          <Text style={styles.judgeTitle}>{judge.title || 'Professional Kathak Dancer'}</Text>
          
          <View style={styles.expRow}>
            <Ionicons name="ribbon-outline" size={13} color="#D97706" />
            <Text style={styles.expText}>{judge.experience || '12+ Years of Experience'}</Text>
          </View>
        </View>

        {/* Right: Circular Play Button with "Intro Video" text */}
        <TouchableOpacity
          style={styles.playColumn}
          onPress={handlePlay}
          activeOpacity={0.8}
        >
          <View style={styles.playButton}>
            <Ionicons name="play" size={16} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.introText}>Intro Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...THEME.shadows.card
  },
  avatarWrap: {
    position: 'relative'
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  details: {
    flex: 1,
    marginLeft: THEME.spacing.md
  },
  judgeLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 1
  },
  judgeTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4
  },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  expText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706'
  },
  playColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: THEME.spacing.sm
  },
  playButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0D9488', // Teal circular play button matching Page 3
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3
  },
  introText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280'
  }
});
