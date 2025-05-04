import React from 'react';
import { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { initDB, fetchEntries, addEntry } from '../db/database';
import PasswordForm from '../components/PasswordForm';
import PasswordList from '../components/PasswordList';

export default function HomeScreen() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    initDB();
    loadEntries();
  }, []);

  const loadEntries = () => {
    fetchEntries(setEntries);
  };

  const handleSave = (destination: string, user: string, password: string, notes: string) => {
    addEntry(destination, user, password, notes, loadEntries);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🔐 PassCode (SQLite)</Text>
      <PasswordForm onSave={handleSave} />
      <PasswordList entries={entries} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
