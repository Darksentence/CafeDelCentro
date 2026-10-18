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
          title: "Inicio",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("⌂", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menú",
          tabBarLabel: "Menú",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("☕", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarLabel: "Carrito",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("＋", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarLabel: "Pedidos",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("▤", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ color, size, focused }) =>
            tabIcon("○", color, size, focused),
        }}
      />
    </Tabs>
  );
}
