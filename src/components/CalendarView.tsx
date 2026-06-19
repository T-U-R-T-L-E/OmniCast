import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  Share2, 
  FileVideo, 
  Tag, 
  Sparkles,
  AlertTriangle,
  Layers,
  CheckCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { CrossPost, ConnectedAccount, MediaLibraryItem } from "../types";
import { MediaLibrary } from "./MediaLibrary";

interface CalendarViewProps {
  campaigns: CrossPost[];
  accounts: ConnectedAccount[];
  onAddToast: (msg: string) => void;
  onNavigateToUpload: () => void;
  // Media Library integration props
  libraryItems: MediaLibraryItem[];
  onAddLibraryItem: (item: MediaLibraryItem) => void;
  onRemoveLibraryItem: (id: string) => void;
  platformAttachments: Record<string, MediaLibraryItem | null>;
  setPlatformAttachments: React.Dispatch<React.SetStateAction<Record<string, MediaLibraryItem | null>>>;
  onDeleteCampaign?: (id: string) => void;
}

export function CalendarView({
  campaigns,
  accounts,
  onAddToast,
  onNavigateToUpload,
  libraryItems,
  onAddLibraryItem,
  onRemoveLibraryItem,
  platformAttachments,
  setPlatformAttachments,
  onDeleteCampaign
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 1)); // Default June 2026 (based on system time context)
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());
  
  // Tab within the calendar view for content assignment/arranging
  const [calendarSubTab, setCalendarSubTab] = useState<"calendar" | "library">("calendar");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const offsetDays = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map campaigns to dates for current month
  const getCampaignsForDay = (day: number) => {
    return campaigns.filter(c => {
      if (!c.publishDate) return false;
      try {
        const pDate = new Date(c.publishDate);
        return pDate.getFullYear() === year && pDate.getMonth() === month && pDate.getDate() === day;
      } catch (e) {
        return false;
      }
    });
  };

  const activeDayCampaigns = selectedDate ? getCampaignsForDay(selectedDate) : [];

  return (
    <div className="space-y-6 text-slate-900 text-left animate-fade-in">
      
      {/* View Header with Sub-tabs arranging apps content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span>Content Organizer & Calendar</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Schedule automatic cross-posts, manage media assets, and check local publishing queue calendars.
          </p>
        </div>

        {/* Sub Navigation to toggle views to arrange media library */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setCalendarSubTab("calendar")}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              calendarSubTab === "calendar" 
                ? "bg-white text-indigo-700 shadow-3xs" 
                : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Interactive Calendar
          </button>
          <button
            type="button"
            onClick={() => setCalendarSubTab("library")}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              calendarSubTab === "library"
                ? "bg-white text-indigo-700 shadow-3xs" 
                : "text-slate-500 hover:text-slate-850"
            }`}
          >
            Media Library & Assets
          </button>
        </div>
      </div>

      {calendarSubTab === "calendar" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Calendar Grid Container (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
            
            {/* Month & Year Selection Bar */}
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="text-xs font-mono font-bold text-slate-550">
                CHRONO QUEUE VIEWER
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-extrabold text-slate-900 w-28 text-center uppercase">
                  {monthNames[month]} {year}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty placeholder offset days */}
              {Array.from({ length: offsetDays }).map((_, i) => (
                <div key={`offset-${i}`} className="h-16 bg-slate-25/40 border border-slate-100 rounded-lg opacity-40" />
              ))}

              {/* Month dates */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                const dayCampaigns = getCampaignsForDay(day);

                return (
                  <button
                    key={`day-${day}`}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`h-16 border rounded-lg p-1 text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-50/15 ring-2 ring-indigo-50/50" 
                        : isToday
                        ? "border-amber-400 bg-amber-50/10"
                        : "border-slate-150 hover:border-slate-350 bg-white"
                    }`}
                  >
                    {/* Date digit */}
                    <span className={`text-[10px] font-extrabold leading-none ${
                      isSelected 
                        ? "text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md font-mono" 
                        : "text-slate-600"
                    }`}>
                      {day}
                    </span>

                    {/* Miniature Campaign Badges */}
                    <div className="space-y-0.5 w-full mt-1 overflow-hidden">
                      {dayCampaigns.slice(0, 2).map((camp) => (
                        <div 
                          key={camp.id} 
                          title={`${camp.title} (${camp.status})`}
                          className={`text-[8px] font-bold px-1 rounded truncate leading-tight flex items-center gap-0.5 ${
                            camp.status === "published" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : camp.status === "queued" 
                              ? "bg-blue-50 text-blue-700 border border-blue-100" 
                              : camp.status === "failed"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-slate-50 text-slate-600 border border-slate-100"
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${
                            camp.status === "published" ? "bg-emerald-500" : camp.status === "queued" ? "bg-blue-500" : "bg-slate-450"
                          }`} />
                          {camp.title}
                        </div>
                      ))}
                      {dayCampaigns.length > 2 && (
                        <div className="text-[7.5px] font-black text-slate-400 pl-1">
                          +{dayCampaigns.length - 2} more...
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Small Legend */}
            <div className="flex gap-4 pt-2 border-t border-slate-100 text-[10px] font-mono uppercase font-extrabold text-slate-400 justify-center">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Queued</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Published</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Draft</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Failed</span>
              </span>
            </div>

          </div>

          {/* Day Activities & Reschedule Dashboard Sidepanel (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-3xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[9px] font-bold font-mono text-indigo-650 uppercase">
                  SLOT ASSISTANT
                </span>
                <h3 className="text-sm font-black text-slate-800">
                  {selectedDate ? `${monthNames[month]} ${selectedDate}, ${year}` : "Select a Scheduled Slot"}
                </h3>
              </div>

              {activeDayCampaigns.length === 0 ? (
                <div className="text-center py-8 space-y-3 bg-slate-25 rounded-xl border border-dashed border-slate-200">
                  <Clock className="w-6 h-6 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-450 font-bold leading-relaxed max-w-xs mx-auto">
                    No active distribution scheduled for this space.
                  </p>
                  <button
                    type="button"
                    onClick={onNavigateToUpload}
                    className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-heavy text-[9.5px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Schedule an upload
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activeDayCampaigns.map((camp) => (
                    <div 
                      key={camp.id} 
                      className="border border-slate-205 bg-white hover:border-slate-350 transition-colors p-4 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-xs font-black text-slate-850 truncate max-w-[200px]">
                            {camp.title}
                          </h4>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            camp.status === "published" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : camp.status === "queued" 
                              ? "bg-blue-50 text-blue-700 border border-blue-100" 
                              : "bg-slate-50 text-slate-600 border border-slate-100"
                          }`}>
                            {camp.status}
                          </span>
                        </div>

                        {onDeleteCampaign && (
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteCampaign(camp.id);
                              onAddToast("Campaign slot removed.");
                            }}
                            className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Remove Slot"
                          >
                            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] font-semibold text-slate-500 leading-relaxed line-clamp-2">
                        {camp.description}
                      </p>

                      {/* Targeted platform badges */}
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9px] font-bold text-slate-400">Channels:</span>
                        {Object.entries(camp.platforms).map(([plat, isSel]) => {
                          if (!isSel) return null;
                          return (
                            <span 
                              key={plat} 
                              className="text-[8px] font-mono font-bold uppercase bg-slate-100 border border-slate-200 text-slate-650 px-1 py-0.2 rounded"
                            >
                              {plat}
                            </span>
                          );
                        })}
                      </div>

                      {/* Display thumbnail preview if any */}
                      {camp.thumbnailUrl && (
                        <div className="flex gap-2.5 items-center p-2 bg-slate-50 border border-slate-100 rounded-lg">
                          <img 
                            src={camp.thumbnailUrl} 
                            alt={camp.title} 
                            className="w-8 h-8 object-cover rounded border border-slate-200" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-600 font-bold block truncate">{camp.videoName || "Attached_Clip.mp4"}</span>
                            <span className="text-[9px] text-slate-400 font-medium block leading-none">{camp.videoSize || "0.0 MB"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* General Queue Statistics Card assigned here */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-3xs space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Chronological Buffer Stats
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">Total Broadcasts</span>
                  <span className="text-lg font-black font-mono text-white">{campaigns.length}</span>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block">Scheduled Slots</span>
                  <span className="text-lg font-black font-mono text-indigo-400">
                    {campaigns.filter(c => c.status === "queued").length}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold pt-1">
                All scheduled intervals run under server-side cron loops. We push events exactly at the targeted clock cycle with 4.5% precision tolerance limits.
              </p>
            </div>

          </div>

        </div>
      ) : (
        /* Render Assigned Media Library directly when tab is selected */
        <div className="bg-white border border-slate-205 rounded-2xl p-5 sm:p-6 shadow-3xs text-left">
          <MediaLibrary
            accounts={accounts}
            attachments={platformAttachments}
            onUpdateAttachments={setPlatformAttachments}
            libraryItems={libraryItems}
            onAddLibraryItem={onAddLibraryItem}
            onRemoveLibraryItem={onRemoveLibraryItem}
          />
        </div>
      )}

    </div>
  );
}
