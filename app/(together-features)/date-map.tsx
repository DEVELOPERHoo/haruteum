// app/(together-features)/date-map.tsx
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";

export default function DateMapScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.navHeaderTitle}>데이트 지도 🗺️</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={36} color="#D87A68" />
          <Text style={styles.placeholderTitle}>우리만의 발자국 지도</Text>
          <Text style={styles.placeholderDesc}>
            다녀온 데이트 장소와 사진을 지도 위에 핀으로 꽂아보세요.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAF7F5" },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navHeaderTitle: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: "#3E2723",
  },
  headerSpacer: { width: 36 },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: scale(28),
    alignItems: "center",
    width: "100%",
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  placeholderTitle: {
    fontSize: fontScale(17),
    fontWeight: "700",
    color: "#3E2723",
    marginTop: 12,
    marginBottom: 6,
  },
  placeholderDesc: {
    fontSize: fontScale(12),
    color: "#8D6E63",
    textAlign: "center",
    lineHeight: 18,
  },
});
