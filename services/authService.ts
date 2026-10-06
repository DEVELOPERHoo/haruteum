// services/authService.ts
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout as kakaoLogout } from "@react-native-seoul/kakao-login";
import { apiRequest, parseResponse } from "./apiClient";
import { BASE_URL } from "../constants/config";

interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  withdraw: boolean;
}

// 카카오 인가 토큰으로 백엔드 로그인
export const loginWithKakao = async (
  kakaoToken: string,
): Promise<KakaoLoginResponse> => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/kakao-login-token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("카카오 로그인 실패");
  }

  const data = await response.json();
  return data;
};

// 엑세스/리프레시 토큰 저장 (SecureStorage, AsyncStorage 이중 동기화)
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  try {
    // 시간 단축을 위한 병렬처리
    await Promise.all([
      SecureStore.setItemAsync("accessToken", String(accessToken)),
      SecureStore.setItemAsync("refreshToken", String(refreshToken)),
      AsyncStorage.setItem("accessToken", String(accessToken)),
      AsyncStorage.setItem("refreshToken", String(refreshToken)),
    ]);
    console.log("로컬 토큰 저장 완료");
  } catch (error) {
    console.log("토큰 저장 중 오류:", error);
  }
};

// 로컬 저장소 토큰 일괄 삭제
export const clearTokens = async () => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync("accessToken").catch(() => {}),
      SecureStore.deleteItemAsync("refreshToken").catch(() => {}),
      AsyncStorage.removeItem("accessToken").catch(() => {}),
      AsyncStorage.removeItem("accessToken").catch(() => {}),
    ]);
    console.log("로컬 저장소 토큰 삭제 완료");
  } catch (error) {
    console.log("토큰 삭제 중 오류:", error);
  }
};

// 통합 안전 로그아웃(카카오 SDK 세션 리셋 + 로컬 토큰 완전 제거)
export const logoutUser = async () => {
  try {
    await kakaoLogout();
    console.log("카카오 SDK 로그아웃 성공");
  } catch (error: any) {
    console.log("카카오 토큰 이미 만료 또는 패스:", error?.message || error);
  }
  await clearTokens();
};

// 저장된 엑세스 토큰 조회
export const getAccessToken = async () => {
  try {
    let token = await SecureStore.getItemAsync("accessToken");
    if (!token) {
      token = await AsyncStorage.getItem("accessToken");
    }
    return token;
  } catch (error) {
    return null;
  }
};

// 회원 복귀
export const restoreAccount = async (accessToken: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/me/restore`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("복귀 실패");
  const text = await res.text();

  if (!text) return;

  return JSON.parse(text);
};

// 회원 탈퇴
export const deleteAccount = async () => {
  try {
    const res = await apiRequest("/api/v1/auth/me", {
      method: "DELETE",
    });
    return parseResponse(res);
  } catch (error: any) {
    throw new Error(`[deleteAccount] ${error.message}`);
  }
};
