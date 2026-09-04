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
