import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Platform } from "react-native";
import { initAppStateAuthCheck } from "../../services/appStateService";
import { useEffect } from "react";

export default function TabsLayout() {
  useEffect(() => {
    const cleanup = initAppStateAuthCheck(); // initAppStateAuthCheck() 함수 호출과 동시에 해체함수가 cleanup 변수에 보관됨
    return () => cleanup(); // 컴포넌트 언마운트 시 이벤트 해제
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
