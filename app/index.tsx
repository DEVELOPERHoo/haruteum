// app/index.tsx
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // 은은한 페이드인 애니메이션용

  useEffect(() => {
    // 1️⃣ 로고가 스르륵 나타나는 감성 페이드인 애니메이션 (1초 동안)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 2️⃣ 로그인 상태 체크 및 자동 라우팅 로직
    const checkLoginStatus = async () => {
      try {
        // 실제 유저 토큰이나 로그인 여부(예: 'true')가 저장되어 있는지 확인
        const userToken = await AsyncStorage.getItem("userToken");

        // 💡 감성 스플래시를 최소 2.5초 동안 강제로 보여주기 위해 타이머 설정
        setTimeout(() => {
          if (userToken) {
            // 로그인 기록이 있다면? 👉 모드 선택 카드가 있는 홈으로!
            router.replace("/home");
          } else {
            // 로그인 기록이 없다면? 👉 로그인 화면으로!
            router.replace("/home");
          }
        }, 2500);
      } catch (error) {
        console.error("로그인 체크 중 에러 발생:", error);
        router.replace("/login"); // 에러 발생 시 안전하게 로그인으로 리다이렉트
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      {/* 타이틀과 서브 문구가 시처럼 투명하게 피어오르는 연출 */}
      <Animated.View style={[styles.splashBox, { opacity: fadeAnim }]}>
        <Text style={styles.subTitle}>우리들만의 작은 기록</Text>
        <Text style={styles.mainTitle}>하루 틈</Text>
      </Animated.View>

      {/* 하단에 은은하게 돌아가는 베이지 톤 로딩 인디케이터 */}
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#D4A59A" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5", // 우리가 약속한 포근한 밀크티 베이지 색상
    alignItems: "center",
    justifyContent: "center",
  },
  splashBox: {
    alignItems: "center",
    marginBottom: 40,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#BCAAA4",
    letterSpacing: 2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3E2723", // 깊은 초콜릿 브라운으로 감성 마감
    letterSpacing: 4,
  },
  loadingBox: {
    position: "absolute",
    bottom: 60, // 화면 맨 아래에서 살짝 위쪽에 안착
  },
});
