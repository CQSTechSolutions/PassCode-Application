// ToDo: Make the revenue and expense cards at center with proper ui interface.
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSummary, FinancialSummary } from './services/financialServices';
import SummaryCard from './components/SummaryCard';
import CategoryCard from './components/CategoryCard';

export default function FinancialScreen() {
  const router = useRouter();
  const [financialData, setFinancialData] = useState<FinancialSummary & { isLoading: boolean }>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    isLoading: true
  });

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const summary = await getSummary();
        setFinancialData({
          ...summary,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setFinancialData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchFinancialData();
  }, []);

  const navigateToCategory = (category: string) => {
    // Map category to correct route, using relative paths to avoid TypeScript errors
    switch (category.toLowerCase()) {
      case 'revenue':
        router.push('/financial/revenue');
        break;
      case 'expenses':
        router.push('/financial/expenses');
        break;
      case 'provisions':
        router.push('/financial/provisions');
        break;
      case 'advances':
        router.push('/financial/advances');
        break;
      case 'liabilities':
        router.push('/financial/liabilities');
        break;
      default:
        console.error('Unknown category:', category);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financial Records</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {financialData.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Text style={styles.loadingText}>Loading financial data...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.subtitle}>
            Track your revenue, expenses, provisions, advances, and liabilities
          </Text>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <SummaryCard 
              title="Total Revenue" 
              value={financialData.totalRevenue} 
            />
            <SummaryCard 
              title="Total Expenses" 
              value={financialData.totalExpenses} 
            />
            <SummaryCard 
              title="Net Profit" 
              value={financialData.netProfit} 
              currency="₹" 
            />
          </View>

          {/* Categories Section */}
          <Text style={styles.sectionTitle}>Financial Categories</Text>
          
          <View style={styles.categoriesContainer}>
            {/* Revenue */}
            <CategoryCard 
              title="All Revenue"
              description="Track all your income sources"
              icon={
                <View style={[styles.categoryIcon, { backgroundColor: '#4caf50' }]}>
                  <Ionicons name="trending-up" size={24} color="white" />
                </View>
              }
              onPress={() => navigateToCategory('Revenue')}
              borderColor="#4caf50"
            />
            
            {/* Expenses */}
            <CategoryCard 
              title="All Expenses"
              description="Track all your expenses"
              icon={
                <View style={[styles.categoryIcon, { backgroundColor: '#f44336' }]}>
                  <Ionicons name="trending-down" size={24} color="white" />
                </View>
              }
              onPress={() => navigateToCategory('Expenses')}
              borderColor="#f44336"
            />
            
            {/* Provisions */}
            <CategoryCard 
              title="Provisions"
              description="Manage your provisions"
              icon={
                <View style={[styles.categoryIcon, { backgroundColor: '#673ab7' }]}>
                  <Ionicons name="wallet" size={24} color="white" />
                </View>
              }
              onPress={() => navigateToCategory('Provisions')}
              borderColor="#673ab7"
            />
            
            {/* Advances */}
            <CategoryCard 
              title="Advances"
              description="Track advances paid or received"
              icon={
                <View style={[styles.categoryIcon, { backgroundColor: '#03a9f4' }]}>
                  <Ionicons name="arrow-forward" size={24} color="white" />
                </View>
              }
              onPress={() => navigateToCategory('Advances')}
              borderColor="#03a9f4"
            />
            
            {/* Liabilities */}
            <CategoryCard 
              title="Liabilities"
              description="Track your liabilities"
              icon={
                <View style={[styles.categoryIcon, { backgroundColor: '#ff9800' }]}>
                  <Ionicons name="alert-circle" size={24} color="white" />
                </View>
              }
              onPress={() => navigateToCategory('Liabilities')}
              borderColor="#ff9800"
            />
          </View>
          
          {/* Add bottom padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
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
    paddingTop: 40,
    paddingBottom: 15,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoriesContainer: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  bottomPadding: {
    height: 30,
  },
}); 