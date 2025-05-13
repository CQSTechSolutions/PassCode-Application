import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Placeholder data for advances
const mockAdvances = [
  {
    id: '1',
    title: 'Client XYZ Advance',
    amount: 25000,
    date: '2023-09-15',
    type: 'Received'
  },
  {
    id: '2',
    title: 'Vendor ABC Advance',
    amount: 12000,
    date: '2023-10-20',
    type: 'Paid'
  }
];

export default function AdvancesScreen() {
  const router = useRouter();
  const [advances, setAdvances] = useState(mockAdvances);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>₹{item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.typeContainer}>
          <Text 
            style={[
              styles.typeBadge,
              { backgroundColor: item.type === 'Received' ? '#4caf50' : '#03a9f4' }
            ]}
          >
            {item.type}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advances</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={advances}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No advances found</Text>
          </View>
        }
      />
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
    color: '#03a9f4',
  },
  typeContainer: {
    marginTop: 8,
    flexDirection: 'row',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
}); 