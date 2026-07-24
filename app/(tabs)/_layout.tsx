import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // 👈 헤더는 app/_layout.tsx에서 관리하므로 꺼줍니다.
        tabBarActiveTintColor: "#D4A59A",
        tabBarInactiveTintColor: "#CCCCCC",
        tabBarShowLabel: false, // 아이콘만 깔끔하게 표시

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F8F4F2",
          height: 60,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? 20 : 12,
        },
      }}
    >
      <Tabs.Screen
        name="diary"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="book" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="history" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="setting" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
