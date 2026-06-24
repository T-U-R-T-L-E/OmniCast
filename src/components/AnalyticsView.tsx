import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Eye, 
  Compass, 
  Calendar, 
  TrendingUp, 
  RefreshCw, 
  Check, 
  ChevronDown,
  Info,
  Youtube,
  Instagram,
  Facebook,
  Search,
  CheckCircle,
  Sparkles,
  Award
} from "lucide-react";
import { UserProfile } from "../types";
import { safeStorage } from "../lib/safeStorage";

interface AnalyticsViewProps {
  onAddToast: (msg: string) => void;
}

export function AnalyticsView({ onAddToast }: AnalyticsViewProps) {
  // Load user profiles from safeStorage
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const [selectedMetric, setSelectedMetric] = useState<"followers" | "reach" | "impressions">("impressions");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = safeStorage.getItem("uploadpost_user_profiles");
    if (saved) {
      try {
        const parsed: UserProfile[] = JSON.parse(saved);
        setProfiles(parsed);
        // Initially select all profiles to show aggregates
        if (parsed.length > 0) {
          setSelectedProfileIds(parsed.map(p => p.id));
        }
      } catch (e) {
        console.error("Failed to parse user profiles", e);
      }
    } else {
      // Seed default profiles same as in UserManagement if empty so that the user gets immediate beautiful analytics if they haven't set up yet
      const defaultProfiles: UserProfile[] = [
        {
          id: "prof_master_workspace",
          name: "master_workspace",
          plan: "Free",
          createdAt: new Date().toLocaleDateString(),
          linkedPlatformsCount: 3
        },
        {
          id: "prof_company_brand",
          name: "company_brand",
          plan: "Professional",
          createdAt: "2026-05-15",
          linkedPlatformsCount: 4
        }
      ];
      setProfiles(defaultProfiles);
      setSelectedProfileIds(defaultProfiles.map(p => p.id));
      safeStorage.setItem("uploadpost_user_profiles", JSON.stringify(defaultProfiles));
    }
  }, []);

  // Compute stats based on selected profiles and mock growth factors
  const getSimulatedStats = () => {
    if (selectedProfileIds.length === 0) {
      return { followers: 0, reach: 0, impressions: 0 };
    }

    let scale = 1;
    if (period === "7") scale = 0.25;
    if (period === "90") scale = 3.2;

    // Accumulate stats based on selected profile characteristics
    let totalFollowers = 0;
    let totalReach = 0;
    let totalImpressions = 0;

    selectedProfileIds.forEach(id => {
      const profile = profiles.find(p => p.id === id);
      if (!profile) return;
      
      // Compute unique seed based on profile name length
      const seed = profile.name.length;
      const isPromoPlan = profile.plan !== "Free";

      const baseF = seed * 3240 + (isPromoPlan ? 15000 : 2500);
      const baseR = seed * 12380 + (isPromoPlan ? 64000 : 12000);
      const baseI = seed * 23450 + (isPromoPlan ? 118000 : 22000);

      totalFollowers += baseF;
      totalReach += Math.floor(baseR * scale);
      totalImpressions += Math.floor(baseI * scale);
    });

    return {
      followers: totalFollowers,
      reach: totalReach,
      impressions: totalImpressions
    };
  };

  const stats = getSimulatedStats();

  // Generate chart data based on selected profiles, period, and chosen metric
  const getChartData = () => {
    const dataPointsCount = period === "7" ? 7 : period === "30" ? 15 : 30; // compressed points for beautiful layout
    const items = [];
    const dateNow = new Date("2026-06-19");

    for (let i = dataPointsCount - 1; i >= 0; i--) {
      const d = new Date(dateNow);
      d.setDate(dateNow.getDate() - i * (period === "90" ? 3 : period === "30" ? 2 : 1));
      const dateString = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      let aggregatedVal = 0;
      selectedProfileIds.forEach(id => {
        const p = profiles.find(profile => profile.id === id);
        if (!p) return;

        const seedMultiplier = p.name.length * 8;
        const isPromo = p.plan !== "Free";
        const factor = isPromo ? 2.5 : 1;

        // Create cyclic/trending chart data points
        const indexShift = i * 0.4;
        const trend = i * (isPromo ? 150 : 30);
        let base = 0;

        if (selectedMetric === "followers") {
          base = p.name.length * 120 + 2000;
          base += Math.sin(indexShift) * 150 + trend;
        } else if (selectedMetric === "reach") {
          base = p.name.length * 540 + 7500;
          base += Math.cos(indexShift) * 1200 + trend * 4;
        } else {
          base = p.name.length * 1150 + 15000;
          base += Math.sin(indexShift * 1.5) * 3500 + trend * 8;
        }

        aggregatedVal += Math.floor(base * factor);
      });

      items.push({
        date: dateString,
        value: aggregatedVal
      });
    }
    return items;
  };

  const chartData = getChartData();

  const handleSelectAll = () => {
    setSelectedProfileIds(profiles.map(p => p.id));
    onAddToast("Selected all profiles for analytics.");
  };

  const handleDeselectAll = () => {
    setSelectedProfileIds([]);
    onAddToast("Cleared analytics selections.");
  };

  const toggleProfileSelection = (id: string) => {
    if (selectedProfileIds.includes(id)) {
      setSelectedProfileIds(selectedProfileIds.filter(pid => pid !== id));
    } else {
      setSelectedProfileIds([...selectedProfileIds, id]);
    }
  };

  // Human date range string matching current date "2026-06-19"
  const getDateRangeStr = () => {
    const end = new Date("2026-06-19");
    const start = new Date(end);
    start.setDate(end.getDate() - parseInt(period));
    
    const format = (d: Date) => d.toISOString().split("T")[0];
    return `${format(start)} to ${format(end)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Filter profiles displayed in list based on search bar
  const filteredProfiles = profiles.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div id="user-analytics-panel" className="max-w-7xl mx-auto space-y-6 py-2 animate-fade-in text-slate-900">
      
      {/* Title block with Reset Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-indigo-650 tracking-wider uppercase font-sans">
            Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            View analytics for your connected social media accounts. Note that some platforms may have limitations on historical data availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPeriod("30");
            setSelectedMetric("impressions");
            if (profiles.length > 0) {
              setSelectedProfileIds(profiles.map(p => p.id));
            }
            onAddToast("Analytics setup reset to defaults.");
          }}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-indigo-150 rounded-xl bg-white shadow-3xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Order</span>
        </button>
      </div>

      {/* Period Filter Row */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 shadow-3xs justify-between">
        <div className="flex flex-col gap-1 sm:w-64">
          <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest">
            Period
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
              className="w-full text-left px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-750 font-bold text-xs rounded-xl flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>{period === "7" ? "Last 7 days" : period === "30" ? "Last 30 days" : "Last 90 days"}</span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {isPeriodDropdownOpen && (
              <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-1.5 space-y-1">
                <button
                  type="button"
                  onClick={() => { setPeriod("7"); setIsPeriodDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold flex items-center justify-between transition-colors ${
                    period === "7" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span>Last 7 days</span>
                  {period === "7" && <Check className="w-3 h-3 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setPeriod("30"); setIsPeriodDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold flex items-center justify-between transition-all ${
                    period === "30" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span>Last 30 days</span>
                  {period === "30" && <Check className="w-3 h-3 text-indigo-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setPeriod("90"); setIsPeriodDropdownOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold flex items-center justify-between transition-all ${
                    period === "90" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span>Last 90 days</span>
                  {period === "90" && <Check className="w-3 h-3 text-indigo-600" />}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-indigo-650 bg-indigo-50/50 border border-indigo-100 rounded-xl px-3 py-2 shrink-0 self-start sm:self-end">
          <Calendar className="w-4 h-4" />
          <span>{getDateRangeStr()}</span>
        </div>
      </div>

      {/* Main Global Analytics Grid Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-xs space-y-6">
        
        {/* Metric Selection Card Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Global Analytics
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Aggregated analytics for all selected profiles <span className="text-slate-500 font-bold">({getDateRangeStr()})</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-[10px] text-slate-400 font-extrabold mr-1">
              {selectedProfileIds.length} / {profiles.length} selected
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={profiles.length === 0}
              className="px-2.5 py-1.5 text-[10px] uppercase font-black tracking-wider border border-slate-200 hover:border-indigo-200 bg-white hover:bg-slate-50 rounded-lg text-slate-600 hover:text-indigo-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              disabled={profiles.length === 0}
              className="px-2.5 py-1.5 text-[10px] uppercase font-black tracking-wider border border-slate-200 hover:border-rose-200 bg-white hover:bg-slate-50 rounded-lg text-slate-600 hover:text-rose-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Metric selection buttons configured matching the exact columns in top image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Followers */}
          <button
            type="button"
            onClick={() => setSelectedMetric("followers")}
            className={`p-5 rounded-2xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              selectedMetric === "followers"
                ? "border-2 border-indigo-600 bg-indigo-50/15 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>Followers</span>
                <span title="The cumulative follower count of the selected profiles across connected social accounts" className="text-slate-350 hover:text-slate-500 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {formatNumber(stats.followers)}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${selectedMetric === "followers" ? "bg-indigo-100 text-indigo-600" : "bg-slate-50 text-slate-400"}`}>
              <Users className="w-5 h-5" />
            </div>
          </button>

          {/* Card 2: Reach */}
          <button
            type="button"
            onClick={() => setSelectedMetric("reach")}
            className={`p-5 rounded-2xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              selectedMetric === "reach"
                ? "border-2 border-indigo-600 bg-indigo-50/15 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>Reach</span>
                <span title="Total number of unique users who viewed any post on the connected platforms" className="text-slate-350 hover:text-slate-500 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {formatNumber(stats.reach)}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${selectedMetric === "reach" ? "bg-indigo-100 text-indigo-600" : "bg-slate-50 text-slate-400"}`}>
              <Compass className="w-5 h-5" />
            </div>
          </button>

          {/* Card 3: Impressions (has blue highlight/selected style in image) */}
          <button
            type="button"
            onClick={() => setSelectedMetric("impressions")}
            className={`p-5 rounded-2xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              selectedMetric === "impressions"
                ? "border-2 border-indigo-600 bg-indigo-50/15 shadow-sm"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <span>Impressions</span>
                <span title="Total views/loads recorded for published video campaigns" className="text-slate-350 hover:text-slate-500 transition-colors">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                {formatNumber(stats.impressions)}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${selectedMetric === "impressions" ? "bg-indigo-100 text-indigo-600" : "bg-slate-50 text-slate-400"}`}>
              <Eye className="w-5 h-5" />
            </div>
          </button>

        </div>

        {/* Metric details and Recharts chart renderer */}
        <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/25">
          {selectedProfileIds.length === 0 ? (
            <div className="min-h-72 flex flex-col items-center justify-center text-center p-6 space-y-3.5 transform transition-all duration-300">
              <div className="p-3 bg-slate-100 rounded-full text-slate-405 border border-slate-200">
                <ChevronDown className="w-5 h-5 rotate-90" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">No profiles selected</h4>
                <p className="text-[11px] text-slate-400 max-w-xs font-medium">
                  Select one or more user profiles from the registration drawer below to aggregate and display charts.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#4F46E5] rounded-full"></span>
                  <span className="text-[11px] uppercase font-black text-slate-500 tracking-wider">
                    {selectedMetric} over {period === "7" ? "the last week" : period === "30" ? "the last month" : "the last 90 days"}
                  </span>
                </div>
                <div className="text-[11.5px] font-bold text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-slate-705">Steady Growth trend</span>
                </div>
              </div>

              {/* Chart Stage */}
              <div className="h-72 w-full pr-1.5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: "#64748B", fontSize: 10, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(v) => formatNumber(v)} 
                      tick={{ fill: "#64748B", fontSize: 10, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#FFFFFF", 
                        borderRadius: "12px", 
                        border: "1px solid #E2E8F0", 
                        fontSize: "11px",
                        fontWeight: "700",
                        boxShadow: "0 4px 12px -2px rgba(0,0,0,0.06)"
                      }}
                      formatter={(v) => [formatNumber(v as number), selectedMetric.toUpperCase()]}
                      labelStyle={{ color: "#4F46E5", fontWeight: "800", marginBottom: "4px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4F46E5" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorMetric)" 
                      animationDuration={500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Profiles Selection & Connect Account Status Module */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-xs space-y-5">
        
        {/* Header for list */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-505" />
              <span>Select Active Workspace Profiles</span>
            </h3>
            <p className="text-[11.5px] text-slate-450 font-medium">
              Toggle specific accounts below to filter the global performance aggregate statistics dynamically.
            </p>
          </div>

          <div className="relative w-full sm:w-60 md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspaces..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 text-slate-800 font-semibold"
            />
          </div>
        </div>

        {/* Profiles checklist/cards */}
        {filteredProfiles.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3 bg-slate-50/25">
            <div className="p-3 bg-indigo-50 rounded-full inline-block text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">No profiles found</h5>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto font-medium mt-1">
                Please connect an account or create a workspace user in the <strong className="text-indigo-600 font-bold">User Management</strong> panel to view localized social stats.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProfiles.map((p) => {
              const checked = selectedProfileIds.includes(p.id);
              return (
                <div 
                  key={p.id}
                  onClick={() => toggleProfileSelection(p.id)}
                  className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    checked 
                      ? "border-indigo-555 bg-indigo-50/10 shadow-3xs" 
                      : "border-slate-200 bg-white hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 border rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      checked ? "bg-indigo-600 text-white border-transparent" : "bg-slate-100 text-slate-655 border-slate-200"
                    }`}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                        {p.plan} PLAN • {p.linkedPlatformsCount} connected platforms
                      </p>
                    </div>
                  </div>

                  {/* Circle Checkbox */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked 
                      ? "bg-[#4F46E5] border-transparent text-white" 
                      : "border-slate-300 bg-white"
                  }`}>
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
