// app/_layout.tsx
import { Stack } from "expo-router";
import CustomAlertModal from "../components/common/CustomAlertModal";
import CustomToast from "../components/common/CustomToast";

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          //animationDuration: 150,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          // 화면 전환 도중 배경색 깜빡임 방지
          contentStyle: { backgroundColor: "#FAF7F5" },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerTitle: "하루 틈,",
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#FFFFFF",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
              color: "#333333",
            },
          }}
        />
      </Stack>
      <CustomAlertModal />
      <CustomToast />
    </>
  );
}
