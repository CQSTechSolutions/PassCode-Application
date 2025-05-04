import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  RefreshControl,
  ScrollView
} from 'react-native';
import * as Updates from 'expo-updates';
import { Ionicons } from '@expo/vector-icons';
import { 
  initDB, 
  fetchEntries, 
  addEntry,
  updateEntry,
  deleteEntry
} from '../db/database';
import PasswordForm from '../components/PasswordForm';
import PasswordList from '../components/PasswordList';

type PasswordEntry = {
  id: number;
  destination: string;
  user: string;
  password: string;
  notes: string;
};

export default function HomeScreen() {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp'
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const headerDetailOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp'
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
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter((entry) => 
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

  const handleSave = (destination: string, user: string, password: string, notes: string) => {
    addEntry(destination, user, password, notes, loadEntries);
  };

  const handleUpdate = (id: number, destination: string, user: string, password: string, notes: string) => {
    updateEntry(id, destination, user, password, notes, loadEntries);
    setEditingEntry(null);
  };

  const handleDelete = (id: number) => {
    deleteEntry(id, loadEntries);
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditingEntry(entry);
  };
  
  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const handleRefresh = () => {
    loadEntries();
  };
  
  // Check for over-the-air updates
  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };
  
  // Apply available updates
  const applyUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync(); 
    } catch (error) {
      console.error("Error applying update:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0078D7" barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={[styles.headerContent]}>
          <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
            PassCode
          </Animated.Text>
          <Animated.View style={[styles.headerDetails, { opacity: headerDetailOpacity }]}>
            <Text style={styles.appTitle}>PassCode</Text>
            <Text style={styles.appSubtitle}>Secure Password Storage</Text>
          </Animated.View>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search passwords..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
      
      {/* Update Banner */}
      {updateAvailable && (
        <TouchableOpacity style={styles.updateBanner} onPress={applyUpdate}>
          <Ionicons name="arrow-down-circle" size={20} color="#fff" />
          <Text style={styles.updateText}>Update available! Tap to install</Text>
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
        <PasswordForm 
          onSave={handleSave} 
          onUpdate={handleUpdate}
          editingEntry={editingEntry}
          onCancelEdit={handleCancelEdit}
        />
        
        <PasswordList 
          entries={filteredEntries} 
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#0078D7',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 12,
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  headerContent: {
    height: 90,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },  
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerDetails: {
    flex: 1,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  updateBanner: {
    backgroundColor: '#4CAF50',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
});
