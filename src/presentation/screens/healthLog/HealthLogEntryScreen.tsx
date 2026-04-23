import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NEU, neuCard, neuChip, neuInset, neuPrimaryButton } from '../../../core/theme/neu';
import { useHealthLogStore, HealthLogEntry } from '../../../store/healthLogStore';

const formatDate = (d: Date): string => {
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const toISO = (d: Date): string => d.toISOString().split('T')[0];

const DIŞKI_LABEL_MAP: Record<string, string> = {
  normal: 'Normal',
  yumusak: 'Yumuşak',
  sivi: 'Sıvı',
  sert: 'Sert',
};

const showAlert = (title: string, message?: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? '\n\n' + message : ''}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'Tamam', onPress: onOk }]);
  }
};

const DIŞKI_SEÇENEKLERI = [
  { label: 'Normal ✅', value: 'normal' },
  { label: 'Yumuşak ⚠️', value: 'yumusak' },
  { label: 'Sıvı 🔴', value: 'sivi' },
  { label: 'Sert 🟡', value: 'sert' },
];

export const HealthLogEntryScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [kilo, setKilo] = useState('');
  const [istah, setIstah] = useState(0);
  const [enerji, setEnerji] = useState(0);
  const [dıskı, setDıskı] = useState('');
  const [kusma, setKusma] = useState<boolean | null>(null);
  const [notlar, setNotlar] = useState('');

  const addLog = useHealthLogStore((s) => s.addLog);

  const handleKaydet = () => {
    const now = new Date();
    const newEntry: HealthLogEntry = {
      id: Date.now().toString(),
      date: formatDate(now),
      dateISO: toISO(now),
      weight: kilo ? parseFloat(kilo) : null,
      appetite: istah,
      energy: enerji,
      stool: DIŞKI_LABEL_MAP[dıskı] ?? dıskı,
      vomiting: kusma === true,
      notes: notlar,
    };
    addLog(newEntry);
    showAlert('Kaydedildi! ✅', 'Sağlık kaydı başarıyla eklendi.', () => navigation.goBack());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bölüm 1 — Tarih */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tarih</Text>
          <View style={styles.dateCard}>
            <Text style={styles.dateText}>Bugün, 22 Nisan 2026</Text>
          </View>
        </View>

        {/* Bölüm 2 — Kilo */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kilo (kg)</Text>
          <View style={styles.insetWrapper}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="örn: 4.2"
              placeholderTextColor={NEU.textDisabled}
              value={kilo}
              onChangeText={setKilo}
            />
          </View>
        </View>

        {/* Bölüm 3 — İştah Puanı */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>İştah Puanı (1-5)</Text>
          <View style={styles.ratingCard}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                activeOpacity={0.8}
                onPress={() => setIstah(val)}
                style={styles.ratingButton}
              >
                <Text
                  style={[
                    styles.ratingIcon,
                    { color: val <= istah ? NEU.primary : NEU.textDisabled },
                  ]}
                >
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bölüm 4 — Enerji Seviyesi */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Enerji Seviyesi (1-5)</Text>
          <View style={styles.ratingCard}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                activeOpacity={0.8}
                onPress={() => setEnerji(val)}
                style={styles.ratingButton}
              >
                <Text
                  style={[
                    styles.ratingIcon,
                    { color: val <= enerji ? NEU.primary : NEU.textDisabled },
                  ]}
                >
                  ⚡
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bölüm 5 — Dışkı Durumu */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dışkı Durumu</Text>
          <View style={styles.chipRow}>
            {DIŞKI_SEÇENEKLERI.map((item) => {
              const selected = dıskı === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.8}
                  onPress={() => setDıskı(item.value)}
                  style={[
                    styles.chip,
                    selected && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bölüm 6 — Kusma */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Kusma</Text>
          <View style={styles.chipRow}>
            {[
              { label: 'Hayır', value: false },
              { label: 'Evet', value: true },
            ].map((item) => {
              const selected = kusma === item.value;
              return (
                <TouchableOpacity
                  key={String(item.value)}
                  activeOpacity={0.8}
                  onPress={() => setKusma(item.value)}
                  style={[
                    styles.chip,
                    selected && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bölüm 7 — Notlar */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Semptomlar / Notlar</Text>
          <View style={styles.insetWrapper}>
            <TextInput
              style={styles.multilineInput}
              multiline
              numberOfLines={3}
              placeholder="Bugün nasıl hissetti? Varsa semptomlar..."
              placeholderTextColor={NEU.textDisabled}
              value={notlar}
              onChangeText={setNotlar}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleKaydet}
        >
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: NEU.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dateCard: {
    ...neuCard,
    padding: 14,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: NEU.textPrimary,
  },
  insetWrapper: {
    ...neuInset,
    padding: 14,
  },
  textInput: {
    backgroundColor: 'transparent',
    color: NEU.textPrimary,
    fontSize: 16,
    paddingVertical: 0,
  },
  ratingCard: {
    ...neuCard,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  ratingButton: {
    padding: 6,
  },
  ratingIcon: {
    fontSize: 28,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    ...neuChip,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipSelected: {
    backgroundColor: 'rgba(76,175,130,0.15)',
    borderColor: NEU.primary,
    borderWidth: 2,
  },
  chipText: {
    fontSize: 14,
    color: NEU.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: NEU.primary,
    fontWeight: '600',
  },
  multilineInput: {
    backgroundColor: 'transparent',
    color: NEU.textPrimary,
    fontSize: 15,
    minHeight: 72,
    paddingVertical: 0,
  },
  saveButton: {
    ...neuPrimaryButton,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: NEU.textInverse,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
