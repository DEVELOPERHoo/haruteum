import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { checkAuth, refreshAccessToken } from "../services/apiClient";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 로그인 체크 없이 2.5초 후 바로 홈으로
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const checkLoginStatus = async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");

    // 1. 토큰 자체가 없으면 로그인으로
    if (!accessToken) {
      router.replace("/login");
      return;
    }

    try {
      // 2. 토큰 유효성 검사
      const isValid = await checkAuth();

      if (isValid) {
        // 3. 유효하면 홈으로
        router.replace("/home");
      } else {
        // 4. 만료됐으면 refresh 시도
        try {
          await refreshAccessToken();
          router.replace("/home"); // 갱신 성공 → 홈으로
        } catch {
          // 갱신 실패 → 로그인으로
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          router.replace("/login");
        }
      }
    } catch {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.splashBox, { opacity: fadeAnim }]}>
        <Text style={styles.subTitle}>우리들만의 작은 기록</Text>
        <Text style={styles.mainTitle}>하루 틈</Text>
      </Animated.View>

      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#D4A59A" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5",
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
    color: "#3E2723",
    letterSpacing: 4,
  },
  loadingBox: {
    position: "absolute",
    bottom: 60,
  },
});
