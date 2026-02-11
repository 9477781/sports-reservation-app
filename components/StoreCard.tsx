
import React from 'react';
import { StoreData } from '../types';
import { STATUS_MAP } from '../constants';

interface StoreCardProps {
  data: StoreData;
}

const StoreCard: React.FC<StoreCardProps> = ({ data }) => {
  const { store, events } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/30">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 group">
                <a 
                  href={store.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                >
                  {store.name}
                </a>
              </h3>
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium border-l border-slate-200 pl-3 hidden sm:inline">
                  {store.name_en}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {store.prefecture}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  {store.city}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right shrink-0">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest block mb-1">STATUS SUMMARY</span>
            <div className="flex gap-1 justify-end">
               {events.map((e, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${STATUS_MAP[e.status].bg.replace('bg-', 'bg-opacity-100 bg-').replace('-50', '-500')}`} />
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Body - Events Grid */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event, index) => {
            const config = STATUS_MAP[event.status];
            return (
              <div 
                key={index} 
                className={`flex flex-col p-4 rounded-lg border ${config.border} ${config.bg} transition-all hover:shadow-sm`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-600">{event.date}</span>
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${config.color} bg-white px-2 py-1 rounded shadow-sm border border-slate-100`}>
                    <span className="text-xs">{config.icon}</span> {config.label}
                  </span>
                </div>
                <div className="flex-grow space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{event.eventName}</div>
                  <div className="text-sm font-bold text-slate-800 leading-tight">
                    {event.matchUp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
