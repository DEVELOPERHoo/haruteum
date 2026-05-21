// app/(tabs)/diary.tsx
import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

  useEffect(() => {
    if (pathname === "/diary" || pathname === "/") {
      horizontalScrollRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [pathname]);

  const handleHorizontalScroll = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    if (contentOffsetX > width * 0.4) {
      router.replace("/history");
    }
  };

  return (
    // 🌟 1. 최외곽에 KeyboardAvoidingView를 배치해서 전체 화면 비율 꼬임을 원천 봉쇄!
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined} // 안드로이드는 시스템 매커니즘에 맡기기 위해 undefined가 안전해!
      style={styles.baseContainer}
    >
      {/* 🌟 2. 빈 곳 누르면 키보드가 내려가는 터치 영역을 그 다음 레이어로 배치 */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* 좌우 스와이프를 담당하는 가로 ScrollView */}
        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleHorizontalScroll}
          contentContainerStyle={styles.horizontalWrapper}
        >
          {/* 1번 페이지: 실제 다이어리 폼 공간 */}
          <View style={styles.pageContainer}>
            {/* 세로 스크롤로 콘텐츠 안 자르고 보존 */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <DateHeader />
              <PhotoCard />
              <TextInput />
              <EmojiPicker />
              <SubmitButton />
            </ScrollView>
          </View>

          {/* 2번 페이지: 스와이프 제스처용 빈 공간 */}
          <View style={styles.pageContainer} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  baseContainer: { flex: 1, backgroundColor: "#FAF7F5" },
  horizontalWrapper: { width: width * 2 },
  pageContainer: { width: width, flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 60,
  },
});
