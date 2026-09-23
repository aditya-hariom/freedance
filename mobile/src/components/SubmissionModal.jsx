import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export const SubmissionModal = ({
  visible = false,
  onClose,
  onSubmit
}) => {
  const [url, setUrl] = useState('https://storage.feedants.com/submissions/kathak_perf_final.mp4');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please provide a valid video link or upload file.');
      return;
    }

    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(url.trim());
      }
      Alert.alert('Success 🎉', 'Your performance submission has been received by Judge Manju Dubey!');
      onClose();
    } catch (err) {
      Alert.alert('Submission Error', err.message || 'Failed to submit entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <Ionicons name="cloud-upload" size={20} color={THEME.colors.primary} />
              <Text style={styles.title}>Upload Performance</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={THEME.colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Provide your dance performance video URL (YouTube unlisted, Google Drive, or cloud storage):
          </Text>

          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="https://..."
            placeholderTextColor={THEME.colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.tipsBox}>
            <Ionicons name="information-circle-outline" size={16} color={THEME.colors.textSecondary} />
            <Text style={styles.tipsText}>
              Ensure video is between 2-5 minutes, with clear audio and classical attire.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={onClose}
              disabled={submitting}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Entry</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg
  },
  modalBox: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    ...THEME.shadows.card
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textPrimary
  },
  closeBtn: {
    padding: 4
  },
  description: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18
  },
  input: {
    backgroundColor: '#0F172A',
    color: THEME.colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
    fontSize: 14,
    marginBottom: 12
  },
  tipsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 16
  },
  tipsText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    flex: 1
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: THEME.borderRadius.md
  },
  cancelBtnText: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontSize: 14
  },
  submitBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.borderRadius.md
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  }
});
