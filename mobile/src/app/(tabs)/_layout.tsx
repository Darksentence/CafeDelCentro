import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { colors } from "@/theme";

function tabIcon(
  glyph: string,
  color: ColorValue,
  size: number,
  focused: boolean
) {
  return (
    <Text
      style={{
        color,
        fontSize: Math.max(18, size - 5),
        fontWeight: focused ? "800" : "500",
      }}
    >
      {glyph}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.coffeeDark,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 64,
          paddingTop: 7,
          paddingBottom: 7,
          borderTopColor: colors.line,
          backgroundColor: colors.paper,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Portada",
          tabBarLabel: "Portada",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("⌂", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "La carta",
          tabBarLabel: "Carta",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("☕", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Tu bolsa",
          tabBarLabel: "Bolsa",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("＋", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Tus pedidos",
          tabBarLabel: "Pedidos",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("▤", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tu cuenta",
          tabBarLabel: "Cuenta",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("○", color, size, focused),
        }}
      />
    </Tabs>
  );
}
