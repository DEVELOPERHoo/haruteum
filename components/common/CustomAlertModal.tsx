// components/common/CustomAlertModal.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useAlertStore } from "../../store/useAlertStore";
import { fontScale, scale } from "../../utils/responsive";

export default function CustomAlertModal() {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <TouchableWithoutFeedback onPress={hideAlert}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.alertContainer}>
              {/* 상단 감성 아이콘 / 미니 포인트 */}
              <View style={styles.badge} />

              {/* 제목 */}
              {title ? <Text style={styles.title}>{title}</Text> : null}

              {/* 본문 메시지 */}
              {message ? <Text style={styles.message}>{message}</Text> : null}

              {/* 하단 버튼 그룹 */}
              <View
                style={[
                  styles.buttonGroup,
                  buttons && buttons.length > 2 && { flexDirection: "column" },
                ]}
              >
                {buttons?.map((btn, index) => {
                  const isCancel = btn.style === "cancel";
                  const isDestructive = btn.style === "destructive";

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      style={[
                        styles.button,
                        isCancel && styles.cancelButton,
                        isDestructive && styles.destructiveButton,
                      ]}
                      onPress={() => {
                        hideAlert();
                        if (btn.onPress) btn.onPress();
                      }}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          isCancel && styles.cancelButtonText,
                          isDestructive && styles.destructiveButtonText,
                        ]}
                      >
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(62, 39, 35, 0.4)", // 따뜻한 우드 톤의 반투명 오버레이
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(32),
  },
  alertContainer: {
    width: "100%",
    backgroundColor: "#FAF7F5", // 하루틈 메인 배경색
    borderRadius: 24,
    paddingHorizontal: scale(24),
    paddingTop: scale(24),
    paddingBottom: scale(20),
    alignItems: "center",
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  badge: {
    width: 32,
    height: 4,
    backgroundColor: "#D4A59A", // 하루틈 포인트 로즈 골드 톤
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#3E2723",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: fontScale(14),
    color: "#7A6863",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 48,
    backgroundColor: "#3E2723", // 기본 확인 버튼 (다크 브라운)
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: fontScale(15),
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cancelButton: {
    backgroundColor: "#EFE8E4", // 취소 버튼 (연한 베이지)
  },
  cancelButtonText: {
    color: "#7A6863",
  },
  destructiveButton: {
    backgroundColor: "#FBE9E7", // 경고/탈퇴 버튼 (연한 레드)
  },
  destructiveButtonText: {
    color: "#D84315",
  },
});
