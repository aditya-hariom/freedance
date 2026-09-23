import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const PageThreeBonusCards = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    Alert.alert('Link Copied', 'Referral link copied to clipboard: https://feedants.com/c/classicd21');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      {/* 1. How will you receive prize money? */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <TouchableOpacity 
            style={styles.greenPlayButton}
            onPress={() => Alert.alert('Prize Money Info', 'Prize money will be credited via UPI or Bank Transfer within 48 hours of result announcement.')}
          >
            <Ionicons name="play" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          <View style={styles.prizeMoneyTextWrap}>
            <Text style={styles.prizeMoneyTitle}>How will you receive prize money?</Text>
            <Text style={styles.prizeMoneySub}>Watch video to understand</Text>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.badgeItem}>
            <Ionicons name="checkmark-circle" size={12} color="#059669" />
            <Text style={styles.badgeText}>Refund policy</Text>
          </View>
          <View style={styles.badgeItem}>
            <Ionicons name="shield-checkmark" size={12} color="#059669" />
            <Text style={styles.badgeText}>Secure payments powered by Razorpay</Text>
          </View>
        </View>
      </View>

      {/* 2. Refer & Earn more discount */}
      <View style={styles.card}>
        <Text style={styles.referTitle}>Refer & Earn more discount</Text>

        <View style={styles.referContentRow}>
          <View style={styles.linkBox}>
            <Text style={styles.linkText} numberOfLines={1}>https://feedants.com/c/classicd21</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyLink}>
              <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy Link'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.referBtn}
            onPress={() => Alert.alert('Refer Now', 'Share link with friends to get discounts on your entry!')}
          >
            <Text style={styles.referBtnText}>Refer Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.referFootnote}>You earn ₹50 for every express entry referred</Text>
      </View>

      {/* 3. Hear From Our Users */}
      <TouchableOpacity 
        style={[styles.card, styles.testimonialRow]}
        onPress={() => Alert.alert('Testimonials', 'Hear what classical dancers across India are saying about Feedants!')}
        activeOpacity={0.8}
      >
        <View style={styles.testimonialLeft}>
          <Ionicons name="chatbubbles-outline" size={18} color="#0D9488" />
          <View>
            <Text style={styles.testimonialTitle}>Hear From Our Users</Text>
            <Text style={styles.testimonialSub}>Read real testimonials and see what people are saying</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </TouchableOpacity>

      {/* 4. Ad Banner matching Page 3 */}
      <View style={styles.adBanner}>
        <Ionicons name="megaphone-outline" size={14} color="#9CA3AF" />
        <Text style={styles.adText}>Ad Here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
    gap: 10
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...THEME.shadows.card
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  greenPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669', // Emerald play button
    alignItems: 'center',
    justifyContent: 'center'
  },
  prizeMoneyTextWrap: {
    flex: 1
  },
  prizeMoneyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827'
  },
  prizeMoneySub: {
    fontSize: 10,
    color: '#6B7280'
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  badgeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600'
  },
  referTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  referContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  linkBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: THEME.borderRadius.md,
    paddingLeft: 8,
    paddingRight: 4,
    paddingVertical: 4
  },
  linkText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1
  },
  copyBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.xs
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151'
  },
  referBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md
  },
  referBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  referFootnote: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2
  },
  testimonialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  testimonialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  testimonialTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827'
  },
  testimonialSub: {
    fontSize: 10,
    color: '#6B7280'
  },
  adBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: THEME.borderRadius.md,
    backgroundColor: '#F9FAFB'
  },
  adText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF'
  }
});
