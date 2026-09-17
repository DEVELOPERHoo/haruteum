// services/authService.ts
import * as SecureStore from "expo-secure-store";
import { apiRequest, parseResponse } from "./apiClient";
import { BASE_URL } from "../constants/config";

interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  withdraw: boolean;
}

// 카카오 로그인
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

// 토큰 저장(정상 로그인 또는 복귀 후)
export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync("accessToken", String(accessToken));
  await SecureStore.setItemAsync("refreshToken", String(refreshToken));
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
