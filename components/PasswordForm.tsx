import React from 'react';
import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function PasswordForm({ onSave }: { onSave: (d: string, u: string, p: string, n: string) => void }) {
  const [destination, setDestination] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!destination || !user || !password) return;
    onSave(destination, user, password, notes);
    setDestination('');
    setUser('');
    setPassword('');
    setNotes('');
  };

  return (
    <View style={styles.form}>
      <TextInput placeholder="Destination" style={styles.input} value={destination} onChangeText={setDestination} />
      <TextInput placeholder="User" style={styles.input} value={user} onChangeText={setUser} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Notes" style={styles.input} value={notes} onChangeText={setNotes} />
      <Button title="Save Password" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
});
