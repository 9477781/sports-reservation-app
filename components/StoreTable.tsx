
import React, { useMemo } from "react";
import { StoreData, ReservationStatus } from "../types";
import { STATUS_MAP, parseStatus } from "../constants";

interface StoreTableProps {
  data: StoreData[];
  language: "ja" | "en";
}

const StoreTable: React.FC<StoreTableProps> = ({ data, language }) => {
  if (!data || data.length === 0) return null;

  // 表示すべき「列（イベント）」のユニークなリストを作成（日付と対戦カードで識別）
  const visibleMatchKeys = useMemo(() => {
    const keys = new Set<string>();
    data.forEach(store => {
      store.matches.forEach(m => {
        keys.add(`${m.date}_${m.match}`);
      });
    });
    return Array.from(keys);
  }, [data]);

  // 列ヘッダー用のデータを構築
  const headerMatches = useMemo(() => {
    const matches: any[] = [];
    const seen = new Set<string>();
    
    // ヘッダー用の並び替え文字列生成関数
    const getSortKey = (m: any) => {
      const timeRegex = /[(（]([0-9:：]+)[)）]\s*$/;
      const parts = m.match.match(timeRegex);
      const time = parts ? parts[1].replace('：', ':').padStart(5, '0') : "99:99";
      return `${m.date} ${time}`;
    };

    data.forEach(store => {
      store.matches.forEach(m => {
        const key = `${m.date}_${m.match}`;
        if (!seen.has(key)) {
          matches.push(m);
          seen.add(key);
        }
      });
    });

    // 日付と時間の両方でソート
    return matches.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));
  }, [data]);

  const getEventBadgeClass = (sport: string) => {
    const name = sport.toLowerCase();
    if (name.includes("soccer") || name.includes("サッカー")) {
      return "bg-emerald-600 text-white border-emerald-400";
    }
    if (name.includes("baseball") || name.includes("野球")) {
      return "bg-blue-600 text-white border-blue-400";
    }
    if (name.includes("rugby") || name.includes("ラグビー")) {
      return "bg-rose-600 text-white border-rose-400";
    }
    if (name.includes("basket") || name.includes("バスケ") || name.includes("bリーグ")) {
      return "bg-orange-600 text-white border-orange-400";
    }
    return "bg-slate-600 text-slate-100 border-slate-500";
  };

  const getStatusItem = (type: string, rawStatus: string) => {
    const statusKey = parseStatus(rawStatus);
    const config = STATUS_MAP[statusKey];
    
    const textColorClass =
      statusKey === "available"
        ? "text-emerald-600"
        : statusKey === "few"
        ? "text-orange-500"
        : statusKey === "full"
        ? "text-rose-500"
        : "text-slate-300";

    const typeLabel = type === "table" 
      ? (language === "ja" ? "テーブル" : "Table") 
      : (language === "ja" ? "スタンディングエリア" : "Standing Area");

    return (
      <div className={`flex items-center gap-2 font-black ${textColorClass} shrink-0`}>
        <span className="text-[10px] text-slate-400 text-left shrink-0 leading-tight">{typeLabel}：</span>
        <span className="text-3xl leading-none shrink-0">{config.icon}</span>
        <span className="text-[16px] whitespace-nowrap">
          {language === "ja" ? config.label : statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
        </span>
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const dayMapJa = ["日", "月", "火", "水", "木", "金", "土"];
    const dayMapEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    if (language === "ja") {
      return `${m}月${d}日(${dayMapJa[date.getDay()]})`;
    } else {
      return `${m}/${d} (${dayMapEn[date.getDay()]})`;
    }
  };

  return (
    <div className="overflow-auto max-w-full rounded-xl border border-slate-200">
      <table className="border-separate border-spacing-0 table-fixed w-max min-w-full bg-white">
        <thead>
          <tr className="h-[210px]">
            <th className="bg-[#f97316] text-white text-[15px] font-bold p-0 border-r border-b border-white/20 w-[140px] min-w-[140px] max-w-[140px] sticky left-0 top-0 z-40">
              <div className="h-full flex items-center justify-center p-4">
                {language === "ja" ? "エリア" : "Area"}
              </div>
            </th>
            <th className="bg-[#f97316] text-white text-[15px] font-bold p-0 border-r border-b border-white/20 w-[240px] min-w-[240px] max-w-[240px] sticky left-[140px] top-0 z-40">
              <div className="h-full flex items-center justify-center p-4">
                {language === "ja" ? "店名" : "Shop Name"}
              </div>
            </th>
            {headerMatches.map((match, idx) => (
              <th key={idx} className="bg-slate-800 text-white p-0 border-r border-b border-white/10 w-[300px] min-w-[300px] max-w-[300px] sticky top-0 z-20">
                <div className="flex flex-col h-full overflow-hidden">
                  <div className={`p-3 h-[54px] min-h-[54px] flex items-center justify-center text-base font-bold border-b border-white/10 ${
                    match.date.includes("Sun") || match.date.includes("Sat") || formatDate(match.date).includes("日") || formatDate(match.date).includes("土")
                      ? "bg-rose-600" : "bg-slate-700"
                  }`}>
                    {formatDate(match.date)}
                  </div>
                  <div className="p-2 h-[42px] flex items-center justify-center bg-slate-800 border-b border-white/10">
                    <span className={`text-sm px-3 py-1 rounded-full border font-black uppercase tracking-wider ${getEventBadgeClass(match.sport)}`}>
                      {match.sport}
                    </span>
                  </div>
                  <div className="p-4 text-slate-100 flex-1 flex flex-col items-center justify-center leading-tight text-center min-h-[100px]">
                    {(() => {
                      const timeRegex = /(.*)[(（]([0-9:：]+)[)）]\s*$/;
                      const parts = match.match.match(timeRegex);
                      const name = parts ? parts[1].trim() : match.match;
                      const time = parts ? parts[2].trim() : null;

                      if (language === "ja") {
                        return (
                          <>
                            <span className="block text-[16px] font-black">{name}</span>
                            {time && <span className="block text-orange-400 text-[14px] font-black mt-1">{time}</span>}
                            <span className="block text-[10px] opacity-60 font-bold mt-1 uppercase tracking-widest line-clamp-2">{match.match_en}</span>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <span className="block text-[17px] font-black">{match.match_en}</span>
                            {time && <span className="block text-orange-400 text-[14px] font-black mt-1">{time}</span>}
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr 
              key={item.id} 
              className={`group transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-orange-50/30`}
            >
              <td className={`p-5 text-[15px] font-bold text-slate-500 border-r border-b border-slate-200 sticky left-0 z-20 w-[140px] min-w-[140px] max-w-[140px] overflow-hidden ${idx % 2 === 0 ? "bg-white" : "bg-[#fcfdfe]"}`}>
                {language === "ja" ? `${item.prefecture} ${item.city}` : `${item.prefecture_en.split(',')[0]}`}
              </td>
              <td className={`p-5 border-r border-b border-slate-200 sticky left-[140px] z-20 w-[240px] min-w-[240px] max-w-[240px] overflow-hidden ${idx % 2 === 0 ? "bg-white" : "bg-[#fcfdfe]"}`}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors inline-block leading-tight"
                >
                  {language === "ja" ? item.name : item.name_en}
                </a>
              </td>
              {headerMatches.map((hMatch, mIdx) => {
                // この店舗が、ヘッダーに存在するイベントを持っているか探す
                const match = item.matches.find(m => m.date === hMatch.date && m.match === hMatch.match);
                
                if (!match) {
                  return <td key={mIdx} className={`p-3 border-r border-b border-slate-200 bg-slate-50/30 w-[300px] min-w-[300px] max-w-[300px] ${idx % 2 === 0 ? "bg-white" : "bg-[#fcfdfe]"}`}></td>;
                }

                // スタンディングエリアが「未使用」または「未実施」の場合は表示しない
                const isStandingHidden = match.status.standing.includes("未使用") || parseStatus(match.status.standing) === "none";

                return (
                  <td key={mIdx} className={`p-3 border-r border-b border-slate-200 align-middle w-[300px] min-w-[300px] max-w-[300px] ${idx % 2 === 0 ? "bg-white" : "bg-[#fcfdfe]"}`}>
                    <div className="flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-2">
                      {getStatusItem("table", match.status.table)}
                      {!isStandingHidden && getStatusItem("standing", match.status.standing)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;
