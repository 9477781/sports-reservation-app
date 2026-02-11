import React, { useState, useEffect, useMemo } from "react";
import { StoreData, ReservationStatus } from "./types";
import { REGION_MAPPING, CITY_MAPPING, REGIONS, STATUS_MAP } from "./constants";
import Header from "./components/Header";
import FilterControls from "./components/FilterControls";
import StoreTable from "./components/StoreTable";

const App: React.FC = () => {
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const [data, setData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("関東");
  const [selectedPrefecture, setSelectedPrefecture] = useState("東京都");
  const [selectedCity, setSelectedCity] = useState("すべて");
  const [selectedStoreName, setSelectedStoreName] = useState("すべて");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | "すべて">(
    "すべて"
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/data/status.json");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uniqueStoreNames = useMemo(() => {
    const names = new Set<string>();
    data.forEach((item) => {
      const name = language === "ja" ? item.store.name : item.store.name_en;
      if (name) names.add(name);
    });
    return [language === "ja" ? "すべて" : "All", ...Array.from(names).sort()];
  }, [data, language]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const name = language === "ja" ? item.store.name : item.store.name_en;
      const address = item.store.address;

      const matchesSearch =
        !searchQuery ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === (language === "ja" ? "すべて" : "All") ||
        item.store.region === selectedRegion;

      const matchesPrefecture =
        selectedPrefecture === (language === "ja" ? "すべて" : "All") ||
        item.store.prefecture === selectedPrefecture;

      const matchesCity =
        selectedCity === (language === "ja" ? "すべて" : "All") ||
        item.store.city === selectedCity;

      const matchesStoreSelect =
        selectedStoreName === (language === "ja" ? "すべて" : "All") ||
        name === selectedStoreName;

      let matchesDateAndStatus = true;
      if (selectedDate || selectedStatus !== "すべて") {
        matchesDateAndStatus = item.events.some((event) => {
          const dateMatch = !selectedDate || event.date === selectedDate;
          const statusMatch =
            selectedStatus === "すべて" || event.status === selectedStatus;
          return dateMatch && statusMatch;
        });
      }

      return (
        matchesSearch &&
        matchesRegion &&
        matchesPrefecture &&
        matchesCity &&
        matchesStoreSelect &&
        matchesDateAndStatus
      );
    });
  }, [
    data,
    searchQuery,
    selectedRegion,
    selectedPrefecture,
    selectedCity,
    selectedStoreName,
    selectedDate,
    selectedStatus,
    language,
  ]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedRegion(language === "ja" ? "すべて" : "All");
    setSelectedPrefecture(language === "ja" ? "すべて" : "All");
    setSelectedCity(language === "ja" ? "すべて" : "All");
    setSelectedStoreName(language === "ja" ? "すべて" : "All");
    setSelectedDate(null);
    setSelectedStatus("すべて");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        language={language} 
        onLanguageChange={setLanguage} 
        lastUpdated={data.length > 0 ? data[0].updatedAt : undefined}
      />

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <FilterControls
          language={language}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onRegionChange={(val) => {
            setSelectedRegion(val);
            setSelectedPrefecture(language === "ja" ? "すべて" : "All");
            setSelectedCity(language === "ja" ? "すべて" : "All");
          }}
          selectedPrefecture={selectedPrefecture}
          onPrefectureChange={(val) => {
            setSelectedPrefecture(val);
            setSelectedCity(language === "ja" ? "すべて" : "All");
          }}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          selectedStoreName={selectedStoreName}
          onStoreNameChange={setSelectedStoreName}
          storeNames={uniqueStoreNames}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onReset={handleReset}
        />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">
                {language === "ja" ? "データを読み込み中..." : "Loading status..."}
              </p>
            </div>
          ) : filteredData.length > 0 ? (
            <StoreTable data={filteredData} language={language} />
          ) : (
            <div className="py-20 text-center text-slate-500 font-medium">
              {language === "ja" ? "条件に一致する店舗が見つかりませんでした。" : "No stores found matching your criteria."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
