
import React, { useState, useRef, useEffect } from "react";
import { STATUS_MAP } from "../constants";
import { ReservationStatus } from "../types";

interface FilterControlsProps {
  language: "ja" | "en";
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRegion: string[];
  onRegionChange: (val: string[]) => void;
  selectedPrefecture: string[];
  onPrefectureChange: (val: string[]) => void;
  selectedCity: string[];
  onCityChange: (val: string[]) => void;
  regions: string[];
  prefectures: string[];
  cities: string[];
  selectedStoreName: string[];
  onStoreNameChange: (val: string[]) => void;
  storeNames: string[];
  selectedDate: string[];
  onDateChange: (val: string[]) => void;
  dates: string[];
  selectedSport: string[];
  onSportChange: (val: string[]) => void;
  sports: string[];
  selectedMatch: string[];
  onMatchChange: (val: string[]) => void;
  matches: string[];
  selectedTableStatus: ReservationStatus | "ALL";
  onTableStatusChange: (status: ReservationStatus | "ALL") => void;
  selectedStandingStatus: ReservationStatus | "ALL";
  onStandingStatusChange: (status: ReservationStatus | "ALL") => void;
  onReset: () => void;
}

const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  formatOption?: (val: string) => string;
  disabled?: boolean;
}> = ({ label, options, selectedValues, onChange, formatOption, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const currentLabel = selectedValues.length > 0 
    ? `${label} (${selectedValues.length})` 
    : label;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-left flex justify-between items-center shadow-sm transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-300'}`}
      >
        <span className={selectedValues.length > 0 ? "text-blue-600" : "text-slate-600"}>{currentLabel}</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto p-2 space-y-1">
          {options.filter(opt => opt !== "ALL").map(opt => (
            <label key={opt} className="flex items-center gap-3 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedValues.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
                {formatOption ? formatOption(opt) : opt}
              </span>
            </label>
          ))}
          {options.length <= 1 && (
            <div className="text-xs text-slate-400 p-2 italic text-center">選択肢がありません</div>
          )}
        </div>
      )}
    </div>
  );
};

const FilterControls: React.FC<FilterControlsProps> = ({
  language,
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedPrefecture,
  onPrefectureChange,
  selectedCity,
  onCityChange,
  regions,
  prefectures,
  cities,
  selectedStoreName,
  onStoreNameChange,
  storeNames,
  selectedDate,
  onDateChange,
  dates,
  selectedSport,
  onSportChange,
  sports,
  selectedMatch,
  onMatchChange,
  matches,
  selectedTableStatus,
  onTableStatusChange,
  selectedStandingStatus,
  onStandingStatusChange,
  onReset,
}) => {
  const allLabel = language === "ja" ? "すべて" : "All";

  const translate = (val: string) => {
    if (language === "ja") return val;
    const mapping: Record<string, string> = {
      "関東": "Kanto", "中部": "Chubu", "関西": "Kansai", "九州": "Kyushu", "北海道": "Hokkaido", "東北": "Tohoku",
      "東京都": "Tokyo", "神奈川県": "Kanagawa", "愛知県": "Aichi", "大阪府": "Osaka", "福岡県": "Fukuoka"
    };
    return mapping[val] || val;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dayMapJa = ["日", "月", "火", "水", "木", "金", "土"];
    const dayMapEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return language === "ja" 
      ? `${month}月${day}日（${dayMapJa[d.getDay()]}）`
      : `${month}/${day} (${dayMapEn[d.getDay()]})`;
  };

  return (
    <div className="space-y-4 mb-8 px-4">
      {/* 検索・地域・都道府県・市区町村 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="flex gap-2 w-full">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={language === "ja" ? "店舗名・住所で検索..." : "Search..."}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all shadow-sm"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={onReset}
            className="lg:hidden shrink-0 flex flex-col items-center justify-center px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{language === "ja" ? "クリア" : "Clear"}</span>
          </button>
        </div>

        <MultiSelect
          label={language === "ja" ? "エリア" : "Region"}
          options={regions}
          selectedValues={selectedRegion}
          onChange={(vals) => {
            onRegionChange(vals);
            onPrefectureChange([]);
            onCityChange([]);
          }}
          formatOption={translate}
        />

        <MultiSelect
          label={language === "ja" ? "都道府県" : "Prefecture"}
          options={prefectures}
          selectedValues={selectedPrefecture}
          onChange={(vals) => {
            onPrefectureChange(vals);
            onCityChange([]);
          }}
          formatOption={translate}
          disabled={selectedRegion.length === 0 && regions.length > 1}
        />

        <MultiSelect
          label={language === "ja" ? "区市町村" : "City"}
          options={cities}
          selectedValues={selectedCity}
          onChange={onCityChange}
          formatOption={translate}
          disabled={selectedPrefecture.length === 0 && prefectures.length > 1}
        />

        {/* PC Reset Button */}
        <button
          onClick={onReset}
          className="hidden lg:flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-black transition-all shadow-md active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {language === "ja" ? "条件をリセット" : "Reset Filters"}
        </button>
      </div>

      {/* 日付・競技・カードフィルター */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MultiSelect
          label={language === "ja" ? "日付" : "Date"}
          options={dates}
          selectedValues={selectedDate}
          onChange={onDateChange}
          formatOption={formatDate}
        />

        <MultiSelect
          label={language === "ja" ? "競技" : "Sport Type"}
          options={sports}
          selectedValues={selectedSport}
          onChange={onSportChange}
        />

        <MultiSelect
          label={language === "ja" ? "カード" : "Match Card"}
          options={matches}
          selectedValues={selectedMatch}
          onChange={onMatchChange}
        />
      </div>

      {/* 混雑状況で絞り込むセクション */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[17px] font-black text-slate-800">
            {language === "ja" ? "混雑状況で絞り込む" : "Filter by Status"}
          </h4>
        </div>

        <div className="space-y-4">
          {/* テーブル席 */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === "ja" ? "テーブル席" : "Table Seats"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onTableStatusChange("ALL")}
                className={`px-5 py-2 rounded-lg text-[13px] font-black transition-all shadow-sm border ${
                  selectedTableStatus === "ALL"
                    ? "bg-[#1e293b] text-white border-[#1e293b]"
                    : "bg-white text-slate-400 border-slate-100"
                }`}
              >
                {allLabel}
              </button>
              {(Object.keys(STATUS_MAP) as ReservationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onTableStatusChange(selectedTableStatus === status ? "ALL" : status)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all flex items-center gap-2 shadow-sm ${
                    selectedTableStatus === status
                      ? `${STATUS_MAP[status].bg} ${STATUS_MAP[status].color} ${STATUS_MAP[status].border} ring-2 ring-slate-100`
                      : `bg-white text-slate-400 border-slate-100`
                  }`}
                >
                  <span className="text-lg leading-none opacity-60">{STATUS_MAP[status].icon}</span>
                  {language === "ja" ? STATUS_MAP[status].label : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* スタンディングエリア */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {language === "ja" ? "スタンディングエリア" : "Standing Area"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onStandingStatusChange("ALL")}
                className={`px-5 py-2 rounded-lg text-[13px] font-black transition-all shadow-sm border ${
                  selectedStandingStatus === "ALL"
                    ? "bg-[#1e293b] text-white border-[#1e293b]"
                    : "bg-white text-slate-400 border-slate-100"
                }`}
              >
                {allLabel}
              </button>
              {(Object.keys(STATUS_MAP) as ReservationStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onStandingStatusChange(selectedStandingStatus === status ? "ALL" : status)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-all flex items-center gap-2 shadow-sm ${
                    selectedStandingStatus === status
                      ? `${STATUS_MAP[status].bg} ${STATUS_MAP[status].color} ${STATUS_MAP[status].border} ring-2 ring-slate-100`
                      : `bg-white text-slate-400 border-slate-100`
                  }`}
                >
                  <span className="text-lg leading-none opacity-60">{STATUS_MAP[status].icon}</span>
                  {language === "ja" ? STATUS_MAP[status].label : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
