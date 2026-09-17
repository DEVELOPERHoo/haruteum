import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { apiRequest, parseResponse } from "../../services/apiClient";

interface UserInfo {
  nickname: string;
}

export default function UserInfoScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await apiRequest("/api/v1/user/me", { method: "GET" });
      const data = await parseResponse(res);
      setUserInfo(data);
      setEditedName(data.nickname);
    } catch (error) {
      console.log(`[fetchUserInfo] ${error.message}`);
      if (error.message.includes("로그인이 필요")) {
        router.replace("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNamePress = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSave = async () => {
    try {
      const res = await apiRequest("/api/v1/user/me", {
        method: "PUT",
        body: JSON.stringify({ nickname: editedName }),
      });
      await parseResponse(res);
      setUserInfo((prev) => (prev ? { ...prev, nickname: editedName } : prev));
      setIsEditing(false);
    } catch (error) {
      console.log(`[handleSave] ${error.message}`);
      if (error.message.includes("로그인이 필요")) {
        router.replace("/login");
      }
    }
  };

  const handleCancel = () => {
    setEditedName(userInfo?.nickname ?? "");
    setIsEditing(false);
    inputRef.current?.blur();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={16} color="rgba(136,136,136,0.6)" />
          <Text style={styles.backText}> 돌아가기</Text>
        </TouchableOpacity>

        {/* 저장 버튼 — 편집 모드일 때만 등장 */}
        {isEditing && (
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>저장</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 타이틀 */}
      <View style={styles.titleArea}>
        <Text style={styles.titleSub}>MY ACCOUNT</Text>
        <Text style={styles.titleMain}>사용자 정보</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#D4A59A" />
        </View>
      ) : (
        <View style={styles.card}>
          {/* 닉네임 — 누르면 편집 */}
          <TouchableOpacity
            style={styles.infoRow}
            onPress={handleNamePress}
            activeOpacity={0.7}
          >
            <Text style={styles.infoLabel}>닉네임</Text>
            {isEditing ? (
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            ) : (
              <View style={styles.valueRow}>
                <Text style={styles.infoValue}>
                  {userInfo?.nickname ?? "-"}
                </Text>
                <Text style={styles.editHint}>탭하여 수정</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.divider} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F5",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 60 : 20,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    color: "rgba(136,136,136,0.6)",
    letterSpacing: -0.3,
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F2EAE7",
  },
  cancelBtnText: {
    fontSize: 13,
    color: "#A2948F",
    fontWeight: "500",
  },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#3E2723",
  },
  saveBtnText: {
    fontSize: 13,
    color: "#FAF7F5",
    fontWeight: "500",
  },
  titleArea: {
    marginBottom: 28,
  },
  titleSub: {
    fontSize: 11,
    color: "#BCAAA4",
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleMain: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2723",
    letterSpacing: -0.5,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#F4EDE9",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3E2723",
  },
  valueRow: {
    alignItems: "flex-end",
    gap: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "rgba(136,136,136,0.8)",
    letterSpacing: -0.3,
  },
  editHint: {
    fontSize: 10,
    color: "#D4A59A",
    letterSpacing: -0.2,
  },
  input: {
    fontSize: 14,
    color: "#3E2723",
    borderBottomWidth: 1.5,
    borderBottomColor: "#D4A59A",
    paddingBottom: 2,
    minWidth: 120,
    textAlign: "right",
  },
});
