import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Types
import { RootState } from '../../store';
import { MainTabParamList } from '../../navigation/types';

// Utils
import { colors } from '../../utils/colors';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, medications, supplements, alerts } = useSelector((state: RootState) => ({
    user: state.user,
    medications: state.medications.medications,
    supplements: state.supplements.supplements,
    alerts: state.alerts.alerts,
  }));

  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;

  const quickActions = [
    {
      id: 'scan',
      title: 'Scan Medication',
      icon: 'camera-alt',
      onPress: () => navigation.navigate('Camera' as any),
      color: colors.primary,
    },
    {
      id: 'add_medication',
      title: 'Add Medication',
      icon: 'add-circle',
      onPress: () => navigation.navigate('Medications' as any),
      color: colors.info,
    },
    {
      id: 'add_supplement',
      title: 'Add Supplement',
      icon: 'fitness-center',
      onPress: () => navigation.navigate('Supplements' as any),
      color: colors.success,
    },
    {
      id: 'check_interactions',
      title: 'Check Interactions',
      icon: 'warning',
      onPress: () => navigation.navigate('Interactions' as any),
      color: unreadAlertsCount > 0 ? colors.danger : colors.warning,
    },
  ];

  const renderQuickAction = (action: typeof quickActions[0]) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickAction, { borderLeftColor: action.color }]}
      onPress={action.onPress}
    >
      <Icon name={action.icon} size={32} color={action.color} />
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{medications.length}</Text>
        <Text style={styles.statLabel}>Medications</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{supplements.length}</Text>
        <Text style={styles.statLabel}>Supplements</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: unreadAlertsCount > 0 ? colors.danger : colors.success }]}>
          {unreadAlertsCount}
        </Text>
        <Text style={styles.statLabel}>Alerts</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user.profile.firstName || 'User'}!
        </Text>
        <Text style={styles.subtitle}>
          Manage your medications and supplements
        </Text>
      </View>

      {renderStats()}

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity style={styles.activityItem}>
          <Icon name="local-pharmacy" size={24} color={colors.primary} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Medications Updated</Text>
            <Text style={styles.activitySubtitle}>2 hours ago</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.surface,
    marginTop: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivityContainer: {
    padding: 20,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activitySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default HomeScreen;
