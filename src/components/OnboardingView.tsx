import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  Sparkles, 
  Check, 
  ExternalLink, 
  Key, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Monitor, 
  Play, 
  Share2, 
  FileVideo, 
  Copy, 
  CheckCircle,
  HelpCircle,
  Clock,
  Unlock
} from "lucide-react";
import { ConnectedAccount, CrossPost } from "../types";

interface OnboardingViewProps {
  accounts: ConnectedAccount[];
  campaigns: CrossPost[];
  setActivePage: (page: any) => void;
  setUploadStep: (step: 1 | 2 | 3) => void;
}

export function OnboardingView({ accounts, campaigns, setActivePage, setUploadStep }: OnboardingViewProps) {
  // Collapse / Expand checklist
  const [isChecklistCollapsed, setIsChecklistCollapsed] = useState(false);

  // Profile Step states
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem("onboarding_profile_name") || "";
  });
  const [isProfileCreated, setIsProfileCreated] = useState(() => {
    return localStorage.getItem("onboarding_profile_created") === "true";
  });
  const [profileInputVal, setProfileInputVal] = useState("");

  // API Key Step states
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("onboarding_api_key") || "";
  });
  const [isApiKeyGenerated, setIsApiKeyGenerated] = useState(() => {
    return localStorage.getItem("onboarding_api_key_generated") === "true";
  });
  const [copiedKey, setCopiedKey] = useState(false);

  // Dynamic values
  const hasConnectedAccount = accounts.some(a => a.connected);
  const hasSuccessfulUpload = campaigns.length > 0;

  // Handle profile creation
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileInputVal.trim()) return;
    const name = profileInputVal.trim();
    setProfileName(name);
    setIsProfileCreated(true);
    localStorage.setItem("onboarding_profile_name", name);
    localStorage.setItem("onboarding_profile_created", "true");
    setProfileInputVal("");
  };

  // Reset profile
  const handleResetProfile = () => {
    setProfileName("");
    setIsProfileCreated(false);
    localStorage.removeItem("onboarding_profile_name");
    localStorage.removeItem("onboarding_profile_created");
  };

  // Generate API Key
  const handleGenerateApiKey = () => {
    const randomHex = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const newKey = `up_live_${randomHex}`;
    setApiKey(newKey);
    setIsApiKeyGenerated(true);
    localStorage.setItem("onboarding_api_key", newKey);
    localStorage.setItem("onboarding_api_key_generated", "true");
  };

  // Copy API Key
  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Steps counts
  const steps = [
    { completed: isProfileCreated, name: "profile" },
    { completed: hasConnectedAccount, name: "account" },
    { completed: isApiKeyGenerated, name: "api_key" },
    { completed: hasSuccessfulUpload, name: "upload" },
  ];
  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div id="welcome-onboarding-page" className="max-w-4xl mx-auto space-y-8 py-3 animate-fade-in">
      
      {/* Centered Top Onboarding Header */}
      <div className="text-center space-y-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100/80 rounded-full text-[10px] font-bold text-indigo-650 uppercase tracking-widest">
          <Rocket className="w-3 h-3 text-indigo-500 animate-bounce" />
          <span>Onboarding</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
          Welcome to <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">OmniCast</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium leading-relaxed">
          Connect your accounts, generate an API key and ship your first multi-platform upload in minutes.
        </p>
      </div>

      {/* Start Free Today Accent Card */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs">
        <div className="p-2 bg-blue-100 rounded-xl text-blue-600 shrink-0">
          <Sparkles className="w-4 h-4 text-blue-600 fill-blue-100" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">Start free today</h4>
          <p className="text-xs text-blue-700/80">
            Get 10 free uploads per month. Need more?{" "}
            <button 
              onClick={() => setActivePage("connections")} 
              className="font-extrabold underline hover:text-blue-900 transition-colors"
            >
              See pricing plans
            </button>
          </p>
        </div>
      </div>

      {/* Checklist Header module */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Accordion Trigger */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/25">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
              🚀
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">How to get started</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {completedCount}/4 steps completed
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setIsChecklistCollapsed(!isChecklistCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-indigo-600 border border-slate-200 hover:border-indigo-200 hover:bg-slate-50 rounded-lg cursor-pointer transition-all shadow-2xs"
          >
            {isChecklistCollapsed ? (
              <>
                <span>Expand</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Collapse</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Collapsible content pane */}
        {!isChecklistCollapsed && (
          <div className="p-6 space-y-7 bg-white">
            
            {/* Elegant Mock Walkthrough Video (User requested NO real Youtube Video yet) */}
            <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-slate-950 aspect-[16/8] flex flex-col items-center justify-center p-6 text-center shadow-inner group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 via-[#1E293B]/95 to-[#0F172A]/90 opacity-95" />
              
              {/* Cool Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />

              <div className="relative z-10 space-y-4 max-w-sm">
                <div className="w-14 h-14 bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                  <Play className="w-6 h-6 stroke-[3] fill-indigo-400/20 text-indigo-400 ml-0.5" />
                </div>
                
                <div className="space-y-1.5">
                  <span className="inline-block px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[#818CF8] text-[9px] font-bold uppercase tracking-widest rounded-md">
                    Walkthrough coming soon
                  </span>
                  <h4 className="text-sm font-extrabold text-white">How-to-use Media Delivery Guide</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    A comprehensive video walkthrough of configuring active profiles and posting to YouTube Shorts, TikTok, and Instagram is being packaged now. Follow the checklist below to begin!
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-5">
              
              {/* STEP 1: Create your user profile */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isProfileCreated 
                  ? "bg-slate-50/50 border-slate-200" 
                  : "bg-white border-slate-200/90 shadow-2xs hover:border-indigo-100"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      isProfileCreated 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {isProfileCreated ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        1. Create your user profile.
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Navigate to "Manage Users" to add a new profile. This profile will be used to associate with your social media accounts and API uploads. You can create multiple profiles to manage different sets of accounts.
                      </p>
                      
                      {isProfileCreated && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded mt-1.5">
                          <User className="w-3 h-3 text-emerald-500" />
                          <span>Active Profile Profile: <strong>{profileName}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-start gap-2 pt-1 sm:pt-0">
                    {!isProfileCreated ? (
                      <form onSubmit={handleCreateProfile} className="flex gap-1.5 w-full max-w-xs">
                        <input
                          type="text"
                          required
                          value={profileInputVal}
                          onChange={(e) => setProfileInputVal(e.target.value)}
                          placeholder="e.g. Master Workspace"
                          className="px-2.5 py-1.5 text-xs border border-slate-250 rounded-xl focus:outline-hidden focus:border-indigo-500 text-slate-800 placeholder:text-slate-400 w-40"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
                        >
                          Create
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResetProfile}
                        className="px-2.5 py-1 text-[10.5px] font-bold text-slate-400 hover:text-rose-600 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                      >
                        Reset Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 2: Connect first account */}
              <div className={`p-5 rounded-2xl border transition-all ${
                hasConnectedAccount 
                  ? "bg-slate-50/50 border-slate-200" 
                  : "bg-white border-slate-200/90 shadow-2xs hover:border-indigo-100"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      hasConnectedAccount 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {hasConnectedAccount ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        2. Connect your first social media account.
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        To cross-publish your optimized content with ease, link your TikTok, Instagram Reels, Facebook Reels, or YouTube Shorts integrations in your Operations center.
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {accounts.map(acc => (
                          <span 
                            key={acc.id}
                            className={`px-2 py-0.5 text-[10px] rounded-md font-bold flex items-center gap-1 border ${
                              acc.connected 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                                : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${acc.connected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                            {acc.platform.replace("_shorts", "").toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePage("connections")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
                    >
                      Go to Manage Users
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3: Generate API Key */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isApiKeyGenerated 
                  ? "bg-slate-50/50 border-slate-200" 
                  : "bg-white border-slate-200/90 shadow-2xs hover:border-indigo-100"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex items-start gap-3 w-full">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      isApiKeyGenerated 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {isApiKeyGenerated ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "3"}
                    </div>
                    
                    <div className="space-y-1 w-full max-w-lg">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        3. Generate your API Key.
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Obtain an authentication token to push raw payloads or trigger programmatic optimization via the background webhook pipeline. Keep this key strictly secret.
                      </p>
                      
                      {isApiKeyGenerated && (
                        <div className="mt-2.5 flex items-center gap-1.5 w-full bg-slate-100 p-2 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                          <Key className="w-3.5 h-3.5 text-indigo-550 shrink-0" />
                          <code className="text-[10px] font-mono font-black text-slate-800 truncate select-all flex-1">
                            {apiKey}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyKey}
                            className="p-1 text-slate-450 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-md cursor-pointer transition-colors"
                            title="Copy API token"
                          >
                            {copiedKey ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-550" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex gap-2">
                    {!isApiKeyGenerated ? (
                      <button
                        type="button"
                        onClick={handleGenerateApiKey}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
                      >
                        Generate API Key
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActivePage("connections")}
                        className="px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-600 rounded-xl cursor-pointer transition-colors"
                      >
                        Go to API Keys
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 4: Make first successful upload */}
              <div className={`p-5 rounded-2xl border transition-all ${
                hasSuccessfulUpload 
                  ? "bg-slate-50/50 border-slate-200" 
                  : "bg-white border-slate-200/90 shadow-2xs hover:border-indigo-100"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      hasSuccessfulUpload 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {hasSuccessfulUpload ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "4"}
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        4. Make your first successful upload. 👇
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Kick off the Publishing Wizard. Clip your first vertical media sequence, optimize descriptors with our integrated bulk engine, and distribute securely across social streams.
                      </p>
                      
                      {hasSuccessfulUpload && (
                        <p className="text-[11px] font-black text-emerald-700 flex items-center gap-1 mt-1">
                          🎉 Complete! Active campaign logs detected in history database.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePage("upload");
                        setUploadStep(1);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
                    >
                      Publish Now
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
