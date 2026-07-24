// services/apiClient.ts
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// accessToken 갱신
const refreshAccessToken = async () => {
  const refreshToken = await SecureStore.getItemAsync("refreshToken");

  const response = await fetch(`${BASE_URL}/api/v1/auth/reissue`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) throw new Error("refresh 실패");

  const data = await response.json();
  await SecureStore.setItemAsync("accessToken", data.accessToken);
  await SecureStore.setItemAsync("refreshToken", data.refreshToken);

  return data.accessToken;
};

// 모든 API 요청은 이 함수로(다이어리 저장, 히스토리 조회, 프로필 조회)
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  // 401 에러면 토큰 갱신 후 기본 통신 재시도(다이어리 저장, 히스토리 조회, 프로필 조회)
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshAccessToken();

      return fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
          ...options.headers,
        },
      });
    } catch {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      throw new Error("로그인 필요");
    }
  }

  return response;
};
