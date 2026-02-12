
import React from 'react';
import { StoreData } from '../types';
import { STATUS_MAP, parseStatus } from '../constants';

interface StoreCardProps {
  data: StoreData;
  language: 'ja' | 'en';
}

const StoreCard: React.FC<StoreCardProps> = ({ data, language }) => {
  const { matches } = data;

  const getDayColorClass = (dateStr: string) => {
    if (dateStr.includes('(Sat)') || dateStr.includes('(土)')) return 'text-blue-600';
    if (dateStr.includes('(Sun)') || dateStr.includes('(日)')) return 'text-red-600';
    return 'text-slate-600';
  };

  const getStatusInfo = (rawStatus: string) => {
    const statusKey = parseStatus(rawStatus);
    return {
      key: statusKey,
      config: STATUS_MAP[statusKey]
    };
  };

  // 代表的なステータスで背景色を決める（テーブル席優先）
  const getRowBgClass = (tableStatus: string) => {
    const key = parseStatus(tableStatus);
    switch (key) {
      case 'available': return 'bg-emerald-50/30';
      case 'few': return 'bg-orange-50/30';
      case 'full': return 'bg-rose-50/30';
      default: return 'bg-white';
    }
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-slate-200 overflow-hidden mb-5">
      {/* Card Header */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start">
          <span className="px-3 py-1 bg-slate-400 text-white text-[11px] font-bold rounded-md">
            {language === 'ja' ? `${data.prefecture} ${data.city}` : data.prefecture_en || data.prefecture}
          </span>
        </div>
        <h3 className="text-[20px] font-black text-slate-800 tracking-tight">
          <a href={data.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
            {language === 'ja' ? data.name : data.name_en}
          </a>
        </h3>
      </div>

      {/* Events List */}
      <div className="border-t border-slate-100">
        {matches && matches.map((match, idx) => {
          const tableStatus = getStatusInfo(match.status.table);
          const standingStatus = getStatusInfo(match.status.standing);
          
          const dateObj = new Date(match.date);
          const dayMap = language === 'ja' ? ['日', '月', '火', '水', '木', '金', '土'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayStr = dayMap[dateObj.getDay()];
          const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}(${dayStr})`;

          const isStandingUnused = match.status.standing.includes("未使用");

          return (
            <div key={`${match.date}-${match.match}`} className={`flex flex-col px-4 py-4 border-b border-slate-100 last:border-b-0 ${getRowBgClass(match.status.table)}`}>
              {/* Top Row: Date and Match Info */}
              <div className="flex items-start">
                {/* Date */}
                <div className={`w-18 shrink-0 text-[15px] font-bold mt-1 ${getDayColorClass(`(${dayStr})`)}`}>
                  {formattedDate}
                </div>

                {/* Match Up */}
                <div className="flex-grow flex flex-col gap-1 px-2 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="shrink-0 scale-90 px-2 py-0.5 bg-[#1e293b] text-white text-[9px] font-black rounded tracking-tighter uppercase">
                      {match.sport}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-700 leading-tight">
                    {language === 'ja' ? match.match : match.match_en}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Status Indicator (One line underneath) */}
              <div className="w-full mt-3 pt-2 border-t border-slate-50 flex items-center justify-start gap-4 text-[10px] font-black overflow-hidden">
                 {/* Table */}
                 <div className={`flex items-center gap-1.5 ${tableStatus.config.color.split(' ')[0]}`}>
                   <span className="text-slate-400 font-bold">{language === 'ja' ? 'テーブル' : 'Table'}</span>
                   <span className="text-xl leading-none shrink-0">{tableStatus.config.icon}</span>
                   <span className="whitespace-nowrap">
                     {language === 'ja' ? tableStatus.config.label : tableStatus.key.charAt(0).toUpperCase() + tableStatus.key.slice(1)}
                   </span>
                 </div>
                 {/* Standing Area */}
                 {!isStandingUnused && (
                   <div className={`flex items-center gap-1.5 ${standingStatus.config.color.split(' ')[0]}`}>
                     <span className="text-slate-400 font-bold">{language === 'ja' ? 'スタンディングエリア' : 'Area'}</span>
                     <span className="text-xl leading-none shrink-0">{standingStatus.config.icon}</span>
                     <span className="whitespace-nowrap">
                       {language === 'ja' ? standingStatus.config.label : standingStatus.key.charAt(0).toUpperCase() + standingStatus.key.slice(1)}
                     </span>
                   </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreCard;
