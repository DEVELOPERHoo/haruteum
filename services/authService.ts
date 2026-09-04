// services/authService.ts
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginWithKakao = async (kakaoToken: string) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/kakao-login-token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${kakaoToken}`,
    },
  });
  // true 탈퇴 / false 일반사용자
  const data = await response.json();
  console.log(data);
  if (data.withdraw == false) {
    await SecureStore.setItemAsync("accessToken", data.accessToken);
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
  }

  if (!response.ok) {
    throw new Error("백엔드 로그인 실패");
  }

  return data;
};
