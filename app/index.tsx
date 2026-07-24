// 초기 메인 화면 로딩창
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 로고 페이드인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 로그인 체크 없이 2.5초 후 바로 홈으로
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
