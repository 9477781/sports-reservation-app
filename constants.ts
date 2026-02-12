import { ReservationStatus, StatusConfig } from "./types";

export const REGIONS = ["すべて", "北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州"];

export const REGION_MAPPING: { [key: string]: string[] } = {
  "すべて": [],
  "北海道": ["北海道"],
  "東北": ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
  "近畿": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  "中国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  "四国": ["徳島県", "香川県", "愛媛県", "高知県"],
  "九州": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
};

export const CITY_MAPPING: { [key: string]: string[] } = {
  "東京都": ["すべて", "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区", "町田市", "八王子市", "武蔵野市", "立川市"],
};

export const STATUS_MAP: Record<ReservationStatus, StatusConfig> = {
  available: { label: "空きあり", icon: "○", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  few: { label: "残りわずか", icon: "△", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  full: { label: "満席", icon: "×", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  none: { label: "未実施", icon: "－", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" },
};

export const parseStatus = (statusStr: string): ReservationStatus => {
  const s = String(statusStr);
  if (s.includes("空きあり") || s.includes("〇") || s.includes("○")) return "available";
  if (s.includes("残りわわずか") || s.includes("残りわずか") || s.includes("△")) return "few";
  if (s.includes("満席") || s.includes("×")) return "full";
  if (s.includes("未実施") || s.includes("－") || s.includes("-") || s.includes("未使用")) return "none";
  return "none";
};
