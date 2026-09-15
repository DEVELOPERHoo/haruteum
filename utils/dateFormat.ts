// utils/dateFormat.ts

/**
 * 특정 Date 객체를 받아 "년.월.일 요일" 포맷 문자열로 반환하는 함수
 * @param date 지정을 원하는 Date 객체 (생략 시 자동으로 '오늘' 날짜 사용)
 */
export const getFormattedDate = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const weekDays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const weekDay = weekDays[date.getDay()];

  return `${year}.${month}.${day} ${weekDay}`;
};

export const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
};

export const groupingMonth = (createdAt: string) => {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}.${month}`;
};
