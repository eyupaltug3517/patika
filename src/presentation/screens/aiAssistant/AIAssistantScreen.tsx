import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NEU, neuCard, neuChip, neuInset, neuPrimaryButton, neuCircle } from '../../../core/theme/neu';

const QUICK_SYMPTOMS = [
  'İştahsızlık',
  'Kusma',
  'İshal',
  'Letarji',
  'Aşırı su içme',
  'Hapşırma',
  'Öksürük',
  'Kaşıma',
];

type UrgencyLevel = 'NORMAL' | 'DİKKAT' | 'ACİL';

interface AnalysisResult {
  text: string;
  urgency: UrgencyLevel;
}

const MOCK_RESPONSE: AnalysisResult = {
  urgency: 'DİKKAT',
  text:
    '🔍 Durum Değerlendirmesi: Belirttiğiniz semptomlar birkaç farklı durumun işareti olabilir. Genellikle hafif sindirim sorunları veya stres bu belirtilere yol açabilir.\n\n⚠️ Aciliyet: DİKKAT\n\n✅ Önerilen Adımlar:\n• 24 saat boyunca su tüketimini ve iştahı yakından takip edin\n• Semptomlarda kötüleşme olursa derhal veterinere gidin\n• 48 saat içinde düzelme olmazsa veteriner randevusu alın',
};

const urgencyBadgeStyles: Record<
  UrgencyLevel,
  { backgroundColor: string; color: string }
> = {
  NORMAL: { backgroundColor: 'rgba(122,158,107,0.15)', color: NEU.primary },
  DİKKAT: { backgroundColor: 'rgba(198,139,58,0.15)', color: '#B87A2A' },
  ACİL: { backgroundColor: 'rgba(184,76,48,0.15)', color: '#A03820' },
};

const AIAssistantScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [queryCount, setQueryCount] = useState(5);

  const handleSymptomChip = (symptom: string) => {
    setInputText((prev) => {
      if (prev.trim() === '') return symptom;
      if (prev.endsWith(', ')) return prev + symptom;
      return prev + ', ' + symptom;
    });
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setQueryCount((prev) => Math.max(0, prev - 1));
    setResult(null);
    setTimeout(() => {
      setResult(MOCK_RESPONSE);
      setIsLoading(false);
    }, 1500);
  };

  const currentUrgencyStyle = result ? urgencyBadgeStyles[result.urgency] : undefined;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'web' ? undefined : (Platform.OS === 'ios' ? 'padding' : 'height')}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={neuCircle(80)}>
            <Text style={styles.headerEmoji}>🤖</Text>
          </View>
          <Text style={styles.headerTitle}>AI Semptom Asistanı</Text>
          <Text style={styles.headerDescription}>
            Karamel'in semptomlarını anlat, aciliyet değerlendirmesi yapayım.
          </Text>
        </View>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Bu bir teşhis aracı değildir. Sonuçlar yalnızca yönlendirme
            amaçlıdır. Mutlaka bir veterinere danışın.
          </Text>
        </View>

        {/* Quick Symptom Chips */}
        <Text style={styles.sectionLabel}>Hızlı Semptom Seç</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {QUICK_SYMPTOMS.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={styles.chip}
              onPress={() => handleSymptomChip(symptom)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>{symptom}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TextInput */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Örn: 3 gündür yemiyor, arada kusma var, normalden daha az aktif..."
            placeholderTextColor={NEU.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            textAlignVertical="top"
          />
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!inputText.trim() || isLoading || queryCount === 0) && styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          activeOpacity={0.8}
          disabled={!inputText.trim() || isLoading || queryCount === 0}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Feather name="cpu" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.analyzeButtonText}>Analiz Et</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Result Card */}
        {result && currentUrgencyStyle && (
          <View style={styles.resultCard}>
            {/* Urgency Badge */}
            <View style={styles.resultHeader}>
              <Feather name="activity" size={18} color={currentUrgencyStyle.color} />
              <Text style={styles.resultTitle}>Analiz Sonucu</Text>
              <View
                style={[
                  styles.urgencyBadge,
                  { backgroundColor: currentUrgencyStyle.backgroundColor },
                ]}
              >
                <Text style={[styles.urgencyBadgeText, { color: currentUrgencyStyle.color }]}>
                  {result.urgency}
                </Text>
              </View>
            </View>
            <Text style={styles.resultText}>{result.text}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Kalan ücretsiz sorgu: {queryCount}/5</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export { AIAssistantScreen };
export default AIAssistantScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  container: {
    flex: 1,
    backgroundColor: NEU.bg,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerEmoji: {
    fontSize: 38,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: NEU.textPrimary,
    marginTop: 14,
    marginBottom: 6,
    textAlign: 'center',
  },
  headerDescription: {
    fontSize: 14,
    color: NEU.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Warning Box
  warningBox: {
    ...neuInset,
    borderLeftWidth: 4,
    borderLeftColor: NEU.urgencyCaution,
    padding: 14,
    marginBottom: 20,
  },
  warningText: {
    fontSize: 13,
    color: NEU.textSecondary,
    lineHeight: 19,
  },

  // Chips
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: NEU.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    paddingBottom: 4,
    marginBottom: 16,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    ...neuChip,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 13,
    color: NEU.textSecondary,
    fontWeight: '500',
  },

  // TextInput
  inputContainer: {
    ...neuInset,
    marginBottom: 16,
    padding: 14,
  },
  textInput: {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: NEU.textPrimary,
    minHeight: 90,
    lineHeight: 21,
  },

  // Analyze Button
  analyzeButton: {
    ...neuPrimaryButton,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  analyzeButtonDisabled: {
    opacity: 0.55,
  },
  buttonIcon: {
    marginRight: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Result Card
  resultCard: {
    ...neuCard,
    padding: 16,
    marginBottom: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: NEU.textPrimary,
    flex: 1,
  },
  urgencyBadge: {
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  urgencyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultText: {
    fontSize: 14,
    color: NEU.textPrimary,
    lineHeight: 24,
  },

  // Footer
  footer: {
    fontSize: 12,
    color: NEU.textDisabled,
    textAlign: 'center',
  },
});
