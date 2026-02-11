
import { ReservationStatus, StatusConfig } from './types';

export const STATUS_MAP: Record<ReservationStatus, StatusConfig> = {
  available: {
    label: '空きあり',
    icon: '〇',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  few: {
    label: '残りわずか',
    icon: '△',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  full: {
    label: '満席',
    icon: '×',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  none: {
    label: '未実施',
    icon: '－',
    color: 'text-slate-400',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
  },
};

export const REGION_MAPPING: Record<string, string[]> = {
  '関東': ['すべて', '東京都', '埼玉県', '千葉県', '神奈川県', '茨城県', '栃木県', '群馬県'],
  '近畿': ['すべて', '大阪府', '京都府', '兵庫県', '奈良県', '滋賀県', '和歌山県'],
  '中部': ['すべて', '愛知県', '静岡県', '岐阜県', '三重県', '山梨県', '長野県', '新潟県', '富山県', '石川県', '福井県'],
  '東北': ['すべて', '宮城県', '福島県', '山形県', '岩手県', '秋田県', '青森県'],
  '九州': ['すべて', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
  '北海道': ['すべて', '北海道'],
  '中国': ['すべて', '広島県', '岡山県', '鳥取県', '島根県', '山口県'],
  '四国': ['すべて', '香川県', '徳島県', '愛媛県', '高知県'],
};

export const CITY_MAPPING: Record<string, string[]> = {
  '東京都': [
    '港区', '渋谷区', '新宿区', '千代田区', '足立区', '台東区', '大田区', '中央区', 
    '品川区', '文京区', '豊島区', '墨田区', '町田市', '八王子市', '武蔵野市', '立川市'
  ],
  '兵庫県': ['神戸市', '西宮市', '尼崎市', '姫路市'],
  '福岡県': ['福岡市', '北九州市', '久留米市'],
  // Add other prefectures as needed
};

export const REGIONS = Object.keys(REGION_MAPPING);
