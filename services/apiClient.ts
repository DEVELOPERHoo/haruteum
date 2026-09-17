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
// 토큰 유효성 검사
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
      throw new Error("로그인이 필요합니다.");
    }
  }

  if (!response.ok) {
    const text = await response.text();
    const error = text ? JSON.parse(text) : {};

    switch (response.status) {
      case 400:
        throw new Error(error.message || "잘못된 요청입니다.");
      case 403:
        throw new Error("접근 권한이 없습니다.");
      case 404:
        throw new Error("데이터를 찾을 수 없습니다.");
      case 500:
        throw new Error("서버 오류가 발생했습니다.");
      default:
        throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }

  return response;
};

// 에러없이 정상일 때 작동
export const parseResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    const error = text ? JSON.parse(text) : {};
    throw new Error(error.message || `${res.status} 에러`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0")
    return null;

  const text = await res.text();
  if (!text) return null;

  return JSON.parse(text);
};
