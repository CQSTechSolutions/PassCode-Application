import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  title: string;
  value: string | number;
  currency?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  currency = '₹' 
}) => {
  // Format the value if it's a number
  const formattedValue = typeof value === 'number' 
    ? `${currency}${value.toLocaleString()}` 
    : value;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{formattedValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    minWidth: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  }
});

export default SummaryCard; 