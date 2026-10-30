interface RetryOptions {
  retries?: number; // 최대 재시도 횟수(기본값: 2회)
  backoff?: number; // 첫 대기 시간 (ms, 기본값: 1000ms)
  timeout?: number; // 타입아웃 옵션(ms, 기본값: 8000ms)
}
/*
 * 일시적 네트워크 오류 발생 시 자동 재시도하는 fetch 래퍼 함수
 */
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {},
): Promise<Response> => {
  //retryOptions 객체에서 retries와 backoff 값을 추출하되, 없으면 기본값(2회, 1000ms)을 적용
  const { retries = 2, backoff = 1000, timeout = 80000 } = retryOptions;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal, // 타임아웃 신호 연동 abort() 호출시 fetch 통신 즉시 중단 후 에러 발생
      });

      clearTimeout(timeoutId); // 응답 성공 시 타이머 해제

      // 401(인증 만료)이나 403(권한 없음)은 재시도하지 않고 즉시 응답 반환 (apiClient에서 처리)
      if (response.status === 401 || response.status === 403) {
        return response;
      }

      // 서버 에러(5xx)나 일시적 오류 발생 시 에러 던져서 catch 블록(재시도)으로 이동
      if (!response.ok && response.status >= 500) {
        throw new Error(`Server Error (${response.status})`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId); // 에러 발생 시 타이머 해제

      const isLastAttempt = attempt === retries; // attempt와 retries를 비교해서 boolean값 저장

      if (isLastAttempt) {
        console.error(`[Network] 최대 재시도 횟수(${retries}회) 초과:`, error);
        if (error.name === "AbortError") {
          throw new Error("네트워크 응답 시간이 초과되었습니다. (Timeout)");
        }
        throw error;
      }

      // 지수 백오프 대기 시간 계산(1초->2초->4초...)
      const delayTime = backoff * Math.pow(2, attempt);
      console.log(
        `API 통신 실패. ${delayTime}ms 후 재시도합니다...(${attempt + 1}/${retries})`,
      );

      await new Promise((resolve) => setTimeout(resolve, delayTime));
    }
  }
  throw new Error("API 요청을 완료할 수 없습니다.");
};
