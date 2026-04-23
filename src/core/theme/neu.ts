// ============================================================
// PATIKA — Nature / Earthy Design System
// ============================================================

export const NEU = {
  // Renkler
  bg:          '#F0EAE0',   // sıcak kum — ana arka plan
  surface:     '#F7F2EA',   // sıcak krem — kart yüzeyi
  surfaceDark: '#E6DDD1',   // sıcak ten — basılı / inset yüzey
  shadowDark:  '#C8BAA8',   // koyu kahve gölge
  shadowLight: '#FFFFFF',   // açık vurgu

  primary:      '#7A9E6B',  // adaçayı yeşili
  primaryLight: 'rgba(122,158,107,0.18)',
  primaryDark:  '#4E7040',  // derin orman yeşili

  urgencyNormal:    '#7A9E6B',  // adaçayı
  urgencyCaution:   '#C68B3A',  // sıcak amber
  urgencyEmergency: '#B84C30',  // kiremit kırmızı

  textPrimary:   '#3A2C1E',  // koyu sıcak kahve
  textSecondary: '#7A6855',  // orta kahve
  textDisabled:  '#B5A898',  // açık ten
  textInverse:   '#FFFFFF',
  textAccent:    '#7A9E6B',  // adaçayı
} as const;

// ---- Stil Yardımcıları ----

/** Yükseltilmiş kart (raised) */
export const neuCard = {
  backgroundColor: NEU.surface,
  borderRadius: 20,
  shadowColor: NEU.shadowDark,
  shadowOffset: { width: 8, height: 8 },
  shadowOpacity: 0.5,
  shadowRadius: 15,
  elevation: 6,
  borderWidth: 1.5,
  borderTopColor:    'rgba(255,255,255,0.92)',
  borderLeftColor:   'rgba(255,255,255,0.92)',
  borderBottomColor: 'rgba(200,186,168,0.25)',
  borderRightColor:  'rgba(200,186,168,0.25)',
} as const;

/** Küçük yükseltilmiş öge (chip, badge) */
export const neuChip = {
  backgroundColor: NEU.surface,
  borderRadius: 50,
  shadowColor: NEU.shadowDark,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 0.45,
  shadowRadius: 8,
  elevation: 4,
  borderWidth: 1,
  borderTopColor:    'rgba(255,255,255,0.9)',
  borderLeftColor:   'rgba(255,255,255,0.9)',
  borderBottomColor: 'rgba(200,186,168,0.2)',
  borderRightColor:  'rgba(200,186,168,0.2)',
} as const;

/** Basılı / inset öge (input alanı, iç çerçeve) */
export const neuInset = {
  backgroundColor: NEU.surfaceDark,
  borderRadius: 14,
  borderWidth: 1,
  borderTopColor:    NEU.shadowDark,
  borderLeftColor:   NEU.shadowDark,
  borderBottomColor: 'rgba(255,255,255,0.8)',
  borderRightColor:  'rgba(255,255,255,0.8)',
  shadowColor: NEU.shadowDark,
  shadowOffset: { width: -2, height: -2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 0,
} as const;

/** Primary aksiyon butonu */
export const neuPrimaryButton = {
  backgroundColor: NEU.primary,
  borderRadius: 16,
  shadowColor: NEU.primaryDark,
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 6,
  borderWidth: 1,
  borderTopColor:    'rgba(255,255,255,0.35)',
  borderLeftColor:   'rgba(255,255,255,0.35)',
  borderBottomColor: 'rgba(0,0,0,0.12)',
  borderRightColor:  'rgba(0,0,0,0.12)',
} as const;

/** Avatar / yuvarlak ikon kabı */
export const neuCircle = (size: number) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: NEU.surface,
  shadowColor: NEU.shadowDark,
  shadowOffset: { width: 5, height: 5 },
  shadowOpacity: 0.45,
  shadowRadius: 10,
  elevation: 5,
  borderWidth: 1.5,
  borderTopColor:    'rgba(255,255,255,0.9)',
  borderLeftColor:   'rgba(255,255,255,0.9)',
  borderBottomColor: 'rgba(200,186,168,0.2)',
  borderRightColor:  'rgba(200,186,168,0.2)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
});
