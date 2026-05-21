// components/diary/PhotoCard.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDiaryStore } from "../../store/diaryStore";

export default function PhotoCard() {
  const { photoUri, setPhotoUri } = useDiaryStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1], // 인스타 감성 1:1 정방형 크롭
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={pickImage}
    >
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.plusIcon}>+</Text>
          <Text style={styles.placeholderText}>
            오늘의 특별한 순간 사진 남기기
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F8F4F2",
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#F2EAE7",
  },
  image: { width: "100%", height: "100%" },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  plusIcon: { fontSize: 32, color: "#AAA", marginBottom: 8, fontWeight: "300" },
  placeholderText: { fontSize: 14, color: "#AAA", fontWeight: "500" },
});
