
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

  useEffect(() => {
    fetchData();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter Options
  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    data.forEach(item => regions.add(item.region));
    return ["ALL", ...Array.from(regions).sort()];
  }, [data]);

  const availablePrefectures = useMemo(() => {
    const prefs = new Set<string>();
    data.forEach(item => {
      if (selectedRegion.length === 0 || selectedRegion.includes(item.region)) {
        prefs.add(item.prefecture);
      }
    });
    return Array.from(prefs).sort();
  }, [data, selectedRegion]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    data.forEach(item => {
      const regionMatch = selectedRegion.length === 0 || selectedRegion.includes(item.region);
      const prefMatch = selectedPrefecture.length === 0 || selectedPrefecture.includes(item.prefecture);
      if (regionMatch && prefMatch) {
         cities.add(item.city);
      }
    });
    return Array.from(cities).sort();
  }, [data, selectedRegion, selectedPrefecture]);

  const uniqueStoreNames = useMemo(() => {
    const names = new Set<string>();
    data.forEach((item) => {
      const regionMatch = selectedRegion.length === 0 || selectedRegion.includes(item.region);
      const prefMatch = selectedPrefecture.length === 0 || selectedPrefecture.includes(item.prefecture);
      const cityMatch = selectedCity.length === 0 || selectedCity.includes(item.city);

      if (regionMatch && prefMatch && cityMatch) {
        const name = language === "ja" ? item.name : item.name_en;
        if (name) names.add(name);
      }
    });
    return Array.from(names).sort();
  }, [data, language, selectedRegion, selectedPrefecture, selectedCity]);

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    data.forEach(item => item.matches.forEach(m => dates.add(m.date)));
    return Array.from(dates).sort();
  }, [data]);

  const availableSports = useMemo(() => {
    const sports = new Set<string>();
    data.forEach(item => item.matches.forEach(m => sports.add(m.sport)));
    return Array.from(sports).sort();
  }, [data]);

  const availableMatches = useMemo(() => {
    const matchTitles = new Set<string>();
    data.forEach(item => item.matches.forEach(m => {
      const title = language === "ja" ? m.match : m.match_en;
      if (title) matchTitles.add(title);
    }));
    return Array.from(matchTitles).sort();
  }, [data, language]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const storeNameJa = item.name.toLowerCase();
      const storeNameEn = item.name_en ? item.name_en.toLowerCase() : "";
      const address = item.address ? item.address.toLowerCase() : "";
      const query = searchQuery.toLowerCase();

      const matchesSearch = !searchQuery || storeNameJa.includes(query) || storeNameEn.includes(query) || address.includes(query);
      const matchesRegion = selectedRegion.length === 0 || selectedRegion.includes(item.region);
      const matchesPrefecture = selectedPrefecture.length === 0 || selectedPrefecture.includes(item.prefecture);
      const matchesCity = selectedCity.length === 0 || selectedCity.includes(item.city);
      const matchesStoreSelect = selectedStoreName.length === 0 || selectedStoreName.includes(language === "ja" ? item.name : item.name_en);

      const matchesDynamic = item.matches.some(m => {
        const dateMatch = selectedDate.length === 0 || selectedDate.includes(m.date);
        const sportMatch = selectedSport.length === 0 || selectedSport.includes(m.sport);
        const matchTitleMatch = selectedMatch.length === 0 || selectedMatch.includes(language === "ja" ? m.match : m.match_en);
        const tableStatusMatch = selectedTableStatus === "ALL" || parseStatus(m.status.table) === selectedTableStatus;
        const standingStatusMatch = selectedStandingStatus === "ALL" || parseStatus(m.status.standing) === selectedStandingStatus;

        return dateMatch && sportMatch && matchTitleMatch && tableStatusMatch && standingStatusMatch;
      });

      return matchesSearch && matchesRegion && matchesPrefecture && matchesCity && matchesStoreSelect && matchesDynamic;
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
          onRegionChange={(val) => {
            setSelectedRegion(val);
            setSelectedPrefecture([]);
            setSelectedCity([]);
          }}
          selectedPrefecture={selectedPrefecture}
          onPrefectureChange={(val) => {
            setSelectedPrefecture(val);
            setSelectedCity([]);
          }}
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
