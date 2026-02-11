import React, { useState, useEffect, useMemo } from "react";
import { StoreData, ReservationStatus } from "./types";
import { REGION_MAPPING, CITY_MAPPING, REGIONS, STATUS_MAP } from "./constants";
import { getMockStoreData } from "./services/mockData";
import StoreTable from "./components/StoreTable";

const App: React.FC = () => {
  const [data, setData] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("関東");
  const [selectedPrefecture, setSelectedPrefecture] = useState("東京都");
  const [selectedCity, setSelectedCity] = useState("すべて");
  const [selectedStoreName, setSelectedStoreName] = useState("すべて");
  const [selectedDate, setSelectedDate] = useState("すべて");
  const [selectedStatus, setSelectedStatus] = useState<
    ReservationStatus | "すべて"
  >("すべて");

  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // await new Promise(resolve => setTimeout(resolve, 500));
        // const mockData = getMockStoreData();
        const response = await fetch("/data/status.json");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData: StoreData[] = await response.json();
        setData(jsonData);

        if (jsonData.length > 0) {
          setLastUpdated(jsonData[0].updatedAt);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update logic for hierarchical selections
  useEffect(() => {
    const validPrefectures = REGION_MAPPING[selectedRegion] || [];
    if (!validPrefectures.includes(selectedPrefecture)) {
      setSelectedPrefecture("すべて");
    }
  }, [selectedRegion]);

  useEffect(() => {
    setSelectedCity("すべて");
  }, [selectedPrefecture]);

  const uniqueStoreNames = useMemo(() => {
    const names = Array.from(new Set(data.map((item) => item.store.name)));
    return ["すべて", ...names];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.store.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = item.store.region === selectedRegion;
      const matchesPrefecture =
        selectedPrefecture === "すべて" ||
        item.store.prefecture === selectedPrefecture;
      const matchesCity =
        selectedCity === "すべて" || item.store.city === selectedCity;
      const matchesStoreSelect =
        selectedStoreName === "すべて" || item.store.name === selectedStoreName;

      let matchesDateAndStatus = true;
      if (selectedDate === "すべて" && selectedStatus === "すべて") {
        matchesDateAndStatus = true;
      } else if (selectedDate !== "すべて" && selectedStatus === "すべて") {
        matchesDateAndStatus = item.events.some((e) => e.date === selectedDate);
      } else if (selectedDate === "すべて" && selectedStatus !== "すべて") {
        matchesDateAndStatus = item.events.some(
          (e) => e.status === selectedStatus,
        );
      } else {
        matchesDateAndStatus = item.events.some(
          (e) => e.date === selectedDate && e.status === selectedStatus,
        );
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
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("関東");
    setSelectedPrefecture("東京都");
    setSelectedCity("すべて");
    setSelectedStoreName("すべて");
    setSelectedDate("すべて");
    setSelectedStatus("すべて");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans text-[#333]">
      {/* Header Row */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-8 flex justify-between items-baseline">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          予約状況一覧
        </h1>
        <div className="text-xs font-semibold text-slate-400 bg-white/50 px-3 py-1 rounded-full border border-slate-200 shadow-sm">
          最終更新:{" "}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "----/--/-- --:--"}
        </div>
      </div>

      {/* Utility Nav */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4 pb-2 flex justify-center items-center gap-3">
        <button className="flex items-center gap-2 bg-[#1e293b] text-white px-5 py-2 rounded font-bold text-sm hover:bg-[#0f172a] transition-colors shadow-sm">
          公式サイトTOPへ戻る
        </button>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-grow">
        {/* Main Filter Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-6">
            {/* Search and Dropdowns */}
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="flex flex-grow w-full lg:max-w-xl group shadow-sm">
                <input
                  type="text"
                  placeholder="店名・エリアで検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow h-[52px] border border-slate-300 rounded-l-md px-4 text-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={resetFilters}
                  className="h-[52px] bg-[#e2e8f0] text-[#475569] px-5 rounded-r-md font-bold text-sm hover:bg-[#cbd5e1] transition-colors"
                >
                  リセット
                </button>
              </div>

              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-grow lg:w-52">
                  <select
                    value={selectedStoreName}
                    onChange={(e) => setSelectedStoreName(e.target.value)}
                    className="w-full h-[52px] border border-slate-300 rounded px-4 appearance-none cursor-pointer focus:outline-none bg-white font-medium"
                  >
                    <option value="すべて">店名で絞り込み</option>
                    {uniqueStoreNames
                      .filter((n) => n !== "すべて")
                      .map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Region Selection Buttons */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-5 py-2 rounded text-sm font-bold transition-all ${
                      selectedRegion === region
                        ? "bg-[#1e293b] text-white shadow-sm"
                        : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* Prefectures */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(REGION_MAPPING[selectedRegion] || []).map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setSelectedPrefecture(pref)}
                    className={`px-5 py-2 rounded text-sm font-bold transition-all ${
                      selectedPrefecture === pref
                        ? "bg-[#2563eb] text-white ring-2 ring-black ring-inset shadow-md"
                        : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>

              {/* Cities & Note Section */}
              <div className="pt-6 mt-4 border-t border-slate-200">
                {selectedPrefecture !== "すべて" && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      {selectedPrefecture} －
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCity("すべて")}
                        className={`px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                          selectedCity === "すべて"
                            ? "bg-[#1e293b] text-white"
                            : "bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0]"
                        }`}
                      >
                        すべて
                      </button>
                      {(CITY_MAPPING[selectedPrefecture] || []).map((city) => (
                        <button
                          key={city}
                          onClick={() => setSelectedCity(city)}
                          className={`px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                            selectedCity === city
                              ? "bg-[#2563eb] text-white"
                              : "bg-[#f1f5f9] text-[#1e293b] hover:bg-[#e2e8f0]"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informational Note from Screenshot */}
                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl p-5 flex items-start gap-3 mt-6">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-500 text-[10px] font-bold">
                      i
                    </span>
                  </div>
                  <div className="text-[12px] leading-relaxed text-slate-500 font-medium">
                    <p>
                      ※
                      店名をクリックすると、公式サイトの店舗詳細ページに移動します。
                    </p>
                    <p>
                      ※
                      貸切営業やイベント営業、スポーツ放映等により、通常営業時間と異なる場合がございます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Filtering */}
              <div className="pt-8 mt-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  予約状況で絞り込む
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedStatus("すべて")}
                    className={`px-5 py-2 rounded text-sm font-bold border ${
                      selectedStatus === "すべて"
                        ? "bg-[#1e293b] text-white border-[#1e293b]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    すべて
                  </button>
                  {(
                    Object.entries(STATUS_MAP) as [ReservationStatus, any][]
                  ).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStatus(key)}
                      className={`px-4 py-2 rounded text-sm font-bold transition-all flex items-center gap-2 border ${
                        selectedStatus === key
                          ? `bg-white ring-2 ${config.border.replace("border-", "ring-")} ring-offset-1`
                          : `bg-white border-slate-200 opacity-60 hover:opacity-100`
                      }`}
                    >
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-black border ${config.border} ${config.bg} ${config.color}`}
                      >
                        {config.icon}
                      </span>
                      <span className="text-slate-700">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-slate-400 text-sm font-bold">
              データを読み込み中...
            </p>
          </div>
        ) : filteredData.length > 0 ? (
          <StoreTable data={filteredData} />
        ) : (
          <div className="bg-white rounded-lg border border-dashed border-slate-300 py-16 text-center shadow-sm">
            <p className="text-slate-500 font-bold mb-4">
              条件に合う店舗が見つかりませんでした。
            </p>
            <button
              onClick={resetFilters}
              className="text-blue-600 font-bold hover:underline"
            >
              検索条件をリセットする
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
