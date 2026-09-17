// services/diaryService.ts
import { Platform } from "react-native";
import { apiRequest, parseResponse } from "./apiClient";

interface CreateMemoryParams {
  comment: string;
  emotionId: string;
  files: string[];
  mode: string;
}

export const diaryService = {
  createMemory: async ({
    comment,
    emotionId,
    files,
    mode,
  }: CreateMemoryParams) => {
    try {
      const formData = new FormData();

      // 1. 텍스트 데이터 패킹
      formData.append("comment", comment);
      formData.append("emotion", emotionId);

      // 2. 다중 사진 데이터 패킹
      if (files && files.length > 0) {
        files.forEach((photoUri: string, index: number) => {
          // 주소 뒤에 혹시 붙어있을지 모를 쿼리 파라미터(?...) 제거
          const cleanUri = photoUri.split("?")[0];

          // 🌟 주소 끝에 .jpg가 없어도 에러 안 나게 디폴트 확장자 처리 보완
          const hasExtension = cleanUri.includes(".");
          const rawType = hasExtension
            ? cleanUri.split(".").pop() || "jpg"
            : "jpg";
          const fileType = rawType.toLowerCase();

          // mime type 매핑 진행
          let mimeType = `image/${fileType}`;
          if (fileType === "jpg" || fileType === "jpeg") {
            mimeType = "image/jpeg";
          }

          formData.append("files", {
            // iOS와 안드로이드 모두 파일 경로를 안정적으로 읽을 수 있도록 처리
            uri:
              Platform.OS === "ios"
                ? photoUri.replace("file://", "")
                : photoUri,
            name: `diary_photo_${index}_${Date.now()}.${fileType}`,
            type: mimeType,
          } as any);
        });
      }

      formData.append("mode", mode);

      // 3. POST 통신 실행 (문법 오류 및 중복 괄호 완전 청소 ✨)
      const response = await apiRequest(
        "/api/v1/memory/create",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        },
        true, // ← isFormData: true 꼭 넣어주세요
      );
      return parseResponse(response);
    } catch (error: any) {
      throw new Error(`[createMemory] ${error.message}`);
    }
  },
};
