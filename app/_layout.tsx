// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* 🌟 탭 그룹 전체에 완벽한 순정 헤더 설정 적용 */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          headerTitle: "하루 틈,",
          headerTitleAlign: "center",
          headerShadowVisible: false, // 👈 둔탁한 그림자(elevation/shadow)를 끄는 정석 옵션!
          headerStyle: {
            backgroundColor: "#FFFFFF",
            // borderBottomWidth 대신 스택 헤더 전용 선을 살리고 싶다면 아래처럼 하거나,
            // 깔끔하게 안 보이고 싶을 땐 그냥 비워두는 게 안전해!
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "700",
            color: "#333333",
            // 👈 에러 나던 letterSpacing을 안전하게 제외하거나 정수로 조율!
          },
        }}
      />
    </Stack>
  );
}
