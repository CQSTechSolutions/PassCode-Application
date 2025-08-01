import { Stack } from "expo-router";
import React from "react";
import { SecurityProvider } from "../components/SecurityContext";

export default function RootLayout() {
  return (
    <SecurityProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            title: "Security Settings",
            headerStyle: { backgroundColor: "#0078D7" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
          }}
        />
      </Stack>
    </SecurityProvider>
  );
}
