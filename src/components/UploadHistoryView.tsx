import React, { useState } from "react";
import { Clock, SlidersHorizontal, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { CrossPost } from "../types";

interface UploadHistoryProps {
  onAddToast: (msg: string) => void;
  onBackToProfile?: () => void;
  campaigns?: CrossPost[];
}

export function UploadHistoryView({ onAddToast, onBackToProfile, campaigns = [] }: UploadHistoryProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<"all" | "youtube" | "tiktok" | "instagram">("all");

  const mockUploadedPosts = campaigns.length > 0 
    ? campaigns.map((campaign, i) => {
        const platformKeys = campaign.platforms 
          ? Object.keys(campaign.platforms).filter(
              k => campaign.platforms[k as keyof typeof campaign.platforms]
            )
          : [];
        return {
          id: campaign.id,
          title: campaign.title || "Untitled Cast",
          platforms: platformKeys,
          timestamp: campaign.publishDate || new Date().toLocaleString(),
          status: "Success",
          duration: "15s"
        };
      })
    : [];

  const handleRetry = (id: string) => {
    onAddToast(`Initiating manual retry sequence for content item...`);
  };

  const currentPosts = mockUploadedPosts.filter(post => {
    if (filterPlatform === "all") return true;
    return post.platforms.map(p => p.toLowerCase()).includes(filterPlatform);
  });

  return (
    <div id="upload-history-view" className="max-w-5xl mx-auto space-y-6 pt-2 pb-12 animate-fade-in text-left">
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Upload History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Review every post pushed across your connected platforms. Retry failures, inspect analytics, and monitor in-flight uploads.
          </p>
        </div>

        <button
          onClick={() => {
            setShowFilters(!showFilters);
            onAddToast("History filters toggled.");
          }}
          className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-indigo-650 transition-colors bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-wrap gap-2 animate-fade-in">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-505 self-center mr-2">Filter by Platform:</span>
          {["all", "youtube", "tiktok", "instagram"].map(plat => (
            <button
              key={plat}
              onClick={() => setFilterPlatform(plat as any)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all border ${
                filterPlatform === plat 
                  ? "bg-indigo-600 border-indigo-650 text-white shadow-xs" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-55"
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      )}

      {currentPosts.length === 0 ? (
        /* Empty State Card matching Sixth Image precisely */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">
              No upload history yet
            </h3>
            <p className="text-xs text-slate-455 font-semibold leading-relaxed">
              Your upload activity will appear here as soon as you publish a post.
            </p>
          </div>
        </div>
      ) : (
        /* Rendered Uploads list */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs divide-y divide-slate-100">
          <div className="p-4 bg-slate-50/50 rounded-t-2xl flex justify-between text-[10px] font-black uppercase text-slate-400">
            <span>Content Title</span>
            <span>Status</span>
          </div>
          {currentPosts.map((post) => (
            <div key={post.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/20 transition-colors">
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-bold text-slate-800">{post.title}</h4>
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-405 font-mono">
                  <span>{post.timestamp}</span>
                  <span>•</span>
                  <span>Platforms: {post.platforms.join(", ") || "None"}</span>
                  <span>•</span>
                  <span>Aspect: 9:16</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700">Successful</span>
                </div>

                <button
                  onClick={() => handleRetry(post.id)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-[11px] font-bold text-slate-650 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Republish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
