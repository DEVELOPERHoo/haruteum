import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import {
  Shield,
  FileText,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";

export default function LegalSection() {
  const openExternalLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("알림", "연결할 수 없는 링크입니다.");
      }
    } catch (error) {
      Alert.alert("오류", "페이지를 여는 중 문제가 발생했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <Text style={styles.sectionHeader}>약관 및 지원</Text>

      {/* 메뉴 카드 */}
      <View style={styles.menuCard}>
        {/* 개인정보 처리방침 */}
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

        {/* 서비스 이용약관 */}
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

        <View style={styles.divider} />

        {/* 문의하기 */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => openExternalLink("mailto:support@haruteum.com")}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF8E1" }]}>
              <HelpCircle size={18} color="#F57F17" />
            </View>
            <Text style={styles.menuTitle}>문의하기</Text>
          </View>
          <ChevronRight size={18} color="#BCAAA4" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#BCAAA4",
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
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
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3E2723",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4EDE9",
  },
});
