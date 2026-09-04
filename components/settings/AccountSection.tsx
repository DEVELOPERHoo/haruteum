// components/settings/AccountSection.tsx
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, User, Settings } from "lucide-react-native";

export default function AccountSection() {
  const router = useRouter();

  // 사용자 정보 버튼 클릭 핸들러
  const handleUserInfo = () => {
    Alert.alert("사용자 정보 👤", "카카오 계정으로 로그인 중입니다.");
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionCategory}>내 계정</Text>

      <View style={styles.menuCard}>
        {/* 1. 사용자 정보 버튼 */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={handleUserInfo}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, { backgroundColor: "#F5ECE9" }]}>
              <User size={18} color="#8D6E63" />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>사용자 정보</Text>
              <Text style={styles.menuSubTitle}>
                연결된 프로필 및 계정 정보
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#BCAAA4" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 2. 계정 관리 버튼 (로그아웃 및 탈퇴 상세 페이지로 이동) */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push("/setting-menu/account")}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, { backgroundColor: "#EEDFDC" }]}>
              <Settings size={18} color="#3E2723" />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>계정 관리</Text>
              <Text style={styles.menuSubTitle}>로그아웃 및 탈퇴</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#BCAAA4" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionCategory: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8D6E63",
    marginBottom: 10,
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
    paddingVertical: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextWrapper: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3E2723",
    marginBottom: 2,
  },
  menuSubTitle: {
    fontSize: 12,
    color: "rgba(136, 136, 136, 0.7)",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4EDE9",
  },
});
