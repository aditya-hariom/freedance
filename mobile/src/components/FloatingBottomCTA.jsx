import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const FloatingBottomCTA = ({
  entryFee = 99,
  isRegistered = false,
  isRegistrationOpen = true,
  spotsLeft = 19,
  loading = false,
  onRegisterPress,
  onUploadPress
}) => {
  return (
    <View style={styles.fixedBottomContainer}>
      {/* 1. Dynamic CTA Button */}
      <View style={styles.ctaButtonWrapper}>
        {isRegistered ? (
          <TouchableOpacity
            style={[styles.button, styles.registeredCtaButton]}
            onPress={onUploadPress}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Upload Submission</Text>
            <Text style={styles.subText}>Registered</Text>
          </TouchableOpacity>
        ) : (!isRegistrationOpen || spotsLeft <= 0) ? (
          <View style={[styles.button, styles.disabledButton]}>
            <Text style={styles.disabledButtonText}>Registration Closed</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={onRegisterPress}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                <Text style={styles.buttonText}>Register Now - ₹{entryFee}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Bottom Tab Navigation Bar matching Page 3 screenshot */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addTabItem}>
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="trophy" size={20} color="#0D9488" />
          <View style={styles.activeDot} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...THEME.shadows.floatingCta
  },
  ctaButtonWrapper: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 10,
    paddingBottom: 6
  },
  button: {
    height: 48,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6
  },
  registerButton: {
    backgroundColor: '#0D9488' // Teal matching Page 3 CTA
  },
  registeredCtaButton: {
    backgroundColor: '#0F766E', // Dark teal from Page 3
    flexDirection: 'column',
    gap: 0,
    paddingVertical: 4
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  subText: {
    color: '#CCFBF1',
    fontSize: 10,
    fontWeight: '600'
  },
  disabledButton: {
    backgroundColor: '#E5E7EB'
  },
  disabledButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '700'
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 48,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 40
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0D9488',
    marginTop: 2
  },
  addTabItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
