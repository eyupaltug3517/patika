import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { NEU, neuCard, neuPrimaryButton } from '../../../core/theme/neu';
import { useHealthLogStore } from '../../../store/healthLogStore';

const screenWidth = Dimensions.get('window').width - 40;

const FALLBACK_CHART_DATA = {
  labels: ['25 Mar', '1 Nis', '8 Nis', '15 Nis', '22 Nis'],
  datasets: [{ data: [3.85, 3.9, 4.0, 4.1, 4.2] }],
};

const chartConfig = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: '#EDF1F7',
  backgroundGradientTo: '#EDF1F7',
  color: (opacity = 1) => `rgba(76,175,130,${opacity})`,
  strokeWidth: 2.5,
  propsForDots: { r: '5', strokeWidth: '2', stroke: '#4CAF82', fill: '#EDF1F7' },
  propsForBackgroundLines: { stroke: 'rgba(190,195,206,0.4)', strokeDasharray: '' },
  labelColor: () => '#7B8299',
  decimalPlaces: 2,
};

const renderStars = (count: number) => '⭐'.repeat(count);

const renderEnerji = (count: number) => {
  if (count >= 5) return '💚';
  if (count >= 3) return '💛';
  return '🔴';
};

const formatChartLabel = (dateISO: string): string => {
  const monthShort = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                      'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const parts = dateISO.split('-');
  const day = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10) - 1;
  return `${day} ${monthShort[month]}`;
};

export const HealthScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const logs = useHealthLogStore((s) => s.logs);

  // Son 5 kaydı al, ters sırala (eskiden yeniye) grafik için
  const chartSlice = [...logs].slice(0, 5).reverse();
  const weightEntries = chartSlice.filter((l) => l.weight !== null);

  const chartData = weightEntries.length > 0
    ? {
        labels: weightEntries.map((l) => formatChartLabel(l.dateISO)),
        datasets: [{ data: weightEntries.map((l) => l.weight as number) }],
      }
    : FALLBACK_CHART_DATA;

  const currentWeight = logs[0]?.weight ?? 4.2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sağlık Günlüğü</Text>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HealthLogEntry')}
          >
            <Text style={styles.addButtonText}>📋 Kayıt Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Kilo Takip Grafiği Kartı */}
        <View style={styles.weightCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Kilo Takibi</Text>
            <Text style={styles.currentWeight}>{currentWeight} kg</Text>
          </View>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={false}
            withOuterLines={false}
          />
        </View>

        {/* Son Sağlık Kayıtları */}
        <Text style={styles.sectionTitle}>Son Sağlık Kayıtları</Text>
        {logs.map((log, index) => (
          <TouchableOpacity
            key={log.id ?? index}
            style={styles.logRow}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('HealthLogEntry')}
          >
            <View style={styles.logLeft}>
              <Text style={styles.logDate}>{log.date}</Text>
            </View>
            <View style={styles.logEmojis}>
              <Text style={styles.emojiText}>{renderStars(log.appetite)}</Text>
              <Text style={styles.emojiText}>✅</Text>
              <Text style={styles.emojiText}>{renderEnerji(log.energy)}</Text>
              {log.vomiting && <Text style={styles.emojiText}>🤢</Text>}
            </View>
            <Text style={styles.logWeight}>
              {log.weight !== null ? `${log.weight} kg` : '— kg'}
            </Text>
          </TouchableOpacity>
        ))}
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
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
    fontSize: 13,
    fontWeight: '600',
  },
  weightCard: {
    ...neuCard,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NEU.textPrimary,
  },
  currentWeight: {
    fontSize: 18,
    fontWeight: '800',
    color: NEU.primary,
  },
  chart: {
    marginLeft: -16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginBottom: 12,
  },
  logRow: {
    ...neuCard,
    marginBottom: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logLeft: {
    flex: 1,
  },
  logDate: {
    color: NEU.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  logEmojis: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 13,
  },
  logWeight: {
    color: NEU.primary,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'right',
  },
});
