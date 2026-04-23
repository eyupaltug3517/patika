import Anthropic from '@anthropic-ai/sdk';
import { UrgencyLevel } from '../models';
import { supabase } from './supabaseClient';

const SYSTEM_PROMPT = `Sen bir evcil hayvan sağlığı asistanısın. Görevin, hayvan sahiplerinin anlattığı semptomlara göre durumu değerlendirmek ve veterinere gitme aciliyeti konusunda rehberlik etmektir.

KURALLAR:
- Kesinlikle teşhis koyma
- Her zaman bir veterinere danışmalarını öner
- Aciliyet seviyesini NET belirt: NORMAL / DİKKAT / ACİL
- Türkçe yanıt ver
- Kısa ve anlaşılır ol (maks 150 kelime)

YANIT FORMATI (bu formatı bozma):
🔍 Durum Değerlendirmesi: [1-2 cümle]
⚠️ Aciliyet: [NORMAL/DİKKAT/ACİL]
✅ Önerilen Adımlar:
• [adım 1]
• [adım 2]
• [adım 3]`;

export interface SymptomAnalysisResult {
  response: string;
  urgencyLevel: UrgencyLevel;
}

function parseUrgencyLevel(response: string): UrgencyLevel {
  if (response.includes('ACİL')) return 'ACİL';
  if (response.includes('DİKKAT')) return 'DİKKAT';
  return 'NORMAL';
}

export const claudeService = {
  analyzeSymptoms: async (
    petId: string,
    petName: string,
    petSpecies: string,
    symptomsText: string,
  ): Promise<SymptomAnalysisResult> => {
    // API key Supabase Edge Function üzerinden alınmalı — bu örnek doğrudan bağlantı
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? '',
      dangerouslyAllowBrowser: true,
    });

    const userMessage = `Hayvan Adı: ${petName}
Tür: ${petSpecies === 'dog' ? 'Köpek' : petSpecies === 'cat' ? 'Kedi' : 'Diğer'}
Semptomlar: ${symptomsText}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const responseText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const urgencyLevel = parseUrgencyLevel(responseText);

    // Sonucu kaydet
    await supabase.from('ai_consultations').insert({
      pet_id: petId,
      user_input: symptomsText,
      ai_response: responseText,
      urgency_level: urgencyLevel,
    });

    return { response: responseText, urgencyLevel };
  },

  getRemainingQueries: async (userId: string): Promise<number> => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from('ai_consultations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    const used = count ?? 0;
    const limit = 5; // ücretsiz plan limiti
    return Math.max(0, limit - used);
  },
};
