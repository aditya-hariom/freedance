import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";

const USERS = [
  { id: "dancer_ananya", label: "Ananya" },
  { id: "dancer_priya", label: "Priya" },
  { id: "dancer_rohan", label: "Rohan" },
  { id: "dancer_arjun", label: "Arjun" },
];

export const UserSwitcher = ({ currentUserId, onSelectUser }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Switch User:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {USERS.map((user) => {
          const isActive = user.id === currentUserId;
          return (
            <TouchableOpacity
              key={user.id}
              style={[styles.badge, isActive && styles.badgeActive]}
              onPress={() => onSelectUser(user.id)}
            >
              <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                {user.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginRight: 8,
  },
  scroll: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  badgeActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  badgeText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  badgeTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
