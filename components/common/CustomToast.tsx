// components/common/CustomToast.tsx
import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Animated, View } from "react-native";
import { useToastStore } from "../../store/useToastStore";
import { fontScale, scale } from "../../utils/responsive";

export default function CustomToast() {
  const { visible, message } = useToastStore();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible && (opacity as any)._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: scale(24),
    right: scale(24),
    alignItems: "center",
    zIndex: 9999,
  },
  toastContent: {
    backgroundColor: "#3E2723", // 하루틈 시그니처 딥 브라운
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: "#FAF7F5",
    fontSize: fontScale(14),
    fontWeight: "500",
    textAlign: "center",
  },
});
