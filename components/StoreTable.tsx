import React from "react";
import { StoreData, ReservationStatus } from "../types";
import { STATUS_MAP } from "../constants";

interface StoreTableProps {
  data: StoreData[];
  language: "ja" | "en";
}

const StoreTable: React.FC<StoreTableProps> = ({ data, language }) => {
  if (!data || data.length === 0) return null;

  // 全てのイベントの日付、イベント名、対戦カードを抽出
  const allEvents = data[0].events;

  const getStatusDisplay = (status: ReservationStatus) => {
    const config = STATUS_MAP[status];
    const textColorClass =
      status === "available"
        ? "text-emerald-600"
        : status === "few"
        ? "text-orange-500"
        : status === "full"
        ? "text-rose-500"
        : "text-slate-300";

    return (
      <div className={`flex flex-col items-center justify-center gap-0.5 font-bold ${textColorClass}`}>
        <span className="text-[18px] leading-none">{config.icon}</span>
        <span className="text-[10px] whitespace-nowrap">
          {language === "ja" ? config.label : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  // 日付のフォーマットを整形する関数
  const formatDate = (dateStr: string) => {
    if (language === "en") return dateStr; // 英語モードはそのまま
    try {
      // GASからの形式(Tue Mar 03 2026...)から日付を抽出
      const dateParts = dateStr.match(/([a-zA-Z]+)\s+([a-zA-Z]+)\s+(\d+)\s+(\d+)/);
      if (dateParts) {
        const monthMap: { [key: string]: string } = {
          Jan: "1", Feb: "2", Mar: "3", Apr: "4", May: "5", Jun: "6",
          Jul: "7", Aug: "8", Sep: "9", Oct: "10", Nov: "11", Dec: "12"
        };
        const dayMap: { [key: string]: string } = {
          Sun: "日", Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土"
        };
        const month = monthMap[dateParts[2]];
        const day = dateParts[3];
        const dayOfWeek = dayMap[dateParts[1]];
        return `${month}月${day}日(${dayOfWeek})`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-[#f97316] text-white text-[13px] font-bold p-3 border-r border-white/20 w-32 sticky left-0 z-20">
              {language === "ja" ? "エリア" : "Area"}
            </th>
            <th className="bg-[#f97316] text-white text-[13px] font-bold p-3 border-r border-white/20 min-w-[200px] sticky left-32 z-20">
              {language === "ja" ? "店名" : "Shop Name"}
            </th>
            {allEvents.map((event, idx) => (
              <th key={idx} className="bg-slate-800 text-white p-0 border-r border-white/10 min-w-[140px]">
                <div className="flex flex-col h-full">
                  <div className={`p-2 text-[12px] font-bold border-b border-white/10 ${
                    event.date.includes("Sun") || event.date.includes("Sat") || event.date.includes("日") || event.date.includes("土")
                      ? "bg-rose-600" : "bg-slate-700"
                  }`}>
                    {formatDate(event.date)}
                  </div>
                  <div className="p-1 bg-slate-800">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold uppercase tracking-wider">
                      {event.eventName}
                    </span>
                  </div>
                  <div className="p-2 text-[11px] font-bold text-slate-100 min-h-[40px] flex items-center justify-center leading-tight">
                    {event.matchUp}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.store.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
              <td className="p-3 text-[12px] font-bold text-slate-500 border-r border-slate-100 sticky left-0 bg-inherit z-10">
                {language === "ja" ? `${item.store.prefecture} ${item.store.city}` : item.store.prefecture_en}
              </td>
              <td className="p-3 border-r border-slate-100 sticky left-32 bg-inherit z-10">
                <a
                  href={item.store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-bold text-slate-800 hover:text-blue-600 transition-all inline-block"
                >
                  {language === "ja" ? item.store.name : item.store.name_en}
                </a>
              </td>
              {item.events.map((event, eIdx) => (
                <td key={eIdx} className="p-3 border-r border-slate-100 text-center">
                  {getStatusDisplay(event.status)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;
