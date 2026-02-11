
import React from 'react';
import { StoreData, ReservationStatus } from '../types';
import { STATUS_MAP } from '../constants';

interface StoreTableProps {
  data: StoreData[];
  language: 'ja' | 'en';
}

const StoreTable: React.FC<StoreTableProps> = ({ data, language }) => {
  if (data.length === 0) return null;

  // Use the event data from the first store to build the headers
  const eventHeaders = data[0].events;

  const getDayColorClass = (dateStr: string) => {
    if (dateStr.includes('(土)') || dateStr.includes('Sat')) return 'bg-[#2563eb]'; // Blue for Sat
    if (dateStr.includes('(日)') || dateStr.includes('Sun') || dateStr.includes('(祝)')) return 'bg-[#e11d48]'; // Red for Sun/Holiday
    return 'bg-[#f97316]'; // Orange default
  };

  const getStatusDisplay = (status: ReservationStatus) => {
    const config = STATUS_MAP[status];
    
    // Text colors refined for readability against background tints
    let textColorClass = 'text-slate-800';
    if (status === 'full' || status === 'none') {
      textColorClass = 'text-[#e11d48]';
    } else if (status === 'few') {
      textColorClass = 'text-amber-700';
    } else if (status === 'available') {
      textColorClass = 'text-green-700';
    }

    return (
      <div className={`flex flex-col items-center justify-center gap-0.5 font-bold ${textColorClass}`}>
        <span className="text-[18px] leading-none">{config.icon}</span>
        <span className="text-[10px] whitespace-nowrap">
          {language === 'ja' ? config.label : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto shadow-md rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          {/* Row 1: Dates */}
          <tr>
            <th className="bg-[#f97316] text-white text-[13px] font-bold p-3 border-r border-white/20 w-32 sticky left-0 z-20">
              {language === 'ja' ? 'エリア' : 'Area'}
            </th>
            <th className="bg-[#f97316] text-white text-[13px] font-bold p-3 border-r border-white/20 sticky left-32 z-20">
              {language === 'ja' ? '店名' : 'Shop Name'}
            </th>
            {eventHeaders.map((event, idx) => (
              <th 
                key={idx} 
                className={`${getDayColorClass(event.date)} text-white text-[15px] font-bold p-3 text-center border-r border-white/20`}
              >
                {event.date}
              </th>
            ))}
          </tr>
          
          {/* Row 2: Event Name (Pill Style) */}
          <tr className="bg-[#1e293b] border-b border-white/10">
            <th className="sticky left-0 bg-[#1e293b] border-r border-white/10 h-10 z-20"></th>
            <th className="sticky left-32 bg-[#1e293b] border-r border-white/10 h-10 z-20"></th>
            {eventHeaders.map((event, idx) => (
              <th key={idx} className="p-1.5 text-center border-r border-white/10">
                <div className="inline-block bg-red-100/10 text-white/90 text-[10px] font-bold px-3 py-0.5 rounded-full border border-white/20 whitespace-nowrap uppercase tracking-tighter">
                  {event.eventName}
                </div>
              </th>
            ))}
          </tr>

          {/* Row 3: Match-up Info */}
          <tr className="bg-white border-b border-slate-200">
            <th className="sticky left-0 bg-white border-r border-slate-200 z-20"></th>
            <th className="sticky left-32 bg-white border-r border-slate-200 z-20"></th>
            {eventHeaders.map((event, idx) => (
              <th key={idx} className="p-3 text-center border-r border-slate-200">
                <div className="text-[12px] font-bold text-slate-800 leading-tight min-h-[2.5em] flex items-center justify-center">
                  {event.matchUp}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, storeIdx) => (
            <tr 
              key={item.store.id} 
              className="border-b border-slate-100 hover:brightness-[0.98] transition-all"
            >
              <td className="p-3 text-[12px] font-bold text-slate-400 border-r border-slate-100 sticky left-0 bg-white z-10">
                {language === 'ja' ? `${item.store.prefecture} ${item.store.city}` : item.store.prefecture_en}
              </td>
              <td className="p-3 border-r border-slate-100 sticky left-32 bg-white z-10">
                <a 
                  href={item.store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[14px] font-bold text-slate-800 hover:text-blue-600 transition-all inline-block"
                >
                  {language === 'ja' ? item.store.name : item.store.name_en}
                </a>
              </td>
              {item.events.map((event, eventIdx) => {
                const config = STATUS_MAP[event.status];
                return (
                  <td 
                    key={eventIdx} 
                    className={`p-2 text-center border-r border-slate-100 transition-colors ${config.bg}`}
                  >
                    {getStatusDisplay(event.status)}
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
