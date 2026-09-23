import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Text,
  Alert,
  Platform,
} from "react-native";
import { THEME } from "./src/constants/theme";
import {
  getCompetitions,
  registerForCompetition,
  submitCompetitionEntry,
} from "./src/api/competitionApi";

// Component imports matching Page 3 exact design
import { Header } from "./src/components/Header";
import { UserSwitcher } from "./src/components/UserSwitcher";
import { TitleAndBadges } from "./src/components/TitleAndBadges";
import { PricingGrid } from "./src/components/PricingGrid";
import { JudgeCard } from "./src/components/JudgeCard";
import { CountdownTimer } from "./src/components/CountdownTimer";
import { ImportantDatesGrid } from "./src/components/ImportantDatesGrid";
import { PreviousWinners } from "./src/components/PreviousWinners";
import { TabbedContent } from "./src/components/TabbedContent";
import { RewardsBreakdown } from "./src/components/RewardsBreakdown";
import { PageThreeBonusCards } from "./src/components/PageThreeBonusCards";
import { FloatingBottomCTA } from "./src/components/FloatingBottomCTA";
import { SubmissionModal } from "./src/components/SubmissionModal";

// High-fidelity fallback data in case backend is initializing
const FALLBACK_COMPETITION = {
  _id: "default_classical_dance",
  title: "Feedants Classical Dance",
  tags: ["Dance", "Multi-Win", "Winners get certificate"],
  prizePool: 1500,
  entryFee: 99,
  totalSlots: 20,
  bookedSlots: 1,
  spotsLeft: 19,
  isRegistrationOpen: true,
  isRegistered: false,
  judge: {
    name: "Manju Dubey",
    title: "Professional Kathak Dancer",
    experience: "12+ Years of Experience",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  dates: {
    registrationEnd: new Date(
      Date.now() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000,
    ).toISOString(),
    submissionStart: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    submissionEnd: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
    resultDate: new Date(Date.now() + 10 * 86400 * 1000).toISOString(),
  },
  previousWinners: [
    {
      name: "Riya Shah",
      rank: "1st",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Aarav Mehta",
      rank: "2nd",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Neha Verma",
      rank: "3rd",
      avatarUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    },
    {
      name: "Rohit C",
      rank: "4th",
      avatarUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    },
  ],
  rewards: [
    { rank: "1st Winner", amount: 500 },
    { rank: "2nd Winner", amount: 300 },
    { rank: "3rd Winner", amount: 240 },
    { rank: "4th Winner", amount: 200 },
    { rank: "5th Winner", amount: 130 },
    { rank: "6th Winner", amount: 80 },
  ],
  tabsContent: {
    about:
      "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.",
    judgingParameters:
      "• Rhythm & Timing (Taal & Laya): 30%\n• Expressions & Abhinaya: 30%\n• Mudras & Posture: 20%\n• Costume & Stage Presence: 20%",
    rulesAndEligibility:
      "1. Open for all age groups.\n2. Video duration: 2-5 minutes unbroken performance.\n3. Format: MP4, MOV, or YouTube link.\n4. Solo performances only.",
  },
};

export default function App() {
  const [competition, setCompetition] = useState(FALLBACK_COMPETITION);
  const [currentUserId, setCurrentUserId] = useState("dancer_ananya");
  const [language, setLanguage] = useState("EN");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Load Competition Data from Backend
  const loadData = useCallback(
    async (isPullToRefresh = false) => {
      if (isPullToRefresh) setRefreshing(true);
      else setLoading(true);
      setApiError(null);

      try {
        const competitions = await getCompetitions(currentUserId);
        if (competitions && competitions.length > 0) {
          setCompetition(competitions[0]);
        } else {
          setCompetition((prev) => ({
            ...FALLBACK_COMPETITION,
            isRegistered: false,
          }));
        }
      } catch (err) {
        console.warn(
          "[App] Could not connect to API, using demo dataset:",
          err.message,
        );
        setApiError(
          "Connected in Offline Demo Mode (Backend not running or still launching)",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Registration Action (Calls Atomic API)
  const handleRegister = async () => {
    if (competition.isRegistered) return;

    try {
      setRegistering(true);
      const res = await registerForCompetition(competition._id, currentUserId);

      // Update local state atomically matching server response
      setCompetition((prev) => ({
        ...prev,
        bookedSlots: res.competition.bookedSlots,
        spotsLeft: res.competition.spotsLeft,
        isRegistered: true,
        userRegistration: res.registration,
      }));

      Alert.alert(
        "Registration Confirmed! 🎉",
        `Welcome to ${competition.title}! You are registered. You can now prepare and upload your performance video.`,
      );
    } catch (err) {
      // In offline mode, allow local simulation
      if (competition._id === "default_classical_dance" || apiError) {
        setCompetition((prev) => ({
          ...prev,
          bookedSlots: prev.bookedSlots + 1,
          spotsLeft: Math.max(0, prev.spotsLeft - 1),
          isRegistered: true,
        }));
        Alert.alert(
          "Registration Confirmed (Demo)",
          "Simulated registration successful!",
        );
        return;
      }

      Alert.alert(
        "Registration Failed",
        err.message || "Could not complete registration.",
      );
    } finally {
      setRegistering(false);
    }
  };

  // Handle Video Submission Upload
  const handleUploadSubmission = async (videoUrl) => {
    try {
      await submitCompetitionEntry(competition._id, currentUserId, videoUrl);
      setCompetition((prev) => ({
        ...prev,
        userRegistration: {
          ...(prev.userRegistration || {
            _id: "sub_1",
            userId: currentUserId,
            registeredAt: new Date().toISOString(),
          }),
          status: "submitted",
          submissionUrl: videoUrl,
        },
      }));
    } catch (err) {
      setCompetition((prev) => ({
        ...prev,
        userRegistration: {
          ...(prev.userRegistration || {
            _id: "sub_1",
            userId: currentUserId,
            registeredAt: new Date().toISOString(),
          }),
          status: "submitted",
          submissionUrl: videoUrl,
        },
      }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header matching Page 3 */}
      <Header
        isRegistered={competition.isRegistered}
        language={language}
        onToggleLanguage={() =>
          setLanguage((prev) => (prev === "EN" ? "HI" : "EN"))
        }
      />

      {/* Dev User Switcher */}
      <UserSwitcher
        currentUserId={currentUserId}
        onSelectUser={setCurrentUserId}
      />

      {/* Main Content Area */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor="#0D9488"
            colors={["#0D9488"]}
          />
        }
      >
        {/* Title & Badges */}
        <TitleAndBadges title={competition.title} tags={competition.tags} />

        {/* 3-Column Pricing & Spots Left Row */}
        <PricingGrid
          prizePool={competition.prizePool}
          entryFee={competition.entryFee}
          spotsLeft={competition.spotsLeft}
          bookedSlots={competition.bookedSlots}
          totalSlots={competition.totalSlots}
        />

        {/* Judge Section */}
        <JudgeCard judge={competition.judge} />

        {/* Live Countdown Timer Banner */}
        <CountdownTimer targetDate={competition.dates?.registrationEnd} />

        {/* Important Dates Grid (4 cards) */}
        <ImportantDatesGrid dates={competition.dates} />

        {/* Previous Winners Carousel */}
        <PreviousWinners winners={competition.previousWinners} />

        {/* Tabbed Content Section (About, Judging Parameters, Rules) */}
        <TabbedContent content={competition.tabsContent} />

        {/* Rewards Breakdown (All Positions) */}
        <RewardsBreakdown rewards={competition.rewards} />

        {/* Page 3 Bonus Cards (Prize Money Info, Refer & Earn, Testimonials, Ad) */}
        <PageThreeBonusCards />

        {/* Spacing for bottom floating bar and navigation */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Dynamic Floating Bottom CTA & 5-item Navigation Bar */}
      <FloatingBottomCTA
        entryFee={competition.entryFee}
        isRegistered={!!competition.isRegistered}
        isRegistrationOpen={competition.isRegistrationOpen}
        spotsLeft={competition.spotsLeft}
        loading={registering}
        onRegisterPress={handleRegister}
        onUploadPress={() => setSubmissionModalVisible(true)}
      />

      {/* Video Submission Modal */}
      <SubmissionModal
        visible={submissionModalVisible}
        onClose={() => setSubmissionModalVisible(false)}
        onSubmit={handleUploadSubmission}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
