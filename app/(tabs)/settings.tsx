import React, { useEffect, useRef } from "react";
import { StyleSheet, ScrollView, Text, View, Dimensions } from "react-native";
import { useRouter, usePathname } from "expo-router";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const horizontalScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (pathname === "/settings") {
      horizontalScrollRef.current?.scrollTo({ x: width, animated: false });
    }
  }, [pathname]);

  const handleHorizontalScroll = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    if (contentOffsetX < width * 0.6) {
      router.replace("/history");
    }
  };

  return (
    <View style={styles.baseContainer}>
      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleHorizontalScroll}
        contentContainerStyle={styles.horizontalWrapper}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageContainer} />

        <View style={styles.pageContainer}>
          <Text style={styles.text}>설정 화면</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    backgroundColor: "#FAF7F5",
  },
  horizontalWrapper: { width: width * 2 },
  pageContainer: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { fontSize: 18, color: "#333" },
});
