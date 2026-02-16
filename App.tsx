
import React, { useState, useEffect, useMemo } from "react";
import { StoreData, ReservationStatus, ApiResponse } from "./types";
import { parseStatus } from "./constants";
import Header from "./components/Header";
import FilterControls from "./components/FilterControls";
import StoreTable from "./components/StoreTable";
import StoreCard from "./components/StoreCard";

const App: React.FC = () => {
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const [data, setData] = useState<StoreData[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedStoreName, setSelectedStoreName] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const [selectedSport, setSelectedSport] = useState<string[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string[]>([]);
  const [selectedTableStatus, setSelectedTableStatus] = useState<ReservationStatus | "ALL">("ALL");
  const [selectedStandingStatus, setSelectedStandingStatus] = useState<ReservationStatus | "ALL">("ALL");

  // 補助関数: 時間情報を抽出してソート用の文字列を作成
  const getMatchSortKey = (m: any) => {
    const timeRegex = /[(（]([0-9:：]+)[)）]\s*$/;
    const parts = m.match.match(timeRegex);
    const time = parts ? parts[1].replace('：', ':').padStart(5, '0') : "99:99";
    return `${m.date} ${time}`;
  };

  // 補助関数: 指定したフィルターを除外してデータをフィルタリングする（選択肢算出用）
  const getFilteredOptionsData = (excludeField?: string) => {
    return data.filter((item) => {
      // 検索クエリ
      if (searchQuery && !excludeField?.includes("search")) {
        const query = searchQuery.toLowerCase();
        const matchSearch = item.name.toLowerCase().includes(query) || 
                          (item.name_en?.toLowerCase().includes(query)) || 
                          item.address?.toLowerCase().includes(query);
        if (!matchSearch) return false;
      }

      // エリア
      if (selectedRegion.length > 0 && excludeField !== "region") {
        if (!selectedRegion.includes(item.region)) return false;
      }

      // 都道府県
      if (selectedPrefecture.length > 0 && excludeField !== "prefecture") {
        if (!selectedPrefecture.includes(item.prefecture)) return false;
      }

      // 市区町村
      if (selectedCity.length > 0 && excludeField !== "city") {
        if (!selectedCity.includes(item.city)) return false;
      }

      // 店舗名
      if (selectedStoreName.length > 0 && excludeField !== "storeName") {
        const name = language === "ja" ? item.name : item.name_en;
        if (!selectedStoreName.includes(name)) return false;
      }

      // イベント系（日付・競技・カード・ステータス）
      const hasMatchingMatch = item.matches.some(m => {
        const dateM = (selectedDate.length === 0 || excludeField === "date" || selectedDate.includes(m.date));
        const sportM = (selectedSport.length === 0 || excludeField === "sport" || selectedSport.includes(m.sport));
        const matchTitleM = (selectedMatch.length === 0 || excludeField === "match" || selectedMatch.includes(language === "ja" ? m.match : m.match_en));
        const tableM = (selectedTableStatus === "ALL" || excludeField === "tableStatus" || parseStatus(m.status.table) === selectedTableStatus);
        const standingM = (selectedStandingStatus === "ALL" || excludeField === "standingStatus" || parseStatus(m.status.standing) === selectedStandingStatus);
        
        return dateM && sportM && matchTitleM && tableM && standingM;
      });

      return hasMatchingMatch;
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/data/status.json");
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData: ApiResponse = await response.json();
      if (jsonData && jsonData.data) {
        setData(jsonData.data);
        setUpdatedAt(jsonData.updatedAt);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error("Error fetching crowd status data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 補助関数: イベントが現在のフィルター条件に一致するか判定
  const isMatchFiltered = (m: any) => {
    const dateM = (selectedDate.length === 0 || selectedDate.includes(m.date));
    const sportM = (selectedSport.length === 0 || selectedSport.includes(m.sport));
    const matchTitleM = (selectedMatch.length === 0 || selectedMatch.includes(language === "ja" ? m.match : m.match_en));
    const tableM = (selectedTableStatus === "ALL" || parseStatus(m.status.table) === selectedTableStatus);
    const standingM = (selectedStandingStatus === "ALL" || parseStatus(m.status.standing) === selectedStandingStatus);
    
    return dateM && sportM && matchTitleM && tableM && standingM;
  };

  useEffect(() => {
    fetchData();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter Options (各項目間で連動させる)
  const availableRegions = useMemo(() => {
    const options = new Set<string>();
    getFilteredOptionsData("region").forEach(item => options.add(item.region));
    return Array.from(options);
  }, [data, searchQuery, selectedPrefecture, selectedCity, selectedStoreName, selectedDate, selectedSport, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const availablePrefectures = useMemo(() => {
    const options = new Set<string>();
    getFilteredOptionsData("prefecture").forEach(item => options.add(item.prefecture));
    return Array.from(options);
  }, [data, searchQuery, selectedRegion, selectedCity, selectedStoreName, selectedDate, selectedSport, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const availableCities = useMemo(() => {
    const options = new Set<string>();
    getFilteredOptionsData("city").forEach(item => options.add(item.city));
    return Array.from(options);
  }, [data, searchQuery, selectedRegion, selectedPrefecture, selectedStoreName, selectedDate, selectedSport, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const uniqueStoreNames = useMemo(() => {
    const options = new Set<string>();
    getFilteredOptionsData("storeName").forEach((item) => {
      const name = language === "ja" ? item.name : item.name_en;
      if (name) options.add(name);
    });
    return Array.from(options);
  }, [data, searchQuery, selectedRegion, selectedPrefecture, selectedCity, selectedDate, selectedSport, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const availableDates = useMemo(() => {
    const options = new Set<string>();
    getFilteredOptionsData("date").forEach(item => {
      item.matches.forEach(m => options.add(m.date));
    });
    return Array.from(options).sort();
  }, [data, searchQuery, selectedRegion, selectedPrefecture, selectedCity, selectedStoreName, selectedSport, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const availableSports = useMemo(() => {
    const options = new Set<string>();
    getFilteredOptionsData("sport").forEach(item => {
      item.matches.forEach(m => options.add(m.sport));
    });
    return Array.from(options).sort();
  }, [data, searchQuery, selectedRegion, selectedPrefecture, selectedCity, selectedStoreName, selectedDate, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const availableMatches = useMemo(() => {
    const matchMap = new Map<string, string>(); // title -> sortKey (date + time)

    getFilteredOptionsData("match").forEach(item => {
      item.matches.forEach(m => {
        const title = language === "ja" ? m.match : m.match_en;
        if (title) {
          const sortKey = getMatchSortKey(m);
          const currentMin = matchMap.get(title);
          // 同名のカードがある場合、最も早い日時のものをソート基準とする
          if (!currentMin || sortKey < currentMin) {
            matchMap.set(title, sortKey);
          }
        }
      });
    });

    // 日時（sortKey）でソートしてからタイトルのみを抽出
    return Array.from(matchMap.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(entry => entry[0]);
  }, [data, searchQuery, selectedRegion, selectedPrefecture, selectedCity, selectedStoreName, selectedDate, selectedSport, selectedTableStatus, selectedStandingStatus, language]);

  const filteredData = useMemo(() => {
    const isAnyEventFilterSet = selectedDate.length > 0 || selectedSport.length > 0 || selectedMatch.length > 0 || selectedTableStatus !== "ALL" || selectedStandingStatus !== "ALL";

    return data
      .map((item) => {
        // 店舗内のイベントをフィルタリングし、日付・時間順にソートする
        const sortedMatches = [...item.matches]
          .filter(m => isMatchFiltered(m))
          .sort((a, b) => getMatchSortKey(a).localeCompare(getMatchSortKey(b)));

        return { ...item, matches: sortedMatches };
      })
      .filter((item) => {
        // 検索クエリ
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchSearch = item.name.toLowerCase().includes(query) || 
                            (item.name_en?.toLowerCase().includes(query)) || 
                            item.address?.toLowerCase().includes(query);
          if (!matchSearch) return false;
        }

        // 地域フィルター
        if (selectedRegion.length > 0 && !selectedRegion.includes(item.region)) return false;
        if (selectedPrefecture.length > 0 && !selectedPrefecture.includes(item.prefecture)) return false;
        if (selectedCity.length > 0 && !selectedCity.includes(item.city)) return false;
        
        // 店舗名選択
        if (selectedStoreName.length > 0) {
          const name = language === "ja" ? item.name : item.name_en;
          if (!selectedStoreName.includes(name)) return false;
        }

        // 該当するイベントが一つでもあるか
        return item.matches.length > 0;
      });
  }, [data, searchQuery, selectedRegion, selectedPrefecture, selectedCity, selectedStoreName, selectedDate, selectedSport, selectedMatch, selectedTableStatus, selectedStandingStatus, language]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedRegion([]);
    setSelectedPrefecture([]);
    setSelectedCity([]);
    setSelectedStoreName([]);
    setSelectedDate([]);
    setSelectedSport([]);
    setSelectedMatch([]);
    setSelectedTableStatus("ALL");
    setSelectedStandingStatus("ALL");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        language={language} 
        onLanguageChange={setLanguage} 
        lastUpdated={updatedAt}
      />

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <FilterControls
          language={language}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          selectedPrefecture={selectedPrefecture}
          onPrefectureChange={setSelectedPrefecture}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          regions={availableRegions}
          prefectures={availablePrefectures}
          cities={availableCities}
          selectedStoreName={selectedStoreName}
          onStoreNameChange={setSelectedStoreName}
          storeNames={uniqueStoreNames}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          dates={availableDates}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          sports={availableSports}
          selectedMatch={selectedMatch}
          onMatchChange={setSelectedMatch}
          matches={availableMatches}
          selectedTableStatus={selectedTableStatus}
          onTableStatusChange={setSelectedTableStatus}
          selectedStandingStatus={selectedStandingStatus}
          onStandingStatusChange={setSelectedStandingStatus}
          onReset={handleReset}
        />

        <div className="mb-4 px-1 space-y-1 text-[11px] md:text-sm font-medium text-slate-500">
          <p>
            {language === "ja" 
              ? "※店名をクリックすると、公式サイトの店舗詳細ページに移動します。" 
              : "*Clicking on a store name will take you to its official detail page."}
          </p>
          <p>
            {language === "ja" 
              ? "※混雑状況の反映にはお時間がかかる場合がございます。" 
              : "*It may take some time for crowd status updates to be reflected."}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 text-lg font-medium">Loading...</p>
          </div>
        ) : filteredData.length > 0 ? (
          isMobile ? (
            <div className="space-y-4">
              {filteredData.map((item, idx) => (
                <StoreCard key={idx} data={item} language={language} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <StoreTable data={filteredData} language={language} />
            </div>
          )
        ) : (
          <div className="py-20 text-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-400 font-medium">
            {language === "ja" ? "条件に一致する店舗が見つかりませんでした。" : "No stores found."}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
