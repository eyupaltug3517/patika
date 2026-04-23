import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? '',
  },
  googleMaps: {
    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? extra.googleMapsApiKey ?? '',
  },
  app: {
    env: (process.env.EXPO_PUBLIC_APP_ENV ?? 'development') as 'development' | 'staging' | 'production',
    freeAiQueryLimit: 5,
  },
} as const;
