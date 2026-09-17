import { apiRequest, parseResponse } from "./apiClient";

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
    return parseResponse(res);
  } catch (error: any) {
    throw new Error(`[fetchHistory] ${error.message}`);
  }
};

export const deleteMemories = async (memoryIds: string[]) => {
  try {
    const params = memoryIds.map((id) => `memoryIds=${id}`).join("&");

    const res = await apiRequest(`/api/v1/memory?${params}`, {
      method: "DELETE",
    });
    return parseResponse(res);
  } catch (error: any) {
    throw new Error(`[deleteMemories] ${error.message}`);
  }
};
