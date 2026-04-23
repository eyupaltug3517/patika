import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { RootTabParamList } from '../../navigation/types';
import { NEU, neuCard, neuChip, neuInset, neuPrimaryButton, neuCircle } from '../../../core/theme/neu';

type DashboardNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Anasayfa'>,
  NativeStackNavigationProp<RootStackParamList>
>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPet = {
  name: 'Karamel',
  breed: 'British Shorthair Kedi',
  birthDate: '2021-06-15',
  isNeutered: true,
  weightKg: 4.2,
  lastLogLabel: 'Bugün',
  nextVaccineLabel: '6 ay',
};

const mockTasks = [
  { id: '1', title: 'Sabah Maması', time: '08:00', done: true, warning: false },
  { id: '2', title: 'Milbemax İlacı', time: '09:00', done: false, warning: true },
  { id: '3', title: 'Akşam Maması', time: '19:00', done: false, warning: false },
];

const mockEvents = [
  { id: '1', title: 'Tüy Bakımı', date: '28 Nisan', icon: '✂️', type: 'grooming' },
  { id: '2', title: 'Yıllık Kontrol', date: '10 Mayıs', icon: '🏥', type: 'vet' },
];

const quickActions = [
  { id: '1', label: 'Semptom Yaz', emoji: '📝', featherIcon: 'edit-3' as const },
  { id: '2', label: 'Kilo Gir', emoji: '⚖️', featherIcon: 'activity' as const },
  { id: '3', label: 'İlaç Ver', emoji: '💊', featherIcon: 'plus-circle' as const },
  { id: '4', label: 'Randevu Ekle', emoji: '📅', featherIcon: 'calendar' as const },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  const totalMonths = years * 12 + months;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  if (y === 0) return `${m} ay`;
  if (m === 0) return `${y} yaş`;
  return `${y} yaş ${m} ay`;
}

// ─── Platform-aware Alert ─────────────────────────────────────────────────────
const showAlert = (title: string, message?: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? '\n\n' + message : ''}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'Tamam', onPress: onOk }]);
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavProp>();
  const [tasks, setTasks] = useState(mockTasks);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const petAge = calcAge(mockPet.birthDate);
  const initial = mockPet.name.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Merhaba! 👋</Text>
          <Text style={styles.subGreeting}>{mockPet.name} nasıl bugün?</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarCircle}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PetProfile', { petId: 'pet-demo-1' })}
        >
          <Text style={styles.avatarLetter}>{initial}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Active Pet Card ── */}
      <TouchableOpacity
        style={styles.petCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PetProfile', { petId: 'pet-demo-1' })}
      >
        {/* Top row */}
        <View style={styles.petCardTop}>
          <View style={styles.petCardLeft}>
            <Text style={styles.petName}>{mockPet.name}</Text>
            <Text style={styles.petBreed}>{mockPet.breed}</Text>
            <Text style={styles.petAge}>{petAge}</Text>
          </View>
          {mockPet.isNeutered && (
            <View style={styles.neuteredBadge}>
              <Feather name="check" size={12} color={NEU.primary} />
              <Text style={styles.neuteredText}>Kısırlaştırıldı</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.petCardDivider} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="thermometer" size={16} color={NEU.primary} />
            <Text style={styles.statValue}>{mockPet.weightKg} kg</Text>
            <Text style={styles.statLabel}>Ağırlık</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="calendar" size={16} color={NEU.primary} />
            <Text style={styles.statValue}>{mockPet.lastLogLabel}</Text>
            <Text style={styles.statLabel}>Son log</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="shield" size={16} color={NEU.primary} />
            <Text style={styles.statValue}>{mockPet.nextVaccineLabel}</Text>
            <Text style={styles.statLabel}>Sonraki aşı</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Today's Tasks ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bugünkü Görevler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HealthLogEntry')}>
            <Text style={styles.sectionLink}>Tümü</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <TouchableOpacity
                style={styles.taskRow}
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.7}
              >
                {/* Checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    task.done && styles.checkboxDone,
                    task.warning && !task.done && styles.checkboxWarning,
                  ]}
                >
                  {task.done && <Feather name="check" size={12} color="#FFFFFF" />}
                </View>

                {/* Title & Time */}
                <View style={styles.taskInfo}>
                  <Text
                    style={[styles.taskTitle, task.done && styles.taskTitleDone]}
                  >
                    {task.title}
                  </Text>
                  <View style={styles.taskTimeRow}>
                    <Feather name="clock" size={12} color={NEU.textSecondary} />
                    <Text style={styles.taskTime}>{task.time}</Text>
                    {task.warning && !task.done && (
                      <View style={styles.warningBadge}>
                        <Feather name="alert-circle" size={10} color={NEU.urgencyCaution} />
                        <Text style={styles.warningText}>Bekliyor</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {index < tasks.length - 1 && <View style={styles.rowDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ── Upcoming Events ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yaklaşan Etkinlikler</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddAppointment')}>
            <Text style={styles.sectionLink}>Tümü</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {mockEvents.map((event, index) => (
            <React.Fragment key={event.id}>
              <TouchableOpacity
                style={styles.eventRow}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('AddAppointment')}
              >
                <View
                  style={[
                    styles.eventIconWrap,
                    event.type === 'vet'
                      ? styles.eventIconVet
                      : styles.eventIconGrooming,
                  ]}
                >
                  <Text style={styles.eventEmoji}>{event.icon}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={NEU.textSecondary} />
              </TouchableOpacity>
              {index < mockEvents.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* ── Quick Actions ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              activeOpacity={0.75}
              onPress={() => {
                if (action.id === '1') {
                  navigation.navigate('Asistan');
                } else if (action.id === '2') {
                  navigation.navigate('HealthLogEntry');
                } else if (action.id === '3') {
                  showAlert(
                    '💊 İlaç Verildi',
                    'Milbemax (1 tablet) verildi olarak işaretlendi.\n\nSonraki doz: 1 ay sonra.',
                  );
                } else if (action.id === '4') {
                  navigation.navigate('AddAppointment');
                }
              }}
            >
              <Text style={styles.actionEmoji}>{action.emoji}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

export { DashboardScreen };
export default DashboardScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: NEU.textPrimary,
  },
  subGreeting: {
    fontSize: 14,
    color: NEU.textSecondary,
    marginTop: 2,
  },
  avatarCircle: {
    ...neuCircle(52),
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: NEU.primary,
  },

  // Pet Card
  petCard: {
    ...neuCard,
    padding: 20,
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: NEU.primary,
  },
  petCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  petCardLeft: {
    flex: 1,
  },
  petName: {
    fontSize: 26,
    fontWeight: '800',
    color: NEU.textPrimary,
  },
  petBreed: {
    fontSize: 13,
    color: NEU.textSecondary,
    marginTop: 2,
  },
  petAge: {
    fontSize: 13,
    color: NEU.textSecondary,
    marginTop: 2,
  },
  neuteredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    ...neuChip,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  neuteredText: {
    fontSize: 11,
    fontWeight: '600',
    color: NEU.primary,
  },
  petCardDivider: {
    height: 1,
    backgroundColor: NEU.shadowDark,
    opacity: 0.2,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    ...neuInset,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: NEU.textSecondary,
  },
  statDivider: {
    width: 0,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginBottom: 12,
  },
  sectionLink: {
    fontSize: 13,
    color: NEU.primary,
    fontWeight: '600',
  },
  card: {
    ...neuCard,
    paddingVertical: 4,
  },
  rowDivider: {
    height: 1,
    backgroundColor: NEU.shadowDark,
    opacity: 0.15,
    marginHorizontal: 16,
  },

  // Tasks
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: NEU.shadowDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEU.surfaceDark,
  },
  checkboxDone: {
    backgroundColor: NEU.primary,
    borderColor: NEU.primary,
  },
  checkboxWarning: {
    borderColor: NEU.urgencyCaution,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: NEU.textPrimary,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: NEU.textSecondary,
  },
  taskTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  taskTime: {
    fontSize: 12,
    color: NEU.textSecondary,
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEU.surfaceDark,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
    marginLeft: 4,
  },
  warningText: {
    fontSize: 10,
    color: NEU.urgencyCaution,
    fontWeight: '600',
  },

  // Events
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  eventIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...neuInset,
  },
  eventIconGrooming: {
    backgroundColor: NEU.surfaceDark,
  },
  eventIconVet: {
    backgroundColor: NEU.surfaceDark,
  },
  eventEmoji: {
    fontSize: 20,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: NEU.textPrimary,
  },
  eventDate: {
    fontSize: 12,
    color: NEU.textSecondary,
    marginTop: 2,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    ...neuCard,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: NEU.textPrimary,
    textAlign: 'center',
  },
});
