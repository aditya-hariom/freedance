import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const Header = ({
  isRegistered = false,
  language = 'EN',
  onToggleLanguage,
  onBackPress
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      Alert.alert('Navigation', 'Back button pressed');
    }
  };

  return (
    <View style={styles.container}>
      {/* Left: ← Go back */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={THEME.colors.textPrimary} />
        <Text style={styles.backText}>Go back</Text>
      </TouchableOpacity>

      {/* Right Cluster: Language Toggle + Registered Badge */}
      <View style={styles.rightColumn}>
        {/* ENG | हिंदी Toggle Pill */}
        <TouchableOpacity
          style={styles.langToggle}
          onPress={onToggleLanguage}
          activeOpacity={0.8}
        >
          <View style={[styles.langSegment, language === 'EN' && styles.langSegmentActive]}>
            <Text style={[styles.langText, language === 'EN' && styles.langTextActive]}>ENG</Text>
          </View>
          <View style={[styles.langSegment, language === 'HI' && styles.langSegmentActive]}>
            <Text style={[styles.langText, language === 'HI' && styles.langTextActive]}>हिंदी</Text>
          </View>
        </TouchableOpacity>

        {/* Registered Pill Indicator */}
        {isRegistered && (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={13} color={THEME.colors.success} />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textPrimary
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 6
  },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E', // Dark teal matching Page 3 screenshot
    borderRadius: THEME.borderRadius.pill,
    padding: 2
  },
  langSegment: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill
  },
  langSegmentActive: {
    backgroundColor: '#14B8A6'
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0F2FE'
  },
  langTextActive: {
    color: '#FFFFFF'
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 1,
    borderColor: '#6EE7B7',
    gap: 4
  },
  registeredText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700'
  }
});
