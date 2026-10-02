import { Dimensions, PixelRatio, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// 가로 기준 스케일
export const scale = (size: number) => Math.round((width / BASE_WIDTH) * size);
// 세로 기준 스케일
export const verticalScale = (size: number) =>
  Math.round((height / BASE_HEIGHT) * size);
// 폰트 스케일 (사용자 글자 크기 설정 무시)
export const fontScale = (size: number) =>
  Math.round(scale(size) / PixelRatio.getFontScale());
// 중간값 (너무 크거나 작아지는 거 방지)
export const moderateScale = (size: number, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);
