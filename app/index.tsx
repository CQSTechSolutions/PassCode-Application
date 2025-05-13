// ToDo: make the quick summary section at center of the screen
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppHeader from "./components/AppHeader";
import CategoryCard from "./components/CategoryCard";
import SummaryCard from "./components/SummaryCard";
import { getRevenues, getExpenses } from "./services/financialServices";
import { getProjects } from "./services/projectServices";
import { getClients } from "./services/clientServices";

export default function Index() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    clientCount: 0,
    projectCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    // Fetch data for the dashboard
    const fetchDashboardData = async () => {
      try {
        // Parallel data fetching for better performance
        const [revenues, expenses, clients, projects] = await Promise.all([
          getRevenues(),
          getExpenses(),
          getClients(),
          getProjects()
        ]);

        // Calculate totals
        const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.gross_profit, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        setStats({
          totalRevenue,
          totalExpenses,
          clientCount: clients.length,
          projectCount: projects.length,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const handleSettingsPress = () => {
    // Implement settings functionality
    console.log('Settings pressed');
  };

  const navigateToFinancial = () => {
    console.log('Navigate to Financial');
    router.push('/financial');
  };

  const navigateToClients = () => {
    console.log('Navigate to Clients');
    router.push('/clients');
  };

  const navigateToProjects = () => {
    console.log('Navigate to Projects');
    router.push('/projects');
  };

  if (stats.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Loading dashboard data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="CQS Tech Solutions" onSettingsPress={handleSettingsPress} />
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Accounts Manager</Text>
        <Text style={styles.sectionSubtitle}>
          Manage your finances, clients, and projects
        </Text>

        {/* Category Cards */}
        <View style={styles.cardsContainer}>
          <CategoryCard
            title="Financial Records"
            description="Manage revenues, expenses, provisions, advances and liabilities"
            icon={<Ionicons name="cash-outline" size={32} color="white" style={styles.financialIcon} />}
            onPress={navigateToFinancial}
            borderColor="#4caf50"
          />
          
          <CategoryCard
            title="Client Records"
            description="Manage client information and details"
            icon={<Ionicons name="people-outline" size={32} color="white" style={styles.clientIcon} />}
            onPress={navigateToClients}
            borderColor="#2196f3"
          />
          
          <CategoryCard
            title="Project Records"
            description="Track projects, milestones, and deliverables"
            icon={<Ionicons name="briefcase-outline" size={32} color="white" style={styles.projectIcon} />}
            onPress={navigateToProjects}
            borderColor="#ff9800"
          />
        </View>

        {/* Quick Summary Section */}
        <Text style={styles.summaryTitle}>Quick Summary</Text>
        <View style={[styles.summaryContainer]}>
          <View style={styles.summaryRow}>
            <SummaryCard title="Total Revenue" value={stats.totalRevenue} />
            <SummaryCard title="Total Expenses" value={stats.totalExpenses} />
          </View>
          <View style={styles.summaryRow}>
            <SummaryCard title="Total Clients" value={stats.clientCount} currency="" />
            <SummaryCard title="Active Projects" value={stats.projectCount} currency="" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    marginBottom: 20,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  summaryContainer: {
    marginBottom: 20,
    flexDirection: "column",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  financialIcon: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 8,
  },
  clientIcon: {
    backgroundColor: "#2196f3",
    padding: 10,
    borderRadius: 8,
  },
  projectIcon: {
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 8,
  },
});
