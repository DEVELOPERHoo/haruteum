// services/apiClient.ts
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../constants/config";

// accessToken 갱신
export const refreshAccessToken = async () => {
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

export const checkAuth = async (): Promise<boolean> => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  if (!accessToken) return false;

  const response = await fetch(`${BASE_URL}/api/v1/auth/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.ok;
};

// 모든 API 요청은 이 함수로(다이어리 저장, 히스토리 조회, 프로필 조회)
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  isFormData = false,
) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");

  // FormData일 때는 Content-Type 완전히 제외
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${accessToken}`);

  if (!isFormData) {
    headers.append("Content-Type", "application/json");
  }

  // options.headers 병합
  if (options.headers) {
    const optHeaders = new Headers(options.headers as HeadersInit);
    optHeaders.forEach((value, key) => {
      headers.append(key, value);
    });
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      const newAccessToken = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      return fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
      });
    } catch {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      throw new Error("로그인 필요");
    }
  }

  return response;
};
