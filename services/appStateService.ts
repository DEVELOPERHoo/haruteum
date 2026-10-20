// services/appStateService.ts
import { AppState, AppStateStatus } from "react-native";
import { router } from "expo-router";
import { checkAuth, refreshAccessToken } from "./apiClient";
import { clearTokens } from "./authService";

let lastAppState: AppStateStatus = AppState.currentState;

let isCheckingAuth = false; // 무한 루프 및 중복 검사 차단 Lock 변수
let isLoggingInProcess = false; // 카카오 로그인 진행 중 포그라운드 검사 중복 제어 플래그

export const setloggingInProcess = (status: boolean) => {
  isLoggingInProcess = status;
};
/**
 * 앱 포그라운드(active) 전환 시 토큰 자동 검증 서비스
 */
export const initAppStateAuthCheck = () => {
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (isCheckingAuth || isLoggingInProcess) {
      // 카카오 로그인 일 경우 2번 호출 isLoggingInProcess = true;
      console.log(
        "로그인 진행 중이거나 검사 중이므로 포그라운드 검사를 스킵합니다.",
      );
      lastAppState = nextAppState;
      return;
    }
    // 백그라운드/비활성화 ➔ 포그라운드(active)로 복귀했는지 확인
    if (lastAppState === "background" && nextAppState === "active") {
      console.log(
        "앱이 포그라운드로 전환되었습니다. 토큰 유효성을 검사합니다...",
      );
      isCheckingAuth = true;

      try {
        // 1. 액세스 토큰 유효성 서버 검사
        const isValid = await checkAuth();

        if (!isValid) {
          console.log("토큰 만료 감지. 재발급 시도 중...");
          try {
            // 2. 만료 시 리프레시 토큰으로 재발급 시도
            await refreshAccessToken();
            console.log("토큰 재발급 성공");
          } catch {
            // 3. 재발급 실패 시 저장소 청소 후 로그인 화면으로 이동
            console.log("토큰 재발급 실패. 로그인 화면으로 라우팅합니다.");
            await clearTokens();
            router.replace("/login");
          }
        } else {
          console.log("토큰이 유효합니다.");
        }
      } catch (error) {
        console.error("포그라운드 토큰 검증 중 에러 발생:", error);
        await clearTokens();
        router.replace("/login");
      } finally {
        isCheckingAuth = false;
      }
    }

    lastAppState = nextAppState;
  };

  // AppState 감지 이벤트 등록
  const subscription = AppState.addEventListener(
    "change",
    handleAppStateChange,
  );

  // 이벤트 해제 클린업 함수 반환
  return () => {
    subscription.remove();
  };
};
