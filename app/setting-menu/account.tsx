// app/setting-menu/account.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, LogOut, UserX, ChevronRight } from "lucide-react-native";
import { logout } from "@react-native-seoul/kakao-login";
import * as SecureStore from "expo-secure-store";
import { deleteAccount } from "../../services/authService";

export default function AccountDetailScreen() {
  const router = useRouter();

  // 🚪 방어 로직이 적용된 안전한 로그아웃 처리 함수
  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            // 1. 카카오 SDK 로그아웃 시도
            await logout();
            console.log("✅ 카카오 SDK 로그아웃 성공");
          } catch (error: any) {
            // 🌟 핵심 방어 코드: 토큰이 없다는 에러가 나도 이미 로그아웃된 상태이므로 정상 진행합니다.
            console.log(
              "ℹ️ 카카오 토큰이 없거나 이미 만료됨 (정상적으로 로컬 정리 진행):",
              error?.message || error,
            );
          } finally {
            // 2. 에러 발생 여부와 관계없이 저장소 토큰 삭제 및 화면 이동은 '무조건' 실행
            try {
              await SecureStore.deleteItemAsync("accessToken");
            } catch (e) {
              console.error("SecureStore 삭제 중 에러:", e);
            }

            Alert.alert("완료", "안전하게 로그아웃되었습니다.");

            // 3. 로그인 화면으로 자연스럽게 전환
            router.replace("/login");
          }
        },
      },
    ]);
  };

  // ⚠️ 회원 탈퇴 처리
  const handleUnlink = () => {
    Alert.alert(
      "회원 탈퇴",
      "탈퇴 시 저장된 일기 데이터가 모두 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠어요?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert("처리 완료", "회원 탈퇴가 완료되었습니다.");
              router.replace("/login");
            } catch (error) {
              console.log("삭제 에러 상세:", error);
              Alert.alert("오류", "탈퇴 처리 중 문제가 발생했습니다.");
            }
          },
        },
      ],
    );
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
        <Text style={styles.headerTitle}>계정 관리</Text>
      </View>

      {/* 로그아웃 및 회원 탈퇴 버튼 카드 */}
      <View style={styles.menuCard}>
        {/* 1. 로그아웃 버튼 */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, { backgroundColor: "#EEDFDC" }]}>
              <LogOut size={18} color="#3E2723" />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuTitle}>로그아웃</Text>
              <Text style={styles.menuSubTitle}>현재 기기에서 로그아웃</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#BCAAA4" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 2. 회원 탈퇴 버튼 */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={handleUnlink}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.iconCircle, { backgroundColor: "#FBE9E7" }]}>
              <UserX size={18} color="#D84315" />
            </View>
            <View style={styles.menuTextWrapper}>
              <Text style={[styles.menuTitle, { color: "#D84315" }]}>
                회원 탈퇴
              </Text>
              <Text style={styles.menuSubTitle}>
                계정 및 모든 일기 데이터 삭제
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#BCAAA4" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5",
    paddingHorizontal: 24,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#3E2723",
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
