// app/(together-features)/connect-partner.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { ArrowLeft, Copy, Key, HeartHandshake } from "lucide-react-native";
import { scale, fontScale } from "../../utils/responsive";
import { useToastStore } from "../../store/useToastStore";
import { useCoupleStore } from "../../store/useCoupleStore";
import {
  connectCouple,
  fetchInviteCode,
  verifyInviteCode,
} from "../../services/coupleService";
import { getAccessToken } from "../../services/authService";

type TabMode = "invite" | "receive";

export default function ConnectPartnerScreen() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const { connectPartner } = useCoupleStore();

  const [activeTab, setActiveTab] = useState<TabMode>("invite");
  const [partnerCode, setPartnerCode] = useState("");

  const [myInviteCode, setMyInviteCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);

  // 🌟 백엔드 연동 로직
  const generateInviteCode = async () => {
    setIsLoading(true);
    try {
      const userToken = await getAccessToken();
      console.log("사용자 토큰:", userToken); // 디버깅용 로그
      // 서비스 함수 호출 (성공 시 코드 문자열 반환)
      const codeFromServer = await fetchInviteCode(userToken);

      setMyInviteCode(codeFromServer);
      showToast("초대 코드가 발급되었어요!");
    } catch (error: any) {
      // 🌟 서버(coupleService)에서 던진 에러 메시지(예: 409 에러)를 그대로 토스트로 출력합니다.
      showToast(error.message || "코드 발급에 실패했어요.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (myInviteCode) {
      await Clipboard.setStringAsync(myInviteCode);
      showToast("초대 코드가 복사되었어요! \n파트너에게 전달해 주세요. 📋");
    }
  };

  const handleConnect = async () => {
    Keyboard.dismiss();

    if (partnerCode.length < 4) {
      showToast("올바른 초대 코드를 입력해 주세요.");
      return;
    }

    setIsConnecting(true);

    try {
      const userToken = await getAccessToken();
      await verifyInviteCode(userToken, partnerCode);

      const connectionData = await connectCouple(userToken, partnerCode);

      await connectPartner(); // 커플 연결 상태 업데이트
      showToast(
        `${connectionData.partnerNickname}님과 성공적으로 연결되었어요! 🎉`,
      );
      router.replace("/home-menu");
    } catch (error: any) {
      showToast(error.message || "파트너 연결에 실패했어요.");
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* 🌟 1. 키보드 회피 뷰 강화 (offset 추가 및 behavior 명시) */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* 빈 공간을 터치하면 키보드가 닫히도록 TouchableWithoutFeedback 감싸기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* 헤더 */}
            <View style={styles.navHeader}>
              <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={() => router.back()}
              >
                <ArrowLeft size={22} color="#3E2723" />
              </TouchableOpacity>
              <Text style={styles.navHeaderTitle}>파트너 연결</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* 🌟 2. ScrollView 속성 강화 (flexGrow, 키보드 터치 처리) */}
            <ScrollView
              contentContainerStyle={[styles.container, { paddingBottom: 120 }]}
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.mainTitle}>
                소중한 사람과{"\n"}하루틈을 공유해 보세요
              </Text>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "invite" && styles.activeTab,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab("invite")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "invite" && styles.activeTabText,
                    ]}
                  >
                    내가 초대하기
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "receive" && styles.activeTab,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab("receive")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "receive" && styles.activeTabText,
                    ]}
                  >
                    초대 코드 입력
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.contentCard}>
                {activeTab === "invite" ? (
                  <View style={styles.inviteView}>
                    <View style={styles.iconCircle}>
                      <HeartHandshake size={28} color="#D87A68" />
                    </View>
                    <Text style={styles.cardTitle}>내 초대 코드</Text>

                    {!myInviteCode ? (
                      <>
                        <Text style={styles.cardDesc}>
                          파트너와 연결하기 위한 고유 코드를 생성해 보세요.
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.generateButton,
                            isLoading && styles.generateButtonDisabled,
                          ]}
                          activeOpacity={0.8}
                          onPress={generateInviteCode}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                          ) : (
                            <Text style={styles.generateButtonText}>
                              초대코드 생성하기
                            </Text>
                          )}
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={styles.cardDesc}>
                          아래 코드를 복사해서 파트너에게 전달해 주세요.
                        </Text>
                        <TouchableOpacity
                          style={styles.codeDisplayBox}
                          activeOpacity={0.7}
                          onPress={handleCopyCode}
                        >
                          <Text style={styles.codeText}>{myInviteCode}</Text>
                          <View style={styles.copyButton}>
                            <Copy size={16} color="#8D6E63" />
                            <Text style={styles.copyButtonText}>복사</Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                ) : (
                  <View style={styles.receiveView}>
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: "#F5ECE9" },
                      ]}
                    >
                      <Key size={26} color="#8D6E63" />
                    </View>
                    <Text style={styles.cardTitle}>초대 코드 입력</Text>
                    <Text style={styles.cardDesc}>
                      파트너에게 전달받은 영문/숫자 코드를 입력해 주세요.
                    </Text>

                    <TextInput
                      style={styles.codeInput}
                      placeholder="예: A7K9PQ"
                      placeholderTextColor="#BCAAA4"
                      value={partnerCode}
                      onChangeText={setPartnerCode}
                      autoCapitalize="characters"
                      maxLength={10}
                      returnKeyType="done"
                      onSubmitEditing={handleConnect} // 🌟 키보드의 완료 버튼 누르면 바로 연결 실행
                    />

                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        partnerCode.length < 4 && styles.submitButtonDisabled,
                      ]}
                      activeOpacity={0.8}
                      onPress={handleConnect}
                      disabled={partnerCode.length < 4}
                    >
                      <Text style={styles.submitButtonText}>연결하기</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  container: { flexGrow: 1, paddingHorizontal: scale(20), paddingTop: 16 },
  mainTitle: {
    fontSize: fontScale(22),
    fontWeight: "700",
    color: "#3E2723",
    lineHeight: 30,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#EFEBE9",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: fontScale(14), fontWeight: "600", color: "#8D6E63" },
  activeTabText: { color: "#3E2723" },
  contentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: scale(24),
    alignItems: "center",
    shadowColor: "#3E2723",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FDF0ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDesc: {
    fontSize: fontScale(13),
    color: "#8D6E63",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
  },
  inviteView: { width: "100%" },
  generateButton: {
    backgroundColor: "#3E2723",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonDisabled: { backgroundColor: "#8D6E63" },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(15),
    fontWeight: "600",
  },
  codeDisplayBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAF7F5",
    borderWidth: 1,
    borderColor: "#EFEBE9",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  codeText: {
    fontSize: fontScale(18),
    fontWeight: "700",
    color: "#3E2723",
    letterSpacing: 2,
  },
  copyButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyButtonText: {
    fontSize: fontScale(13),
    fontWeight: "600",
    color: "#8D6E63",
  },
  receiveView: { width: "100%" },
  codeInput: {
    backgroundColor: "#FAF7F5",
    borderWidth: 1,
    borderColor: "#EFEBE9",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: fontScale(16),
    color: "#3E2723",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  submitButton: {
    backgroundColor: "#3E2723",
    borderRadius: 16,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: { backgroundColor: "#BCAAA4" },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: fontScale(15),
    fontWeight: "600",
  },
});
