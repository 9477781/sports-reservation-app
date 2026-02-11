
export type ReservationStatus = 'available' | 'few' | 'full' | 'none';

export interface SportsEvent {
  date: string;
  eventName: string;
  matchUp: string;
  status: ReservationStatus;
}

export interface StoreInfo {
  id: string;
  numericId: number;
  name: string;
  name_en: string;
  url: string;
  address: string;
  region: string;
  prefecture: string;
  prefecture_en: string;
  city: string; // Added city for 3-layer filtering
}

export interface StoreData {
  store: StoreInfo;
  events: SportsEvent[];
  updatedAt: string;
}

export interface StatusConfig {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
}
