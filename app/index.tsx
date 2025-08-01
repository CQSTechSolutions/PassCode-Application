import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PasswordForm from "../components/PasswordForm";
import PasswordList from "../components/PasswordList";
import SecurityCheck from "../components/SecurityCheck";
import { useSecurity } from "../components/SecurityContext";
import {
  addEntry,
  deleteEntry,
  fetchEntries,
  initDB,
  updateEntry,
} from "../db/database";

type PasswordEntry = {
  id: number;
  destination: string;
  user: string;
  password: string;
  notes: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, showSecurityCheck, unlockApp, isInitializing } =
    useSecurity();
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerDetailOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    async function setupApp() {
      await initDB();
      loadEntries();
      checkForUpdates();
    }
    setupApp();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const loadEntries = () => {
    setRefreshing(true);
    fetchEntries((loadedEntries) => {
      setEntries(loadedEntries);
      setFilteredEntries(loadedEntries);
      setRefreshing(false);
    });
  };

  const handleSave = (
    destination: string,
    user: string,
    password: string,
    notes: string
  ) => {
    addEntry(destination, user, password, notes, loadEntries);
    setShowPasswordForm(false);
  };

  const handleUpdate = (
    id: number,
    destination: string,
    user: string,
    password: string,
    notes: string
  ) => {
    updateEntry(id, destination, user, password, notes, loadEntries);
    setEditingEntry(null);
  };

  const handleDelete = (id: number) => {
    deleteEntry(id, loadEntries);
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditingEntry(entry);
    setShowPasswordForm(true);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setShowPasswordForm(false);
  };

  const handleRefresh = () => {
    loadEntries();
  };

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
              style: "cancel",
            },
            {
              text: "Update Now",
              onPress: applyUpdate,
            },
          ]
        );
      } else {
        // Alert.alert("No Updates", "Your app is up to date.");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      Alert.alert(
        "Update Error",
        "Unable to check for updates. Please try again later."
      );
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
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error applying update:", error);
      Alert.alert(
        "Update Failed",
        "Unable to apply the update. Please try again later."
      );
    }
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.loadingContainer,
            { flex: 1, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#0078D7" />
          <Text style={styles.loadingText}>Initializing PassCode...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Don't render main content if not authenticated
  if (!isAuthenticated) {
    return (
      <SecurityCheck
        isVisible={showSecurityCheck}
        onAuthenticated={unlockApp}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0078D7" barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={[styles.headerTopRow]}>
          <Animated.Text
            style={[styles.headerTitle, { opacity: headerTitleOpacity }]}
          >
            PassCode
          </Animated.Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={checkForUpdates}
              disabled={isCheckingUpdate}
            >
              <Ionicons name="refresh-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[styles.headerDetails, { opacity: headerDetailOpacity }]}
        >
          <Text style={styles.appTitle}>PassCode</Text>
          <Text style={styles.appSubtitle}>Secure Password Storage</Text>
        </Animated.View>

        {/* Search Bar and Add Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search passwords..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setEditingEntry(null);
              setShowPasswordForm(true);
            }}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Update Banner */}
      {updateAvailable && (
        <TouchableOpacity style={styles.updateBanner} onPress={applyUpdate}>
          <Ionicons name="arrow-down-circle" size={20} color="#fff" />
          <Text style={styles.updateText}>
            Update available! Tap to install
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <PasswordList
          entries={filteredEntries}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </ScrollView>

      {/* Password Form Modal */}
      <Modal
        visible={showPasswordForm}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PasswordForm
              onSave={handleSave}
              onUpdate={handleUpdate}
              editingEntry={editingEntry}
              onCancelEdit={handleCancelEdit}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#0078D7",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 12,
    justifyContent: "flex-end",
    zIndex: 10,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerContent: {
    height: 90,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 5,
    marginLeft: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerDetails: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  searchContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#0078D7",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    borderWidth: 2,
    borderColor: "white",
  },
  updateBanner: {
    backgroundColor: "#4CAF50",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  updateText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
