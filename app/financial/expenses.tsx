import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getExpenses } from '../services/financialServices';

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export default function ExpensesScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      Alert.alert('Error', 'Failed to load expense data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditItem(null);
    setFormData({
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setModalVisible(true);
  };

  const handleEdit = (item: Expense) => {
    setEditItem(item);
    setFormData({
      category: item.category,
      amount: item.amount.toString(),
      date: item.date,
      description: item.description
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this expense entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // In a real app, you would call an API to delete
            const updatedExpenses = expenses.filter(item => item.id !== id);
            setExpenses(updatedExpenses);
            Alert.alert('Success', 'Expense entry deleted successfully');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleSave = () => {
    // Validate form data
    if (!formData.category || !formData.amount || !formData.date) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return;
    }

    if (editItem) {
      // Update existing item
      const updatedExpenses = expenses.map(item => 
        item.id === editItem.id 
          ? {
              ...item,
              category: formData.category,
              amount: amount,
              date: formData.date,
              description: formData.description
            }
          : item
      );
      setExpenses(updatedExpenses);
      Alert.alert('Success', 'Expense entry updated successfully');
    } else {
      // Add new item
      const newExpense: Expense = {
        id: Date.now().toString(), // In a real app, the server would generate this
        category: formData.category,
        amount: amount,
        date: formData.date,
        description: formData.description
      };
      setExpenses([...expenses, newExpense]);
      Alert.alert('Success', 'Expense entry added successfully');
    }

    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.category}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>₹{item.amount.toLocaleString()}</Text>
        </View>
        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={22} color="#2196f3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Records</Text>
        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Text style={styles.loadingText}>Loading expense data...</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cash-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No expense entries found</Text>
              <TouchableOpacity onPress={handleAddNew} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Add Your First Expense</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editItem ? 'Edit Expense Entry' : 'Add New Expense'}
            </Text>
            
            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => setFormData({...formData, category: text})}
              placeholder="e.g. Office Supplies, Software"
            />
            
            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(text) => setFormData({...formData, amount: text})}
              placeholder="5000"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({...formData, date: text})}
              placeholder="YYYY-MM-DD"
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Optional description"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 4,
  },
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f44336',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  cardActions: {
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  actionButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  saveButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 