import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PasswordEntry = {
  id: number;
  destination: string;
  user: string;
  password: string;
  notes: string;
};

interface PasswordListProps {
  entries: PasswordEntry[];
  onDelete: (id: number) => void;
  onEdit: (entry: PasswordEntry) => void;
}

export default function PasswordList({ entries, onDelete, onEdit }: PasswordListProps) {
  // Sort entries by destination, with newest at the top
  const sortedEntries = [...entries].sort((a, b) => {
    // If IDs are available, sort by descending ID (assuming higher ID = newer)
    return b.id - a.id;
  });

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(id) }
      ]
    );
  };

  const handleEdit = (entry: PasswordEntry) => {
    onEdit(entry);
  };

  return (
    <View style={styles.container}>
      {sortedEntries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.destination}>{entry.destination}</Text>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleEdit(entry)}
              >
                <Ionicons name="pencil" size={20} color="#0078D7" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleDelete(entry.id)}
              >
                <Ionicons name="trash" size={20} color="#E81123" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.cardBody}>
            <View style={styles.cardRow}>
              <Ionicons name="person" size={18} color="#666" style={styles.icon} />
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{entry.user}</Text>
            </View>
            
            <View style={styles.cardRow}>
              <Ionicons name="key" size={18} color="#666" style={styles.icon} />
              <Text style={styles.label}>Password:</Text>
              <Text style={styles.value}>{entry.password}</Text>
            </View>
            
            {entry.notes ? (
              <View style={styles.cardRow}>
                <Ionicons name="document-text" size={18} color="#666" style={styles.icon} />
                <Text style={styles.label}>Notes:</Text>
                <Text style={styles.value}>{entry.notes}</Text>
              </View>
            ) : null}
          </View>
        </View>
      ))}
      
      {entries.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No saved passwords yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cardBody: {
    padding: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  destination: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0078D7',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },
  value: {
    flex: 1,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
});
