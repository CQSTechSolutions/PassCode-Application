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
    } else {
      resetForm();
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
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.formTitle}>
          {editingEntry ? 'Edit Password' : 'Add New Password'}
        </Text>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancelEdit}>
          <Ionicons name="close-circle" size={24} color="#0078D7" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="globe" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Website or App"
            style={styles.input}
            value={destination}
            onChangeText={setDestination}
            autoFocus
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelTextButton} 
            onPress={onCancelEdit}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!destination || !user || !password) && styles.saveButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!destination || !user || !password}
          >
            <Text style={styles.saveButtonText}>
              {editingEntry ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0078D7',
  },
  cancelButton: {
    padding: 4,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    padding: 14,
    fontSize: 16,
    flex: 1,
  },
  visibilityIcon: {
    padding: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#0078D7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelTextButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#0078D7',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
