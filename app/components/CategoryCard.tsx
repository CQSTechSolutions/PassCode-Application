import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  borderColor: ColorValue;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  onPress,
  borderColor
}) => {
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: borderColor }]} onPress={onPress}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default CategoryCard; 