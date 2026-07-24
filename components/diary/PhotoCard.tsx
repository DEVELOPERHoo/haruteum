// components/diary/PhotoCard.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDiaryStore } from "../../store/diaryStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_ASPECT_RATIO = 1;

export default function PhotoCard() {
  const { photoUris, setPhotoUris } = useDiaryStore();
  const [activeIndex, setActiveIndex] = useState(0);

  // 🌟 [핵심] 사용자가 갤러리에서 선택할 때 폰 OS가 제공하는 '진짜 원본 고유 문자열'을 매핑할 저장소
  const [photoKeys, setPhotoKeys] = useState<string[]>([]);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / CARD_WIDTH);
    setActiveIndex(index);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newAssets = result.assets;

      // 🌟 [물리 식별 지문 생성]
      // assetId가 없더라도, 원본 사진 데이터의 크기(fileSize), 가로(width), 세로(height)를 조합하면
      // 해상도가 같은 다른 사진은 통과하고, '동일한 사진 원본'은 완벽히 잡아내는 고유 지문이 탄생합니다.
      const incomingKeys = newAssets.map(
        (asset) => `${asset.fileSize}-${asset.width}x${asset.height}`,
      );

      // 1. 이번 세션에서 한 번에 여러 장 고를 때 자기들끼리 겹치는 내부 중복 제거
      const uniqueIndices: number[] = [];
      const currentSessionKeys = [...photoKeys];

      incomingKeys.forEach((key, index) => {
        // 이미 등록된 지문 저장소에 똑같은 용량+해상도를 가진 녀석이 있다면 제외
        if (currentSessionKeys.includes(key)) {
          return;
        }
        currentSessionKeys.push(key);
        uniqueIndices.push(index);
      });

      const uniqueAssets = uniqueIndices.map((i) => newAssets[i]);

      // 중복 안내 얼럿
      if (uniqueAssets.length < newAssets.length) {
        if (uniqueAssets.length === 0) {
          alert("이미 추가된 사진이거나 중복된 사진입니다. ☺️");
          return;
        } else {
          alert("중복된 사진을 제외하고 추가했습니다! ✨");
        }
      }

      // 2. 검증을 마친 순수 주소와 지문들만 매핑 업데이트
      const verifiedUris = uniqueAssets.map((asset) => asset.uri);
      const verifiedKeys = uniqueAssets.map(
        (asset) => `${asset.fileSize}-${asset.width}x${asset.height}`,
      );

      setPhotoKeys([...photoKeys, ...verifiedKeys]);
      setPhotoUris([...photoUris, ...verifiedUris]);
    }
  };

  const removeImage = (index: number) => {
    // 삭제할 때 스토어의 주소와 로컬 지문을 쌍으로 같이 지워줍니다.
    const filteredUris = photoUris.filter((_, i) => i !== index);
    const filteredKeys = photoKeys.filter((_, i) => i !== index);

    setPhotoUris(filteredUris);
    setPhotoKeys(filteredKeys);

    if (activeIndex >= filteredUris.length && activeIndex > 0) {
      setActiveIndex(filteredUris.length);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        nestedScrollEnabled={true}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
      >
        {photoUris.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.slideWrapper}>
            <Image
              source={{ uri }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.deleteBadge}
              activeOpacity={0.7}
              onPress={() => removeImage(index)}
            >
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>
                {index + 1} / {photoUris.length + 1}
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.slideWrapper}>
          <TouchableOpacity
            style={styles.addSlideButton}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <View style={styles.plusCircle}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.addText}>사진 추가하기</Text>
            {photoUris.length > 0 && (
              <Text style={styles.currentCountText}>
                현재 {photoUris.length}장 선택됨
              </Text>
            )}
          </TouchableOpacity>
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>
              {photoUris.length + 1} / {photoUris.length + 1}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {Array.from({ length: photoUris.length + 1 }).map((_, i) => (
          <View
            key={i}
            style={[styles.indicatorDot, activeIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginVertical: 16, alignItems: "center" },
  scrollView: {
    width: CARD_WIDTH,
    height: CARD_WIDTH / CARD_ASPECT_RATIO,
    borderRadius: 24,
    backgroundColor: "#F8F4F2",
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  slideWrapper: {
    width: CARD_WIDTH,
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: { width: "100%", height: "100%" },
  deleteBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(62, 39, 35, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 10,
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: Platform.OS === "ios" ? -2 : -1,
  },
  indexBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indexText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  addSlideButton: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FAF6F4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EFE7E4",
    borderStyle: "dashed",
    borderRadius: 24,
  },
  plusCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEDFDC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  plusIcon: {
    fontSize: 26,
    color: "#D4A59A",
    fontWeight: "300",
    marginTop: Platform.OS === "ios" ? -2 : 0,
  },
  addText: { fontSize: 14, color: "#3E2723", fontWeight: "500" },
  currentCountText: {
    fontSize: 11,
    color: "rgba(136, 136, 136, 0.5)",
    marginTop: 6,
  },
  indicatorContainer: { flexDirection: "row", marginTop: 14, gap: 6 },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EEDFDC",
  },
  activeDot: { backgroundColor: "#D4A59A", width: 14 },
});
