import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PasswordList({ entries }: { entries: any[] }) {
  return (
    <View>
      {entries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <Text style={styles.label}>📍 {entry.destination}</Text>
          <Text>👤 {entry.user}</Text>
          <Text>🔑 {entry.password}</Text>
          <Text>📝 {entry.notes}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
