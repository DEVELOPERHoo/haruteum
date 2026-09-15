// app/(tabs)/diary.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import DateHeader from "../../components/diary/DateHeader";
import PhotoCard from "../../components/diary/PhotoCard";
import TextInput from "../../components/diary/TextInput";
import EmojiPicker from "../../components/diary/EmojiPicker";
import SubmitButton from "../../components/diary/SubmitButton";

const { width } = Dimensions.get("window");

export default function DiaryScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const horizontalScrollRef = useRef<ScrollView>(null);
  const verticalScrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    if (pathname === "/diary" || pathname === "/") {
      horizontalScrollRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [pathname]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // 키보드 완전히 올라온 후 스크롤
      if (pendingScrollY.current !== null) {
        verticalScrollRef.current?.scrollTo({
          y: pendingScrollY.current,
          animated: true,
        });
        pendingScrollY.current = null;
      }
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const pendingScrollY = useRef<number | null>(null);

  // TextInput 포커스 시 y값만 저장
  const handleTextInputFocused = (y: number) => {
    pendingScrollY.current = y - 300; // ← 스크롤할 위치 저장
  };

  const handleHorizontalScroll = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    if (contentOffsetX > width * 0.4) {
      router.replace("/history");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.baseContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleHorizontalScroll}
        contentContainerStyle={styles.horizontalWrapper}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={keyboardHeight === 0} // ← 키보드 올라오면 가로 스크롤 막기
      >
        {/* 1번 페이지: 다이어리 폼 */}
        <View style={styles.pageContainer}>
          <ScrollView
            ref={verticalScrollRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <DateHeader />
            <PhotoCard />
            <TextInput onFocused={handleTextInputFocused} />
            <EmojiPicker />
            <SubmitButton />
          </ScrollView>
        </View>

        {/* 2번 페이지 */}
        <View style={styles.pageContainer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  baseContainer: { flex: 1, backgroundColor: "#FAF7F5" },
  horizontalWrapper: { width: width * 2 },
  pageContainer: { width, flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 40,
  },
});
