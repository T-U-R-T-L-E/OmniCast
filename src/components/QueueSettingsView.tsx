import React, { useState } from "react";
import { Clock, Plus, Trash2, RefreshCw, Calendar, ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";

interface QueueSettingsProps {
  onAddToast: (msg: string) => void;
  onBackToProfile?: () => void;
}

interface PostingTime {
  id: string;
  hour: string;
  minute: string;
}

export function QueueSettingsView({ onAddToast, onBackToProfile }: QueueSettingsProps) {
  const [profile, setProfile] = useState("profile");
  const [timezone, setTimezone] = useState("Eastern Time (ET)");
  const [activeDays, setActiveDays] = useState<string[]>([
    "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"
  ]);
  const [maxPosts, setMaxPosts] = useState("1");
  const [postingTimes, setPostingTimes] = useState<PostingTime[]>([
    { id: "1", hour: "09", minute: "00" },
    { id: "2", hour: "12", minute: "00" },
    { id: "3", hour: "17", minute: "00" },
  ]);

  const [isPreviewRefreshing, setIsPreviewRefreshing] = useState(false);

  const toggleDay = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddSlot = () => {
    const nextId = String(Date.now());
    setPostingTimes(prev => [...prev, { id: nextId, hour: "10", minute: "00" }]);
    onAddToast("New posting slot added.");
  };

  const handleRemoveSlot = (id: string) => {
    if (postingTimes.length <= 1) {
      onAddToast("You must keep at least one posting slot.");
      return;
    }
    setPostingTimes(prev => prev.filter(t => t.id !== id));
    onAddToast("Posting slot removed.");
  };

  const handleTimeChange = (id: string, field: "hour" | "minute", value: string) => {
    setPostingTimes(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSaveSettings = () => {
    onAddToast("Queue settings saved successfully!");
  };

  const handleRefreshPreview = () => {
    setIsPreviewRefreshing(true);
    setTimeout(() => {
      setIsPreviewRefreshing(false);
      onAddToast("Queue preview dates refreshed and calculated.");
    }, 605);
  };

  // Pre-calculated slots for Queue preview based on image design
  const previewSlots = [
    { id: 1, date: "Fri, Jun 19, 4:00 PM", original: "Fri, Jun 19, 4:00 PM (EDT)" },
    { id: 2, date: "Fri, Jun 19, 7:00 PM", original: "Fri, Jun 19, 7:00 PM (EDT)" },
    { id: 3, date: "Sat, Jun 20, 12:00 AM", original: "Sat, Jun 20, 12:00 AM (EDT)" },
    { id: 4, date: "Sat, Jun 20, 4:00 PM", original: "Sat, Jun 20, 4:00 PM (EDT)" },
    { id: 5, date: "Sat, Jun 20, 7:00 PM", original: "Sat, Jun 20, 7:00 PM (EDT)" },
    { id: 6, date: "Sun, Jun 21, 12:00 AM", original: "Sun, Jun 21, 12:00 AM (EDT)" },
    { id: 7, date: "Sun, Jun 21, 4:00 PM", original: "Sun, Jun 21, 4:00 PM (EDT)" },
    { id: 8, date: "Sun, Jun 21, 7:00 PM", original: "Sun, Jun 21, 7:00 PM (EDT)" },
    { id: 9, date: "Mon, Jun 22, 12:00 AM", original: "Mon, Jun 22, 12:00 AM (EDT)" },
    { id: 10, date: "Mon, Jun 22, 4:00 PM", original: "Mon, Jun 22, 4:00 PM (EDT)" }
  ];

  return (
    <div id="queue-settings-view" className="max-w-6xl mx-auto space-y-6 pt-2 pb-12 animate-fade-in text-left">
      {onBackToProfile && (
        <button 
          onClick={onBackToProfile}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to profile
        </button>
      )}

      {/* Title & Description Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Queue Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
          Customize your posting schedule. The queue is always active with default times (9am, 12pm, 5pm ET). Posts added to the queue will automatically be scheduled to your next available slot.
        </p>
      </div>

      {/* Active Profile Selection Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded uppercase tracking-wider">
            Active Profile
          </span>
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Configuring queue for</h2>
          <p className="text-xs text-slate-400 font-medium">Each profile has its own queue settings.</p>
        </div>
        <div className="relative w-full sm:w-48">
          <select 
            value={profile} 
            onChange={(e) => setProfile(e.target.value)}
            className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="profile">profile</option>
            <option value="business">business</option>
            <option value="creator">creator</option>
          </select>
          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-405 pointer-events-none" />
        </div>
      </div>

      {/* Config & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Box: Configuration Column */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
          <h3 className="text-sm font-black text-slate-800 tracking-wide border-b border-slate-100 pb-3">
            Configuration
          </h3>

          {/* Timezone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-650">Timezone</label>
            <select 
              value={timezone} 
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-705 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Eastern Time (ET)">Eastern Time (ET)</option>
              <option value="Universal Time Coordinated (UTC)">Universal Time Coordinated (UTC)</option>
              <option value="Pacific Time (PT)">Pacific Time (PT)</option>
              <option value="Central European Time (CET)">Central European Time (CET)</option>
            </select>
          </div>

          {/* Active Days */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-650">Active Days</label>
            <div className="flex flex-wrap gap-1.5">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(day => {
                const isActive = activeDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    type="button"
                    className={`px-3 py-2 font-mono text-xs font-extrabold rounded-lg transition-all border ${
                      isActive 
                        ? "bg-indigo-600 border-indigo-650 text-white shadow-xs" 
                        : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max posts per slot */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-650">Max posts per slot</label>
            <p className="text-[10px] text-slate-400">How many posts can be scheduled per time slot</p>
            <input 
              type="number"
              min="1"
              max="10"
              value={maxPosts}
              onChange={(e) => setMaxPosts(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Posting Times */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-650">Posting Times</label>
              <button 
                type="button"
                onClick={handleAddSlot}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-850 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Close
                Add slot
              </button>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {postingTimes.map((slot) => {
                // Calculate local equivalent text nicely for design completeness
                const localDiff = timezone.includes("ET") ? -5 : 0;
                let convertedHour = (parseInt(slot.hour, 10) + localDiff + 24) % 24;
                const convertedString = String(convertedHour).padStart(2, "0");
                
                return (
                  <div key={slot.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 border border-slate-150 p-2 rounded-xl">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 px-1.5 shrink-0">
                      <select 
                        value={slot.hour}
                        onChange={(e) => handleTimeChange(slot.id, "hour", e.target.value)}
                        className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 24 }).map((_, h) => {
                          const val = String(h).padStart(2, "0");
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>
                      <span className="text-slate-400 text-xs font-bold">:</span>
                      <select 
                        value={slot.minute}
                        onChange={(e) => handleTimeChange(slot.id, "minute", e.target.value)}
                        className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                      >
                        {["00", "15", "30", "45"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-[10px] text-blue-600 font-mono font-bold bg-blue-50/50 border border-blue-105 px-2 py-0.5 rounded-lg flex-1 text-center min-w-[90px] truncate">
                      ≈ {convertedString}:{slot.minute} local
                    </div>

                    <button 
                      type="button" 
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[10px] text-slate-400 leading-snug">
              Your browser timezone: <span className="font-semibold text-slate-600">GMT+3</span>
              <br />
              Posts will be scheduled to these times in your selected timezone.
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2 border-t border-slate-50">
            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors uppercase tracking-wider cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Right Box: Queue Preview Column */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">
              Queue Preview
            </h3>
            <button
              onClick={handleRefreshPreview}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPreviewRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Timezone alert */}
          <div className="bg-sky-50 text-sky-700 border border-sky-100 p-2 px-3 rounded-lg text-[11px] font-semibold">
            Showing times in your local timezone <span className="font-bold font-mono text-[10px] bg-sky-100 px-1.5 py-0.5 rounded">(GMT+3)</span>
          </div>

          {/* Preview Slots List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {previewSlots.map((slot) => (
              <div 
                key={slot.id} 
                className="flex items-center justify-between border border-emerald-100 bg-emerald-50/20 px-3.5 py-2 rounded-xl hover:bg-emerald-50/40 transition-colors"
              >
                <div className="space-y-0.5 text-left">
                  <div className="text-xs font-bold text-slate-800 leading-none">
                    {slot.date}
                  </div>
                  <div className="text-[10px] text-slate-455 font-mono">
                    {slot.original}
                  </div>
                </div>

                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-extrabold uppercase rounded font-mono">
                  Available
                </span>
              </div>
            ))}
          </div>

          {/* Next slot box */}
          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
            <span className="text-[9px] text-indigo-650 font-black block uppercase tracking-widest leading-none">
              Next Available Slot
            </span>
            <div className="text-sm font-black text-slate-800">
              Fri, Jun 19, 4:00 PM
            </div>
            <p className="text-[10px] text-slate-400">Your local time</p>
          </div>
        </div>

      </div>

      {/* Bottom Information Block: How the Queue Works */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
          How the Queue Works
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50/30 border border-slate-150 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 font-extrabold text-xs flex items-center justify-center">
              1
            </div>
            <h5 className="text-xs font-extrabold text-slate-800">Customize Your Schedule</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              The queue uses default times (9am, 12pm, 5pm ET). Customize them here if you want different times.
            </p>
          </div>

          <div className="bg-slate-50/30 border border-slate-150 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 font-extrabold text-xs flex items-center justify-center">
              2
            </div>
            <h5 className="text-xs font-extrabold text-slate-800">Add to Queue</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              When creating content, use "Add to Queue" instead of scheduling a specific time.
            </p>
          </div>

          <div className="bg-slate-50/30 border border-slate-150 p-4 rounded-xl space-y-2">
            <div className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 font-extrabold text-xs flex items-center justify-center">
              3
            </div>
            <h5 className="text-xs font-extrabold text-slate-800">Auto-Schedule</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Your post is automatically scheduled to your next available slot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
