
export type ReservationStatus = 'available' | 'few' | 'full' | 'none';

export interface StatusConfig {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}

export interface MatchStatus {
  table: string;
  standing: string;
}

export interface SportsMatch {
  date: string;
  display_date: string;
  sport: string;
  match: string;
  match_en: string;
  status: MatchStatus;
}

export interface StoreInfo {
  id: string;
  url: string;
  name: string;
  name_en: string;
  address: string;
  region: string;
  prefecture: string;
  prefecture_en: string;
  city: string;
}

export interface StoreData {
  id: string;
  url: string;
  name: string;
  name_en: string;
  address: string;
  region: string;
  prefecture: string;
  prefecture_en: string;
  city: string;
  matches: SportsMatch[];
  updatedAt?: string; // This might be moved to top level in App.tsx
}

export interface ApiResponse {
  updatedAt: string;
  data: StoreData[];
}
