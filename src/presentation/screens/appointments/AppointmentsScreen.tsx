import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { NEU, neuCard, neuChip, neuPrimaryButton, neuCircle } from '../../../core/theme/neu';
import { useAppointmentStore, Appointment } from '../../../store/appointmentStore';

const showAlert = (title: string, message?: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? '\n\n' + message : ''}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'Tamam', onPress: onOk }]);
  }
};

// ─── Sabitler ────────────────────────────────────────────────────────────────
const APPOINTMENT_ICONS: Record<string, string> = {
  Veteriner: '🏥',
  Bakım: '✂️',
  Aşı: '💉',
  Diğer: '📋',
};

// ─── Filtre Tanımları ─────────────────────────────────────────────────────────
const FILTERS = [
  { label: 'Tümü', value: 'all' },
  { label: 'Veteriner', value: 'Veteriner' },
  { label: 'Bakım', value: 'Bakım' },
  { label: 'Aşı', value: 'Aşı' },
  { label: 'Diğer', value: 'Diğer' },
];

// ─── Bileşen ──────────────────────────────────────────────────────────────────
export const AppointmentsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const appointments = useAppointmentStore((s) => s.appointments);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered =
    activeFilter === 'all'
      ? appointments
      : appointments.filter((a) => a.type === activeFilter);

  const handleCardPress = (item: Appointment) => {
    const message = `${item.location}\n${item.date} - ${item.time}\n📞 ${item.phone}`;
    if (Platform.OS === 'web') {
      window.alert(`${item.title}\n\n${message}`);
    } else {
      Alert.alert(item.title, message, [{ text: 'Ara', onPress: () => {} }, { text: 'Kapat' }]);
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const typeColor = item.color ?? NEU.primary;
    const icon = APPOINTMENT_ICONS[item.type] ?? '📋';
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.card, { borderLeftColor: typeColor }]}
        onPress={() => handleCardPress(item)}
      >
        {/* Sol: ikon dairesi + tarih/saat */}
        <View style={styles.cardLeft}>
          <View style={neuCircle(46)}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        {/* Orta: başlık, veteriner, telefon */}
        <View style={styles.cardMiddle}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardVet}>{item.location}</Text>
          <Text style={styles.cardPhone}>{item.phone}</Text>
        </View>

        {/* Sağ: chevron */}
        <Feather name="chevron-right" size={20} color={NEU.textDisabled} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Randevular</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAppointment')}
        >
          <Text style={styles.addButtonText}>➕ Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Filtre Chipları */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              activeOpacity={0.8}
              style={[
                isActive ? styles.chipActive : styles.chipInactive,
                styles.chipBase,
              ]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Randevu Listesi */}
      {filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Bu kategoride randevu yok 📅</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: NEU.textPrimary,
  },
  addButton: {
    ...neuPrimaryButton,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: {
    color: NEU.textInverse,
    fontWeight: '600',
    fontSize: 14,
  },
  // Filtre
  filterScroll: {
    maxHeight: 54,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  chipBase: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: 'rgba(122,158,107,0.18)',
    borderColor: NEU.primary,
    borderWidth: 2,
    borderRadius: 50,
  },
  chipInactive: {
    ...neuChip,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: NEU.primary,
  },
  chipTextInactive: {
    color: NEU.textSecondary,
  },
  // Liste
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  // Kart
  card: {
    ...neuCard,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLeft: {
    alignItems: 'center',
    width: 60,
    gap: 4,
  },
  iconText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 10,
    color: NEU.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 12,
    color: NEU.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardMiddle: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: NEU.textPrimary,
  },
  cardVet: {
    fontSize: 13,
    color: NEU.textSecondary,
  },
  cardPhone: {
    fontSize: 12,
    color: NEU.textSecondary,
  },
  // Boş durum
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyCard: {
    ...neuCard,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
    color: NEU.textSecondary,
    textAlign: 'center',
  },
});
