// services/diaryService.ts

interface CreateMemoryParams {
  comment: string;
  //emotionId: number;
  files: string[];
}

export const diaryService = {
  /**
   * 백엔드 서버로 다이어리 글과 사진들을 전송하는 함수
   */
  createMemory: async ({ comment, files }: CreateMemoryParams) => {
    const formData = new FormData();

    // 1. 텍스트 데이터 패킹
    formData.append("comment", comment);
    //formData.append("emotionId", String(emotionId));

    // 2. 다중 사진 데이터 패킹
    if (files && files.length > 0) {
      files.forEach((photoUri: string, index: number) => {
        // 🌟 확장자를 추출한 뒤 안전하게 소문자로 변경 (JPG -> jpg 예방)
        const rawType = photoUri.split(".").pop() || "jpg";
        const fileType = rawType.toLowerCase();

        // 🌟 mime type 매핑을 조금 더 촘촘하게 보완
        let mimeType = `image/${fileType}`;
        if (fileType === "jpg" || fileType === "jpeg") {
          mimeType = "image/jpeg";
        }

        formData.append("files", {
          // 👈 백엔드 키값 일치 여부 꼭 확인!
          uri: photoUri,
          name: `diary_photo_${index}_${Date.now()}.${fileType}`,
          type: mimeType,
        } as any);
      });
    }

    // 3. POST 통신 실행
    const response = await fetch("http://172.17.22.116:3000/memory/create", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "서버 응답 오류 발생");
    }

    return await response.json();
  },
};
