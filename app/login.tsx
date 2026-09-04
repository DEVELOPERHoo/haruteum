// app/login.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { login } from "@react-native-seoul/kakao-login";
import { ArrowLeft } from "lucide-react-native";
import { loginWithKakao } from "../services/authService";

export default function LoginScreen() {
  const router = useRouter();

  const handleKakaoLogin = async () => {
    try {
      console.log("카카오 로그인 프로세스 시작...");
      const tokenResult = await login();

      console.log("✅ 로그인 성공! 토큰 획득:", tokenResult.accessToken);

      // TODO: 백엔드 API 서버가 있다면 토큰 전송
      await loginWithKakao(tokenResult.accessToken); // 백엔드 전송
      router.replace("/home");
    } catch (error: any) {
      // 🌟 디버깅을 위해 상세 에러 로그를 터미널에 출력합니다.
      console.error("❌ 카카오 로그인 에러 상세:", error);

      if (error.code === "E_CANCELLED_OPERATION") {
        Alert.alert(
          "로그인 취소",
          "서비스를 이용하시려면 로그인이 필요합니다. ☺️",
        );
      } else {
        // 상세 에러 메시지를 얼럿으로도 띄워 원인 파악을 돕습니다.
        Alert.alert(
          "오류",
          `로그인 처리 중 문제가 발생했습니다.\n(${error?.message || "알 수 없는 에러"})`,
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* 뒤로가기 헤더 */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} color="#3E2723" />
      </TouchableOpacity>

      {/* 감성 타이틀 영역 */}
      <View style={styles.titleWrapper}>
        <Text style={styles.emoji}>🌙</Text>
        <Text style={styles.mainTitle}>
          오늘의 기억을{"\n"}안전하게 간직할 시간
        </Text>
        <Text style={styles.subTitle}>
          기록을 이미지로 저장하고 공유하려면{"\n"}카카오 간편 로그인이
          필요해요.
        </Text>
      </View>

      {/* 💛 카카오 로그인 버튼 */}
      <TouchableOpacity
        style={styles.kakaoButton}
        activeOpacity={0.8}
        onPress={handleKakaoLogin}
      >
        <Text style={styles.kakaoIcon}>💬</Text>
        <Text style={styles.kakaoButtonText}>카카오 3초 간편 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5",
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  backButton: {
    marginTop: Platform.OS === "ios" ? 60 : 20,
    alignSelf: "flex-start",
    padding: 4,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },
  emoji: { fontSize: 44, marginBottom: 16 },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3E2723",
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: "rgba(62, 39, 35, 0.6)",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 14,
    fontWeight: "400",
  },
  kakaoButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#FEE500",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kakaoIcon: { fontSize: 18 },
  kakaoButtonText: { fontSize: 16, color: "#191919", fontWeight: "600" },
});
