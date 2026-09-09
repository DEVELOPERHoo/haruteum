import { apiRequest } from "./apiClient";

interface HistoryParams {
  page: number;
  pageSize: number;
  start?: string;
  end?: string;
}

export const fetchHistory = async ({
  page,
  pageSize,
  start,
  end,
}: HistoryParams) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(start && { start }), //생략가능
      ...(end && { end }), //생략가능
    });

    const res = await apiRequest(`/api/v1/memory/list?${params}`);

    if (!res.ok) throw new Error("히스토리 조회 실패");

    return res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteMemories = async (memoryIds: string[]) => {
  const params = memoryIds.map((id) => `memoryIds=${id}`).join("&");

  const res = await apiRequest(`/api/v1/memory?${params}`, {
    method: "DELETE",
  });

  // 빈 응답(204 No Content)이면 json() 호출 안 함
  //if (res.status === 204 || res.headers.get("content-length") === "0") return;

  const text = await res.text();
  if (!text) return; // ← 빈 응답이면 그냥 리턴

  return JSON.parse(text);
};
