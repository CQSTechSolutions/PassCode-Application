import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import * as Updates from 'expo-updates';

export default function RootLayout() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  // Check for over-the-air updates
  const checkForUpdates = async () => {
    try {
      setIsCheckingUpdate(true);
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Would you like to update now?",
          [
            {
              text: "Later",
              style: "cancel"
            },
            {
              text: "Update Now",
              onPress: applyUpdate
            }
          ]
        );
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  // Apply available updates
  const applyUpdate = async () => {
    try {
      Alert.alert("Updating", "Downloading update...");
      await Updates.fetchUpdateAsync();
      Alert.alert(
        "Update Downloaded",
        "The update has been downloaded and will be applied now. The app will restart.",
        [
          {
            text: "OK",
            onPress: async () => {
              await Updates.reloadAsync();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error applying update:", error);
      Alert.alert("Update Failed", "Unable to apply the update. Please try again later.");
    }
  };

  useEffect(() => {
    // Check for updates when the app starts
    if (!__DEV__) {
      checkForUpdates();
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="financial" options={{ headerShown: false }} />
      <Stack.Screen name="financial/revenue" options={{ headerShown: false }} />
      <Stack.Screen name="financial/expenses" options={{ headerShown: false }} />
      <Stack.Screen name="financial/provisions" options={{ headerShown: false }} />
      <Stack.Screen name="financial/advances" options={{ headerShown: false }} />
      <Stack.Screen name="financial/liabilities" options={{ headerShown: false }} />
      <Stack.Screen name="clients" options={{ headerShown: false }} />
      <Stack.Screen name="projects" options={{ headerShown: false }} />
    </Stack>
  );
}