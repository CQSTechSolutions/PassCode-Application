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
import { getRevenues } from '../services/financialServices';

interface Revenue {
  id: string;
  amount: number;
  source: string;
  date: string;
  gross_profit: number;
}

export default function RevenueScreen() {
  const router = useRouter();
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState<Revenue | null>(null);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    gross_profit: ''
  });

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      setLoading(true);
      const data = await getRevenues();
      setRevenues(data);
    } catch (error) {
      console.error('Error fetching revenues:', error);
      Alert.alert('Error', 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditItem(null);
    setFormData({
      source: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      gross_profit: ''
    });
    setModalVisible(true);
  };

  const handleEdit = (item: Revenue) => {
    setEditItem(item);
    setFormData({
      source: item.source,
      amount: item.amount.toString(),
      date: item.date,
      gross_profit: item.gross_profit.toString()
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this revenue entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            // In a real app, you would call an API to delete
            const updatedRevenues = revenues.filter(item => item.id !== id);
            setRevenues(updatedRevenues);
            Alert.alert('Success', 'Revenue entry deleted successfully');
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleSave = () => {
    // Validate form data
    if (!formData.source || !formData.amount || !formData.date) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    const grossProfit = formData.gross_profit ? parseFloat(formData.gross_profit) : amount * 0.7;

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return;
    }

    if (isNaN(grossProfit) || grossProfit < 0) {
      Alert.alert('Validation Error', 'Please enter a valid profit amount');
      return;
    }

    if (editItem) {
      // Update existing item
      const updatedRevenues = revenues.map(item => 
        item.id === editItem.id 
          ? {
              ...item,
              source: formData.source,
              amount: amount,
              date: formData.date,
              gross_profit: grossProfit
            }
          : item
      );
      setRevenues(updatedRevenues);
      Alert.alert('Success', 'Revenue entry updated successfully');
    } else {
      // Add new item
      const newRevenue: Revenue = {
        id: Date.now().toString(), // In a real app, the server would generate this
        source: formData.source,
        amount: amount,
        date: formData.date,
        gross_profit: grossProfit
      };
      setRevenues([...revenues, newRevenue]);
      Alert.alert('Success', 'Revenue entry added successfully');
    }

    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Revenue }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.source}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>₹{item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Profit:</Text>
          <Text style={styles.profitValue}>₹{item.gross_profit.toLocaleString()}</Text>
        </View>
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
        <Text style={styles.headerTitle}>Revenue Records</Text>
        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Text style={styles.loadingText}>Loading revenue data...</Text>
        </View>
      ) : (
        <FlatList
          data={revenues}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cash-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No revenue entries found</Text>
              <TouchableOpacity onPress={handleAddNew} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Add Your First Revenue</Text>
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
              {editItem ? 'Edit Revenue Entry' : 'Add New Revenue'}
            </Text>
            
            <Text style={styles.inputLabel}>Source</Text>
            <TextInput
              style={styles.input}
              value={formData.source}
              onChangeText={(text) => setFormData({...formData, source: text})}
              placeholder="e.g. Client Project, Consulting"
            />
            
            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={formData.amount}
              onChangeText={(text) => setFormData({...formData, amount: text})}
              placeholder="10000"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Gross Profit (₹)</Text>
            <TextInput
              style={styles.input}
              value={formData.gross_profit}
              onChangeText={(text) => setFormData({...formData, gross_profit: text})}
              placeholder="Leave blank to auto-calculate (70% of amount)"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({...formData, date: text})}
              placeholder="YYYY-MM-DD"
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
    color: '#4caf50',
  },
  profitValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
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
    backgroundColor: '#4caf50',
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
    backgroundColor: '#4caf50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 