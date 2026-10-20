// app/setting-menu/policy.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Shield, FileText, ChevronRight } from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";
import { useToastStore } from "../../store/useToastStore";

export default function PolicyScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();

  const openExternalLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        showToast("연결할 수 없는 링크입니다.");
      }
    } catch (error) {
      showToast("페이지를 여는 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관 및 정책</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 약관 메뉴 카드 */}
        <View style={styles.menuCard}>
          {/* 1. 개인정보 처리방침 */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => openExternalLink("https://haruteum.com/privacy")}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#E8EAF6" }]}>
                <Shield size={18} color="#3F51B5" />
              </View>
              <Text style={styles.menuTitle}>개인정보 처리방침</Text>
            </View>
            <ChevronRight size={18} color="#BCAAA4" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 2. 서비스 이용약관 */}
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => openExternalLink("https://haruteum.com/terms")}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: "#E0F2F1" }]}>
                <FileText size={18} color="#00796B" />
              </View>
              <Text style={styles.menuTitle}>서비스 이용약관</Text>
            </View>
            <ChevronRight size={18} color="#BCAAA4" />
          </TouchableOpacity>
        </View>

        {/* 법적 안내 문구 */}
        <Text style={styles.infoNoticeText}>
          하루틈은 이용자의 개인정보를 소중하게 다루며, 관련 법령을 준수합니다.
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
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: fontScale(20),
    fontWeight: "700",
    color: "#3E2723",
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
  divider: {
    height: 1,
    backgroundColor: "#F4EDE9",
  },
  infoNoticeText: {
    fontSize: fontScale(12),
    color: "#BCAAA4",
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
