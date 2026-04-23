import React from 'react';
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { NEU, neuCard, neuChip, neuInset, neuCircle } from '../../../core/theme/neu';

const showAlert = (title: string, message?: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}${message ? '\n\n' + message : ''}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'Tamam', onPress: onOk }]);
  }
};

type PetProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'PetProfile'>;
type PetProfileRouteProp = RouteProp<RootStackParamList, 'PetProfile'>;

const calculateAge = (birthDateStr: string): string => {
  const birth = new Date(birthDateStr);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    years -= 1;
  }
  return `${years} yaşında`;
};

interface VaccineRecord {
  name: string;
  lastDate: string;
  nextDate: string;
  status: 'güncel' | 'yaklaşan' | 'gecikmiş';
}

interface Medication {
  name: string;
  dose: string;
  frequency: string;
}

const VACCINES: VaccineRecord[] = [
  {
    name: 'Kuduz Aşısı',
    lastDate: '15 Eki 2025',
    nextDate: '15 Eki 2026',
    status: 'güncel',
  },
  {
    name: '3lü Kombine',
    lastDate: '15 Eki 2025',
    nextDate: '15 Eki 2026',
    status: 'güncel',
  },
];

const MEDICATIONS: Medication[] = [
  { name: 'Milbemax', dose: '1 tablet', frequency: 'Aylık' },
];

const statusColors: Record<
  VaccineRecord['status'],
  { bg: string; text: string; label: string }
> = {
  güncel: { bg: 'rgba(122,158,107,0.15)', text: NEU.primary, label: 'Güncel' },
  yaklaşan: { bg: 'rgba(198,139,58,0.15)', text: '#B87A2A', label: 'Yaklaşan' },
  gecikmiş: { bg: 'rgba(184,76,48,0.15)', text: '#A03820', label: 'Gecikmiş' },
};

const renderStars = (count: number, total: number = 5): React.ReactNode => {
  return (
    <Text style={styles.stars}>
      {'⭐'.repeat(count)}
      {'☆'.repeat(total - count)}
    </Text>
  );
};

const PetProfileScreen: React.FC = () => {
  const navigation = useNavigation<PetProfileNavProp>();
  const route = useRoute<PetProfileRouteProp>();
  // petId route param'dan alınıyor; mock data kullanılmaya devam ediyor
  const _petId = route.params?.petId;
  const age = calculateAge('2021-06-15');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={neuCircle(90)}>
          <Text style={styles.avatarLetter}>K</Text>
        </View>
        <Text style={styles.petName}>Karamel</Text>
        <Text style={styles.petBreed}>British Shorthair</Text>
        <View style={styles.ageBadge}>
          <Feather name="calendar" size={13} color={NEU.primary} />
          <Text style={styles.ageBadgeText}>{age}</Text>
        </View>
      </View>

      {/* Card 1: Temel Bilgiler */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Feather name="info" size={16} color={NEU.primary} />
          <Text style={styles.cardTitle}>Temel Bilgiler</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Tür</Text>
            <Text style={styles.gridValue}>🐱 Kedi</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Cinsiyet</Text>
            <Text style={styles.gridValue}>♀ Dişi</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Doğum</Text>
            <Text style={styles.gridValue}>15 Haz 2021</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Kısırlaştırma</Text>
            <Text style={styles.gridValue}>✓ Evet</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.chipNoRow}>
          <Feather name="cpu" size={13} color={NEU.textSecondary} />
          <Text style={styles.chipNoLabel}>Çip No</Text>
          <Text style={styles.chipNoValue}>941000026523842</Text>
        </View>
      </View>

      {/* Card 2: Son Sağlık Durumu */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Feather name="heart" size={16} color={NEU.primary} />
          <Text style={styles.cardTitle}>Son Sağlık Durumu</Text>
        </View>

        <View style={styles.healthRow}>
          <View style={styles.healthLabelGroup}>
            <Feather name="trending-up" size={14} color={NEU.textSecondary} />
            <Text style={styles.healthLabel}>Ağırlık</Text>
          </View>
          <View style={styles.healthValueGroup}>
            <Text style={styles.healthValue}>4.2 kg</Text>
            <Text style={styles.healthDate}>22 Nis</Text>
          </View>
        </View>

        <View style={styles.healthRow}>
          <View style={styles.healthLabelGroup}>
            <Feather name="coffee" size={14} color={NEU.textSecondary} />
            <Text style={styles.healthLabel}>İştah</Text>
          </View>
          <View style={styles.healthValueGroup}>
            {renderStars(5)}
            <Text style={styles.healthSubtext}>(5/5)</Text>
          </View>
        </View>

        <View style={[styles.healthRow, styles.healthRowLast]}>
          <View style={styles.healthLabelGroup}>
            <Feather name="zap" size={14} color={NEU.textSecondary} />
            <Text style={styles.healthLabel}>Enerji</Text>
          </View>
          <View style={styles.healthValueGroup}>
            {renderStars(5)}
            <Text style={styles.healthSubtext}>(5/5)</Text>
          </View>
        </View>
      </View>

      {/* Card 3: Aşı Bilgileri */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Feather name="shield" size={16} color={NEU.primary} />
          <Text style={styles.cardTitle}>Aşı Bilgileri</Text>
        </View>

        {VACCINES.map((vaccine, index) => {
          const vstyle = statusColors[vaccine.status];
          return (
            <View
              key={vaccine.name}
              style={[
                styles.vaccineItem,
                index < VACCINES.length - 1 && styles.vaccineDivider,
              ]}
            >
              <View style={styles.vaccineInfo}>
                <Text style={styles.vaccineName}>{vaccine.name}</Text>
                <Text style={styles.vaccineDate}>Son: {vaccine.lastDate}</Text>
                <Text style={styles.vaccineDate}>
                  Sonraki: {vaccine.nextDate}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: vstyle.bg }]}>
                <Text style={[styles.statusBadgeText, { color: vstyle.text }]}>
                  {vstyle.label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Card 4: Aktif İlaçlar */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Feather name="package" size={16} color={NEU.primary} />
          <Text style={styles.cardTitle}>Aktif İlaçlar</Text>
        </View>

        {MEDICATIONS.map((med) => (
          <View key={med.name} style={styles.medicationRow}>
            <View style={styles.medIconCircle}>
              <Feather name="plus-circle" size={18} color={NEU.primary} />
            </View>
            <View style={styles.medInfo}>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDetail}>
                {med.dose} · {med.frequency}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.outlineButton}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('HealthLogEntry')}
        >
          <Feather name="book-open" size={16} color={NEU.primary} />
          <Text style={styles.outlineButtonText}>Sağlık Günlüğü</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          activeOpacity={0.75}
          onPress={() => showAlert('Belgeler', 'Belge yönetimi yakında eklenecek!')}
        >
          <Feather name="file-text" size={16} color={NEU.primary} />
          <Text style={styles.outlineButtonText}>Belgeleri Gör</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export { PetProfileScreen };
export default PetProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Profile Header
  profileHeader: {
    backgroundColor: NEU.bg,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '700',
    color: NEU.primary,
  },
  petName: {
    fontSize: 26,
    fontWeight: '800',
    color: NEU.textPrimary,
    marginTop: 14,
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 15,
    color: NEU.textSecondary,
    marginBottom: 12,
  },
  ageBadge: {
    ...neuChip,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 5,
  },
  ageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: NEU.primary,
  },

  // Cards
  card: {
    ...neuCard,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: NEU.textPrimary,
  },

  // Grid (Card 1)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    ...neuInset,
    width: '46%',
    padding: 12,
    borderRadius: 14,
  },
  gridLabel: {
    fontSize: 11,
    color: NEU.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  gridValue: {
    fontSize: 14,
    color: NEU.textPrimary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: NEU.shadowDark,
    opacity: 0.2,
    marginVertical: 12,
  },
  chipNoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipNoLabel: {
    fontSize: 13,
    color: NEU.textSecondary,
    fontWeight: '600',
  },
  chipNoValue: {
    fontSize: 13,
    color: NEU.textPrimary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
    letterSpacing: 0.5,
  },

  // Health Rows (Card 2)
  healthRow: {
    ...neuInset,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  healthRowLast: {
    marginBottom: 0,
  },
  healthLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  healthLabel: {
    fontSize: 14,
    color: NEU.textSecondary,
    fontWeight: '500',
  },
  healthValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  healthValue: {
    fontSize: 14,
    color: NEU.textPrimary,
    fontWeight: '700',
  },
  healthDate: {
    fontSize: 12,
    color: NEU.textSecondary,
  },
  stars: {
    fontSize: 14,
    letterSpacing: 1,
  },
  healthSubtext: {
    fontSize: 12,
    color: NEU.textSecondary,
  },

  // Vaccines (Card 3)
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  vaccineDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(190,195,206,0.3)',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginBottom: 3,
  },
  vaccineDate: {
    fontSize: 12,
    color: NEU.textSecondary,
    lineHeight: 18,
  },
  statusBadge: {
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Medications (Card 4)
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  medIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NEU.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: 14,
    fontWeight: '700',
    color: NEU.textPrimary,
  },
  medDetail: {
    fontSize: 13,
    color: NEU.textSecondary,
    marginTop: 2,
  },

  // Bottom Buttons
  bottomButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 4,
  },
  outlineButton: {
    ...neuCard,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: NEU.primary,
    paddingVertical: 14,
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: NEU.primary,
  },
});
