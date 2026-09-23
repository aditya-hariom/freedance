import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const TabbedContent = ({ content = {} }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [expanded, setExpanded] = useState(false);

  const tabs = [
    { key: 'about', label: 'About Competition' },
    { key: 'judging', label: 'Judging Parameters' },
    { key: 'rules', label: 'Rules & Eligibility' }
  ];

  const defaultAboutShort = "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.";
  const defaultAboutFull = `${defaultAboutShort}\n\nParticipants get personalized audio-visual feedback from Sangeet Natak Akademi honored judges, national digital distribution, and official certified digital credentials backed by Feedants Art Foundation.`;

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View>
            <Text style={styles.paragraph}>
              {expanded ? (content.about || defaultAboutFull) : defaultAboutShort}
            </Text>
            
            <TouchableOpacity 
              style={styles.viewMoreBtn}
              onPress={() => setExpanded(!expanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>
                {expanded ? 'View less' : 'View more'}
              </Text>
              <Ionicons 
                name={expanded ? 'chevron-up' : 'chevron-down'} 
                size={12} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>
        );
      case 'judging':
        return (
          <View>
            <Text style={styles.paragraph}>
              {content.judgingParameters || '• Rhythm & Timing (Taal & Laya): 30%\n• Expressions & Abhinaya: 30%\n• Mudras & Posture: 20%\n• Costume & Stage Presence: 20%'}
            </Text>
          </View>
        );
      case 'rules':
        return (
          <View>
            <Text style={styles.paragraph}>
              {content.rulesAndEligibility || '1. Open for all age groups.\n2. Video duration: 2-5 minutes unbroken performance.\n3. Format: MP4, MOV, or YouTube link.\n4. Solo performances only.'}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation Row */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content Box */}
      <View style={styles.cardBox}>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 10
  },
  tabButton: {
    paddingVertical: 10,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTabButton: {
    borderBottomColor: '#0D9488'
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280'
  },
  activeTabLabel: {
    color: '#0D9488',
    fontWeight: '800'
  },
  cardBox: {
    backgroundColor: '#FFFFFF',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...THEME.shadows.card
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563'
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 8,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6'
  },
  viewMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280'
  }
});
