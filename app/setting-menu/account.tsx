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
import { useRouter } from "expo-router";
import { useAlertStore } from "../../store/useAlertStore";
import { useToastStore } from "../../store/useToastStore";
import { ArrowLeft, LogOut, UserX, ChevronRight } from "lucide-react-native";
import { logoutUser, deleteAccount } from "../../services/authService";
import { scale } from "../../utils/responsive";

export default function AccountDetailScreen() {
  const router = useRouter();
  const { showAlert } = useAlertStore();
  const { showToast } = useToastStore();

  // 방어 로직이 적용된 안전한 로그아웃 처리 함수
  const handleLogout = () => {
    showAlert("로그아웃", "정말 로그아웃 하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();
            showToast("안전하게 로그아웃되었습니다.");
            router.replace("/login");
          } catch (error) {
            console.error("로그아웃 처리 중 에러:", error);
            router.replace("/login");
          }
        },
      },
    ]);
  };

  // ⚠️ 회원 탈퇴 처리
  const handleUnlink = () => {
    showAlert(
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
              await logoutUser();
              showAlert("처리 완료", "회원 탈퇴가 완료되었습니다.");
              router.replace("/login");
            } catch (error) {
              console.log("삭제 에러 상세:", error);
              showAlert("오류", "탈퇴 처리 중 문제가 발생했습니다.");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.titleSub}>Account Settings</Text>
        <Text style={styles.titleMain}>계정 관리</Text>
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
    fontSize: 20,
    fontWeight: "700",
    color: "#3E2723",
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
