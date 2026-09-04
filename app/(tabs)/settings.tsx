// app/(tabs)/settings.tsx
import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter, usePathname, Stack } from "expo-router";

// 🌟 분리해둔 메뉴 섹션 컴포넌트 불러오기
import AccountSection from "../../components/settings/AccountSection";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const horizontalScrollRef = useRef<ScrollView>(null);
  const isNavigating = useRef(false);

  // 1. 화면 진입 시 오른쪽 끝(Settings 실제 위치, x: width)으로 초기 스크롤 세팅
  useEffect(() => {
    if (pathname === "/settings") {
      isNavigating.current = false;
      requestAnimationFrame(() => {
        horizontalScrollRef.current?.scrollTo({ x: width, animated: false });
      });
    }
  }, [pathname]);

  // 2. 왼쪽으로 스와이프 시 History 화면으로 이동하는 스크롤 감지
  const handleScroll = (e: any) => {
    if (isNavigating.current) return;
    const contentOffsetX = e.nativeEvent.contentOffset.x;

    if (contentOffsetX < width * 0.6) {
      isNavigating.current = true;
      router.replace("/history");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.horizontalWrapper}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1️⃣ 스와이프 버퍼 영역 (History 방향) */}
        <View style={styles.pageContainer} />

        {/* 2️⃣ Settings 실제 컨텐츠 영역 (하단 고정 레이아웃 적용) */}
        <View style={[styles.pageContainer, styles.settingMainWrapper]}>
          {/* 상단 및 중앙: 메뉴 스크롤 영역 */}
          <ScrollView
            style={styles.settingScroll}
            contentContainerStyle={styles.settingContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.headerSub}>환경설정</Text>
              <Text style={styles.headerTitle}>설정</Text>
            </View>

            {/* 분리된 메뉴 섹션들 */}
            <AccountSection />

            {/* 추후 추가될 영역 예시 (DisplaySection, HelpSection 등) */}
          </ScrollView>

          {/* 🌟 3️⃣ 화면 맨 하단에 완전 고정된 버전 텍스트 */}
          <View style={styles.footerWrapper}>
            <Text style={styles.footerNote}>HARUTEUM v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5",
  },
  horizontalWrapper: {
    width: width * 2,
  },
  pageContainer: {
    width,
    flex: 1,
  },
  // 🌟 [핵심] 설정 화면 전체 레이아웃 (스크롤 영역 + 하단 고정 푸터)
  settingMainWrapper: {
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
  },
  settingScroll: {
    flex: 1,
  },
  settingContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 28,
  },
  headerSub: {
    fontSize: 12,
    color: "#BCAAA4",
    letterSpacing: 2,
    fontWeight: "500",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#3E2723",
    letterSpacing: -0.5,
  },
  // 🌟 [핵심] 푸터 텍스트 전용 고정 스타일
  footerWrapper: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footerNote: {
    textAlign: "center",
    fontSize: 10,
    color: "#BCAAA4",
    letterSpacing: 2,
    fontWeight: "500",
  },
});
