import React from "react";
import Colors from "../../constants/Colors";
import { Tabs } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -6 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={"ios-home-sharp"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="four"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
