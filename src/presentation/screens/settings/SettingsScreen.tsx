import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NEU, neuCard, neuChip, neuCircle, neuPrimaryButton } from '../../../core/theme/neu';

export const SettingsScreen: React.FC = () => {
  const [vaccineReminder, setVaccineReminder] = useState(true);
  const [medicineReminder, setMedicineReminder] = useState(true);
  const [appointmentReminder, setAppointmentReminder] = useState(true);
  const [aiNotification, setAiNotification] = useState(false);

  const PETS = [
    { initial: 'K', color: NEU.primary, name: 'Karamel', breed: 'British Shorthair', age: '4 yaş' },
    { initial: 'P', color: '#FF7043', name: 'Pofuduk', breed: 'Golden Retriever', age: '6 yaş' },
  ];

  const APP_SETTINGS = [
    {
      icon: 'lock' as const,
      label: 'Gizlilik Politikası',
      onPress: () => Alert.alert('Gizlilik Politikası', 'patika.app/privacy'),
      disabled: false,
    },
    {
      icon: 'file-text' as const,
      label: 'Kullanım Koşulları',
      onPress: () => Alert.alert('Kullanım Koşulları', 'patika.app/terms'),
      disabled: false,
    },
    {
      icon: 'star' as const,
      label: 'Uygulamayı Değerlendir',
      onPress: () => Alert.alert('Teşekkürler!', "Google Play'e yönlendiriliyorsunuz."),
      disabled: false,
    },
    {
      icon: 'message-square' as const,
      label: 'Geri Bildirim Gönder',
      onPress: () => Alert.alert('Geri Bildirim', 'Geri bildiriminiz için teşekkürler!'),
      disabled: false,
    },
    {
      icon: 'info' as const,
      label: 'Versiyon: 1.0.0 (MVP)',
      onPress: () => {},
      disabled: true,
    },
  ];

  const NOTIFICATION_ROWS = [
    {
      icon: 'shield' as const,
      label: 'Aşı Hatırlatıcıları',
      value: vaccineReminder,
      onChange: setVaccineReminder,
    },
    {
      icon: 'activity' as const,
      label: 'İlaç Hatırlatıcıları',
      value: medicineReminder,
      onChange: setMedicineReminder,
    },
    {
      icon: 'calendar' as const,
      label: 'Randevu Hatırlatıcıları',
      value: appointmentReminder,
      onChange: setAppointmentReminder,
    },
    {
      icon: 'cpu' as const,
      label: 'AI Analiz Bildirimleri',
      value: aiNotification,
      onChange: setAiNotification,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profil Bölümü */}
      <View style={styles.profileSection}>
        <View style={neuCircle(80)}>
          <Text style={styles.avatarLetter}>K</Text>
        </View>
        <Text style={styles.profileName}>Karamel'in Ailesi</Text>
        <Text style={styles.profileEmail}>kullanici@email.com</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>🌟 Ücretsiz Plan</Text>
        </View>
      </View>

      {/* Hayvanlarım Bölümü */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hayvanlarım</Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Bilgi', 'Yeni hayvan ekleme yakında!')}
            activeOpacity={0.8}
          >
            <Text style={styles.addButton}>Ekle ➕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.petsRow}
        >
          {PETS.map((pet) => (
            <TouchableOpacity
              key={pet.name}
              style={styles.petCard}
              onPress={() => Alert.alert('Bilgi', 'Hayvan profili açılıyor...')}
              activeOpacity={0.8}
            >
              <View style={[neuCircle(50), styles.petAvatarOverride]}>
                <Text style={[styles.petAvatarLetter, { color: pet.color }]}>{pet.initial}</Text>
              </View>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
              <Text style={styles.petAge}>{pet.age}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bildirim Ayarları */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bildirim Ayarları</Text>
        <View style={styles.card}>
          {NOTIFICATION_ROWS.map((row, index) => (
            <View key={row.label}>
              <View style={styles.notificationRow}>
                <View style={styles.rowLeft}>
                  <Feather name={row.icon} size={18} color={NEU.textSecondary} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>{row.label}</Text>
                </View>
                <Switch
                  value={row.value}
                  onValueChange={row.onChange}
                  trackColor={{ false: '#BEC3CE', true: NEU.primary }}
                  thumbColor={NEU.shadowLight}
                />
              </View>
              {index < NOTIFICATION_ROWS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>

      {/* Uygulama Ayarları */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
        <View style={styles.card}>
          {APP_SETTINGS.map((item, index) => (
            <View key={item.label}>
              <TouchableOpacity
                style={[styles.appSettingRow, item.disabled && styles.disabledRow]}
                onPress={item.onPress}
                activeOpacity={item.disabled ? 1 : 0.8}
                disabled={item.disabled}
              >
                <View style={styles.rowLeft}>
                  <Feather
                    name={item.icon}
                    size={18}
                    color={NEU.textSecondary}
                    style={styles.rowIcon}
                  />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                </View>
                {!item.disabled && (
                  <Feather name="chevron-right" size={18} color={NEU.textDisabled} />
                )}
              </TouchableOpacity>
              {index < APP_SETTINGS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>


      {/* Çıkış Butonu */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            { text: 'Çıkış Yap', style: 'destructive', onPress: () => {} },
          ])
        }
        activeOpacity={0.8}
      >
        <Feather name="log-out" size={18} color="#EF4444" style={styles.rowIcon} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  contentContainer: {
    paddingBottom: 32,
  },

  // Profil Bölümü
  profileSection: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: NEU.bg,
  },
  avatarLetter: {
    fontSize: 32,
    fontWeight: '700',
    color: NEU.primary,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginTop: 14,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: NEU.textSecondary,
    marginBottom: 12,
  },
  planBadge: {
    ...neuChip,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  planBadgeText: {
    fontSize: 13,
    color: NEU.primary,
    fontWeight: '600',
  },

  // Section
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginBottom: 12,
  },
  addButton: {
    fontSize: 14,
    color: NEU.primary,
    fontWeight: '600',
  },

  // Pets
  petsRow: {
    gap: 12,
    paddingBottom: 4,
  },
  petCard: {
    ...neuCard,
    width: 140,
    padding: 16,
    alignItems: 'center',
  },
  petAvatarOverride: {
    marginBottom: 10,
  },
  petAvatarLetter: {
    fontSize: 20,
    fontWeight: '700',
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 12,
    color: NEU.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  petAge: {
    fontSize: 12,
    color: NEU.textSecondary,
  },

  // Card
  card: {
    ...neuCard,
    overflow: 'hidden',
  },

  // Divider
  divider: {
    backgroundColor: 'rgba(190,195,206,0.3)',
    height: 1,
    marginHorizontal: 16,
  },

  // Notification rows
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: NEU.textPrimary,
    fontWeight: '500',
  },

  // App settings rows
  appSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  disabledRow: {
    opacity: 0.5,
  },


  // Logout
  logoutButton: {
    ...neuCard,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#EF4444',
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },

  bottomSpacer: {
    height: 16,
  },
});
