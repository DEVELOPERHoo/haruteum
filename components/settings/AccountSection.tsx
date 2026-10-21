// components/settings/AccountSection.tsx
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, UserCheck, ShieldCheck } from "lucide-react-native";
import { scale } from "../../utils/responsive";

export default function AccountSection() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionCategory}>내 계정</Text>

      <View style={styles.menuCard}>
        {/* 1. 사용자 정보 (은은한 소프트 웜 피치/코랄 톤 적용) */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push("/setting-menu/user-info")}
        >
          <View style={styles.menuLeft}>
            {/* 🌟 기존의 진한 핑크/레드를 걷어내고 부드러운 피치/코랄 톤(#FDF0ED / #D87A68) 적용 */}
            <View style={[styles.iconCircle, { backgroundColor: "#FDF0ED" }]}>
              <UserCheck size={18} color="#D87A68" />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>사용자 정보</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#BCAAA4" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 2. 계정 관리 (차분한 웜 베이지) */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push("/setting-menu/account")}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, { backgroundColor: "#F5ECE9" }]}>
              <ShieldCheck size={18} color="#8D6E63" />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>계정 관리</Text>
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
    marginBottom: 20,
  },
  sectionCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#BCAAA4",
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: scale(16),
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
    fontWeight: "500",
    color: "#3E2723",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4EDE9",
  },
});
