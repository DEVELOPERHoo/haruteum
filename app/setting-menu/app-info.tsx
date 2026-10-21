import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Info, Heart, ChevronRight } from "lucide-react-native";
import Constants from "expo-constants";
import { scale, fontScale } from "../../utils/responsive";
import { useToastStore } from "../../store/useToastStore";

export default function AppInfoScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();

  // app.json의 version 값 자동 동적 추출(default 1.0.0)
  const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

  const handleOpenLicense = () => {
    showToast("오픈소스 라이선스 정보를 불러오는 중입니다.");
  };

  return (
    <View style={styles.container}>
      {/* 1. 상단 뒤로가기 헤더 */}
      <View style={styles.header}>
        {/* 뒤로가기 헤더 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={16} color="rgba(136,136,136,0.6)" />
          <Text style={styles.backText}> 돌아가기</Text>
        </TouchableOpacity>
      </View>

      {/* 타이틀 */}
      <View style={styles.titleArea}>
        <Text style={styles.titleSub}>App Info & Licenses</Text>
        <Text style={styles.titleMain}>앱 정보 및 라이선스</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. 브랜드 & 현재 버전 정보 카드 */}
        <View style={styles.logoCard}>
          <Text style={styles.logoTitle}>하루 틈,</Text>
          <Text style={styles.versionText}>현재 버전 v{APP_VERSION}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              최신 버전을 사용 중이에요
            </Text>
          </View>
        </View>

        {/* 3. 오픈소스 라이선스 전용 카드 */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={handleOpenLicense}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#FCE4EC" }]}>
                <Info size={18} color="#D81B60" />
              </View>
              <Text style={styles.menuTitle}>오픈소스 라이선스</Text>
            </View>
            <ChevronRight size={18} color="#BCAAA4" />
          </TouchableOpacity>
        </View>

        {/* 4. 개발 팀 이야기 브랜드 카드 */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Heart size={16} color="#D81B60" />
            <Text style={styles.aboutTitle}>하루틈 팀 이야기</Text>
          </View>
          <Text style={styles.aboutDescription}>
            바쁜 일상 속에서도 나만의 작은 틈을 찾아{"\n"}소중한 순간을 기록할
            수 있도록 만들었습니다.
          </Text>
        </View>

        {/* 5. 저작권 카피라이트 */}
        <Text style={styles.copyrightText}>
          © 2026 Haruteum. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5",
    paddingHorizontal: scale(24),
    paddingTop: Platform.OS === "ios" ? 60 : 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    gap: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    color: "rgba(136,136,136,0.6)",
    letterSpacing: -0.3,
  },
  titleArea: {
    marginBottom: 28,
  },
  titleSub: {
    fontSize: 11,
    color: "#BCAAA4",
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleMain: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: "#3E2723",
  },
  logoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  logoTitle: {
    fontSize: fontScale(24),
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 6,
    letterSpacing: 2,
  },
  versionText: {
    fontSize: fontScale(13),
    color: "#BCAAA4",
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: "#EEDFDC",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: fontScale(12),
    color: "#3E2723",
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: scale(16),
    marginBottom: 16,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: fontScale(15),
    fontWeight: "600",
    color: "#3E2723",
  },
  aboutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: scale(20),
    marginBottom: 32,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: fontScale(14),
    fontWeight: "700",
    color: "#3E2723",
  },
  aboutDescription: {
    fontSize: fontScale(13),
    color: "#795548",
    lineHeight: 20,
  },
  copyrightText: {
    textAlign: "center",
    fontSize: fontScale(12),
    color: "#BCAAA4",
    marginBottom: 40,
  },
});
