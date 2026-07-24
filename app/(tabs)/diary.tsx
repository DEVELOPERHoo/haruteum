// app/(tabs)/diary.tsx
import React, { useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
  const keyboardScrollRef = useRef<KeyboardAwareScrollView>(null);

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
        {/* 1번 페이지: 다이어리 폼 */}
        <KeyboardAwareScrollView
          ref={keyboardScrollRef} // ← ref 추가
          style={styles.pageContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={20} // ← 작게 유지
          enableAutomaticScroll={false} // ← 자동 스크롤 끄기
        >
          <DateHeader />
          <PhotoCard />
          <TextInput scrollRef={keyboardScrollRef} />
          <EmojiPicker />
          <SubmitButton />
        </KeyboardAwareScrollView>

        {/* 2번 페이지: 스와이프용 빈 공간 */}
        <View style={styles.pageContainer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: { flex: 1, backgroundColor: "#FAF7F5" },
  horizontalWrapper: { width: width * 2 },
  pageContainer: { width, flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 60,
  },
});
