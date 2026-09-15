// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
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
          },
        }}
      />
    </Stack>
  );
}
