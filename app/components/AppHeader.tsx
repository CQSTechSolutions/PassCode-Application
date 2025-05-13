import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
  title: string;
  showSettings?: boolean;
  onSettingsPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showSettings = true, 
  onSettingsPress 
}) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {showSettings && (
          <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 4,
  }
});

export default AppHeader; 