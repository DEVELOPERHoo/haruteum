// services/coupleService.ts
import { BASE_URL } from "../constants/config";
import { fetchWithRetry } from "./fetchWithRetry";

export const fetchInviteCode = async (accessToken: string) => {
  const response = await fetchWithRetry(
    `${BASE_URL}/api/v1/couple/invite-code`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    { retries: 1, timeout: 5000 },
  );

  // 🌟 1. 409 Conflict: 이미 커플로 연결된 경우의 명시적 예외 처리
  if (response.status === 409) {
    throw new Error("이미 다른 사용자와 커플로 연결되어 있습니다.");
  }

  // 기타 서버 에러 처리
  if (!response.ok) {
    throw new Error(
      "초대 코드 발급에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    );
  }

  const data = await response.json();

  return data.code;
};

export const verifyInviteCode = async (accessToken: string, code: string) => {
  const response = await fetchWithRetry(
    `${BASE_URL}/api/v1/couple/invite-code/${code}`,
    {
      method: "GET", // 만약 POST라면 "POST"로 변경하고 body에 JSON을 담아주세요.
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    { retries: 0, timeout: 5000 }, // 검증은 즉각적인 피드백이 중요하므로 재시도(retries)를 0으로 설정하는 것을 추천합니다.
  );

  // 1. 에러 상태 코드 명시적 처리
  if (response.status === 400) {
    throw new Error("유효하지 않은 코드이거나 본인 코드입니다.");
  }
  if (response.status === 409) {
    throw new Error("이미 사용된 코드이거나 이미 커플 상태입니다.");
  }
  if (response.status === 410) {
    throw new Error("초대 코드가 만료되었습니다.");
  }

  // 2. 그 외의 예상치 못한 서버 에러 처리
  if (!response.ok) {
    throw new Error("코드 검증에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }

  const data = await response.json();

  return data;
};

export const connectCouple = async (token: string, code: string) => {
  const response = await fetchWithRetry(
    `${BASE_URL}/api/v1/couple/connect`,
    {
      method: "POST", // 백엔드 명세에 따라 데이터를 보내는 POST 방식 사용
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // 서버가 요구하는 Body 형식에 맞추어 코드를 JSON으로 감싸서 보냅니다.
      body: JSON.stringify({ code }),
    },
    { retries: 0, timeout: 5000 }, // 연결 요청 역시 즉각적인 피드백이 필요하므로 재시도 0회 설정
  );

  // 1. 에러 상태 코드 명시적 처리
  if (response.status === 400) {
    throw new Error("유효하지 않은 코드이거나 본인 코드입니다.");
  }
  if (response.status === 409) {
    throw new Error("이미 사용된 코드이거나 이미 커플 상태입니다.");
  }
  if (response.status === 410) {
    throw new Error("초대 코드가 만료되었습니다.");
  }

  // 2. 그 외 통신 실패 처리
  if (!response.ok) {
    throw new Error("커플 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }

  // 3. 201 성공 처리: 파트너 정보 반환
  // 응답 예시: { "id": "...", "partnerNickname": "지은", ... }
  const data = await response.json();

  return data;
};
