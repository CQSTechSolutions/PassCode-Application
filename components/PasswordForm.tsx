import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PasswordEntry = {
  id: number;
  destination: string;
  user: string;
  password: string;
  notes: string;
};

interface PasswordFormProps {
  onSave: (destination: string, user: string, password: string, notes: string) => void;
  onUpdate?: (id: number, destination: string, user: string, password: string, notes: string) => void;
  editingEntry: PasswordEntry | null;
  onCancelEdit: () => void;
}

export default function PasswordForm({ 
  onSave, 
  onUpdate, 
  editingEntry, 
  onCancelEdit 
}: PasswordFormProps) {
  const [destination, setDestination] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Update form when editingEntry changes
  useEffect(() => {
    if (editingEntry) {
      setDestination(editingEntry.destination);
      setUser(editingEntry.user);
      setPassword(editingEntry.password);
      setNotes(editingEntry.notes || '');
    }
  }, [editingEntry]);

  const handleSubmit = () => {
    if (!destination || !user || !password) return;
    
    if (editingEntry && onUpdate) {
      onUpdate(editingEntry.id, destination, user, password, notes);
    } else {
      onSave(destination, user, password, notes);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setDestination('');
    setUser('');
    setPassword('');
    setNotes('');
    if (editingEntry) {
      onCancelEdit();
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.formTitle}>
          {editingEntry ? 'Edit Password' : 'Add New Password'}
        </Text>
        {editingEntry && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancelEdit}>
            <Ionicons name="close" size={22} color="#0078D7" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="globe" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Website or App"
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Username or Email"
            style={styles.input}
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity 
            style={styles.visibilityIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="document-text" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Notes (optional)"
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSubmit}
          disabled={!destination || !user || !password}
        >
          <Text style={styles.saveButtonText}>
            {editingEntry ? 'Update Password' : 'Save Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0078D7',
  },
  cancelButton: {
    padding: 4,
  },
  form: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  input: {
    padding: 12,
    fontSize: 16,
    flex: 1,
  },
  visibilityIcon: {
    padding: 12,
  },
  saveButton: {
    backgroundColor: '#0078D7',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
