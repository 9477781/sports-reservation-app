
import React from "react";

interface HeaderProps {
  language: "ja" | "en";
  onLanguageChange: (lang: "ja" | "en") => void;
  lastUpdated?: string;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, lastUpdated }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 py-3 lg:h-16 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Row 1: Title and Updated Time (Always 1 row) */}
        <div className="flex items-center justify-between lg:justify-start gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-lg lg:text-2xl font-bold tracking-tight whitespace-nowrap">
              {language === "ja" ? "スポーツイベント混雑状況" : "Sports Event Crowd Status"}
            </h1>
          </div>
          {lastUpdated && (
            <p className="text-[9px] lg:text-xs text-slate-400 font-medium whitespace-nowrap text-right">
              {language === "ja" ? "更新日時" : "Updated"}: {new Date(lastUpdated).toLocaleString(language === "ja" ? "ja-JP" : "en-US", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* Row 2: Link and Language Switcher (Always 1 row) */}
        <div className="flex items-center justify-between lg:justify-end gap-2 w-full lg:w-auto overflow-hidden">
          <a
            href="https://www.pub-hub.com/index.php/event/sports"
            className="flex items-center gap-1 px-2 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[9px] lg:text-sm font-bold rounded-lg transition-all border border-slate-700 shadow-sm flex-grow lg:flex-grow-0 truncate"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="truncate">{language === "ja" ? "公式スポーツイベントTOPに戻る" : "Back to Sports Events TOP"}</span>
          </a>

          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 shrink-0">
            <button
              onClick={() => onLanguageChange("ja")}
              className={`px-3 py-1 text-[11px] lg:text-sm font-bold rounded-md transition-all ${
                language === "ja" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              日本語
            </button>
            <button
              onClick={() => onLanguageChange("en")}
              className={`px-3 py-1 text-[11px] lg:text-sm font-bold rounded-md transition-all ${
                language === "en" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
