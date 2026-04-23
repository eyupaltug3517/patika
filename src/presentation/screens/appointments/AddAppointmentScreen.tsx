import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NEU, neuChip, neuInset, neuPrimaryButton } from '../../../core/theme/neu';
import { useAppointmentStore, Appointment, TYPE_COLORS } from '../../../store/appointmentStore';

const showAlert = (title: string, message?: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? '\n\n' + message : ''}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'Tamam', onPress: onOk }]);
  }
};

// ─── Sabitler ─────────────────────────────────────────────────────────────────
const APPOINTMENT_TYPES = [
  { label: '🏥 Veteriner', value: 'vet', storeType: 'Veteriner' },
  { label: '✂️ Bakım', value: 'grooming', storeType: 'Bakım' },
  { label: '💉 Aşı', value: 'vaccine', storeType: 'Aşı' },
  { label: '📋 Diğer', value: 'other', storeType: 'Diğer' },
];

const TYPE_VALUE_MAP: Record<string, Appointment['type']> = {
  vet: 'Veteriner',
  grooming: 'Bakım',
  vaccine: 'Aşı',
  other: 'Diğer',
};

const REMINDER_OPTIONS = [
  { label: '30 dk', value: '30' },
  { label: '1 saat', value: '60' },
  { label: '2 saat', value: '120' },
  { label: '1 gün', value: '1440' },
];

// ─── Bileşen ──────────────────────────────────────────────────────────────────
export const AddAppointmentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const addAppointment = useAppointmentStore((s) => s.addAppointment);

  const [appointmentType, setAppointmentType] = useState<string>('vet');
  const [vetName, setVetName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [reminder, setReminder] = useState<string>('30');

  const handleSave = () => {
    const selectedType = TYPE_VALUE_MAP[appointmentType] ?? 'Diğer';
    const newApp: Appointment = {
      id: Date.now().toString(),
      type: selectedType,
      title: vetName || 'Yeni Randevu',
      location: vetName || '',
      phone: phone || '',
      date: date || '',
      time: time || '',
      notes: notes || '',
      color: TYPE_COLORS[selectedType] || '#4CAF82',
    };
    addAppointment(newApp);
    showAlert('Randevu Eklendi! ✅', 'Randevunuz kaydedildi. Hatırlatıcı ayarlandı.', () => navigation.goBack());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Randevu Türü ── */}
        <Text style={styles.sectionLabel}>RANDEVU TÜRÜ</Text>
        <View style={styles.chipRow}>
          {APPOINTMENT_TYPES.map((t) => {
            const isActive = appointmentType === t.value;
            return (
              <TouchableOpacity
                key={t.value}
                activeOpacity={0.8}
                style={[
                  isActive ? styles.chipActive : styles.chipInactive,
                  styles.typeChipBase,
                ]}
                onPress={() => setAppointmentType(t.value)}
              >
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Veteriner / Salon Adı ── */}
        <Text style={styles.sectionLabel}>VETERİNER / SALON ADI</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Dr. Adı veya salon adı"
            placeholderTextColor={NEU.textSecondary}
            value={vetName}
            onChangeText={setVetName}
          />
        </View>

        {/* ── Tarih & Saat ── */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.sectionLabel}>TARİH</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="GG/AA/YYYY"
                placeholderTextColor={NEU.textSecondary}
                keyboardType="numeric"
                value={date}
                onChangeText={setDate}
              />
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.sectionLabel}>SAAT</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="SS:DD"
                placeholderTextColor={NEU.textSecondary}
                keyboardType="numeric"
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>
        </View>

        {/* ── Telefon ── */}
        <Text style={styles.sectionLabel}>TELEFON</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="+90 5XX XXX XX XX"
            placeholderTextColor={NEU.textSecondary}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* ── Notlar ── */}
        <Text style={styles.sectionLabel}>NOTLAR</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Randevu hakkında notlar..."
            placeholderTextColor={NEU.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ── Hatırlatıcı ── */}
        <Text style={styles.sectionLabel}>KAÇ DAKİKA ÖNCE?</Text>
        <View style={styles.chipRow}>
          {REMINDER_OPTIONS.map((r) => {
            const isActive = reminder === r.value;
            return (
              <TouchableOpacity
                key={r.value}
                activeOpacity={0.8}
                style={[
                  isActive ? styles.chipActive : styles.chipInactive,
                  styles.reminderChipBase,
                ]}
                onPress={() => setReminder(r.value)}
              >
                <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Kaydet Butonu ── */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Randevuyu Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Stiller ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  // Etiket
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: NEU.textSecondary,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  // Input wrapper (neuInset)
  inputWrapper: {
    ...neuInset,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: NEU.textPrimary,
  },
  notesInput: {
    height: 80,
    paddingTop: 12,
  },
  // Satır (iki sütun)
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  // Chip sırası
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  // Tür chip base
  typeChipBase: {
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  // Hatırlatıcı chip base
  reminderChipBase: {
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  // Seçili chip
  chipActive: {
    backgroundColor: 'rgba(76,175,130,0.18)',
    borderColor: NEU.primary,
    borderWidth: 2,
    borderRadius: 50,
  },
  // Seçilmemiş chip
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
  // Kaydet butonu
  saveButton: {
    ...neuPrimaryButton,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: NEU.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
