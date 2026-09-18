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

import AccountSection from "../../components/settings/AccountSection";
import LegalSection from "../../components/settings/LegalSection";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const pathname = usePathname();
  const router = useRouter();
  const horizontalScrollRef = useRef<ScrollView>(null);
  const isNavigating = useRef(false);

  useEffect(() => {
    if (pathname === "/settings") {
      isNavigating.current = false;
      requestAnimationFrame(() => {
        horizontalScrollRef.current?.scrollTo({ x: width, animated: false });
      });
    }
  }, [pathname]);

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
        {/* 1️⃣ 스와이프 버퍼 영역 */}
        <View style={styles.pageContainer} />

        {/* 2️⃣ Settings 컨텐츠 영역 */}
        <View style={[styles.pageContainer, styles.settingMainWrapper]}>
          <ScrollView
            style={styles.settingScroll}
            contentContainerStyle={styles.settingContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.headerSub}>환경설정</Text>
              <Text style={styles.headerTitle}>설정</Text>
            </View>

            <AccountSection />

            <LegalSection />
          </ScrollView>

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
    marginBottom: 20,
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
