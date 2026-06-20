import React, { useState, useEffect } from "react";
import { 
  User, 
  Plus, 
  Search, 
  HelpCircle, 
  Check, 
  Trash2, 
  Sparkles, 
  Zap,
  CheckCircle,
  X,
  SlidersHorizontal,
  Youtube,
  Instagram,
  Facebook,
  ExternalLink,
  Smartphone
} from "lucide-react";
import { UserProfile, ConnectedAccount } from "../types";

interface UserManagementProps {
  accounts: ConnectedAccount[];
  onAddToast: (msg: string) => void;
  // Optional cloud synchronization callbacks
  profiles?: UserProfile[];
  onSaveProfile?: (profile: UserProfile) => void;
  onDeleteProfile?: (id: string) => void;
  userId?: string;
}

export function UserManagement({ 
  accounts, 
  onAddToast,
  profiles: externalProfiles,
  onSaveProfile,
  onDeleteProfile,
  userId
}: UserManagementProps) {
  // Local list of profiles
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Load from local storage or external firebase on mount
  useEffect(() => {
    if (externalProfiles && externalProfiles.length > 0) {
      setProfiles(externalProfiles);
    } else {
      const storageKey = userId ? `uploadpost_user_profiles_${userId}` : "uploadpost_user_profiles";
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setProfiles(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse user profiles", e);
        }
      } else {
        if (userId) {
          // New authenticated user starts with absolutely no profile created yet!
          setProfiles([]);
          localStorage.setItem(storageKey, JSON.stringify([]));
        } else {
          // Seed default profile so the view looks pristine yet has data for guest demo
          const defaultProfiles: UserProfile[] = [
            {
              id: "prof_master_workspace",
              name: "master_workspace",
              plan: "Free",
              createdAt: new Date().toLocaleDateString(),
              linkedPlatformsCount: accounts.filter(a => a.connected).length || 2
            }
          ];
          setProfiles(defaultProfiles);
          localStorage.setItem(storageKey, JSON.stringify(defaultProfiles));
        }
      }
    }
  }, [externalProfiles, accounts, userId]);

  // Sync back to local storage and external whenever local profiles change
  const syncProfiles = (updated: UserProfile[]) => {
    setProfiles(updated);
    const storageKey = userId ? `uploadpost_user_profiles_${userId}` : "uploadpost_user_profiles";
    localStorage.setItem(storageKey, JSON.stringify(updated));
    localStorage.setItem("onboarding_profile_name", updated[0]?.name || "master_workspace");
    localStorage.setItem("onboarding_profile_created", updated.length > 0 ? "true" : "false");
  };

  // Profile validation input characters: letters, numbers, underscores, hyphens, and @
  const validateProfileName = (name: string): boolean => {
    const rx = /^[a-zA-Z0-9_\-@]+$/;
    return rx.test(name);
  };

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProfileName.trim();
    if (!trimmed) return;

    if (!validateProfileName(trimmed)) {
      onAddToast("Error: Profile name contains unsupported characters.");
      return;
    }

    // Check duplication
    if (profiles.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      onAddToast("Error: Profile name already exists!");
      return;
    }

    const newProfile: UserProfile = {
      id: `prof_${Math.random().toString(36).substr(2, 9)}`,
      name: trimmed,
      plan: "Free",
      createdAt: new Date().toLocaleDateString(),
      linkedPlatformsCount: Math.floor(Math.random() * 3) + 1 // mock links
    };

    const updated = [newProfile, ...profiles];
    syncProfiles(updated);
    if (onSaveProfile) onSaveProfile(newProfile);

    setNewProfileName("");
    onAddToast(`User profile "${trimmed}" created successfully!`);
  };

  const handleDelete = (id: string, name: string) => {
    const updated = profiles.filter(p => p.id !== id);
    syncProfiles(updated);
    if (onDeleteProfile) onDeleteProfile(id);
    onAddToast(`Profile "${name}" successfully deleted.`);
  };

  // Filter and Search profiles
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Custom filter simulation of platform connections
    if (platformFilter === "all") return matchesSearch;
    if (platformFilter === "linked") return matchesSearch && profile.linkedPlatformsCount > 0;
    if (platformFilter === "unlinked") return matchesSearch && profile.linkedPlatformsCount === 0;
    return matchesSearch;
  });

  return (
    <div id="user-management-panel" className="max-w-4xl mx-auto space-y-6 py-2 animate-fade-in">
      
      {/* Title & Description Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
          Create profiles to manage your social media accounts. The profile name you choose will be used as the <code className="px-1 py-0.5 bg-slate-100 border border-slate-200 text-indigo-600 rounded text-xs font-mono font-bold">user</code> parameter in the API. Each profile can be linked to multiple social media accounts, allowing you to manage different sets of accounts separately.
        </p>
      </div>

      {/* Info Notice Banners */}
      <div className="space-y-3">
        {/* Blue Info Banner */}
        <div className="bg-sky-50/70 border border-sky-150 rounded-xl p-4 flex gap-3.5 shadow-2xs">
          <div className="p-2 bg-sky-100 text-sky-600 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center font-bold">
            ⚡
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-sky-800 leading-relaxed font-medium">
              Want to let your own users connect their social media accounts? Check out the{" "}
              <a 
                href="#api-integration-guide" 
                onClick={(e) => { e.preventDefault(); onAddToast("Redirected to Profile API Integration guide..."); }} 
                className="font-bold underline text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                profile API integration guide
              </a>
              . You can test it below with the Share button.
            </p>
          </div>
        </div>

        {/* Warning TikTok Notice */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex gap-3.5 shadow-2xs">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center font-bold">
            🎵
          </div>
          <div className="space-y-0.5">
            <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider">TikTok Notice</h5>
            <p className="text-xs text-amber-800/90 leading-relaxed font-semibold">
              Connecting to TikTok is not available for users on the Free plan. Please{" "}
              <a 
                href="#upgrade-plan" 
                onClick={(e) => { e.preventDefault(); onAddToast("Opening pricing upgrade selection model..."); }} 
                className="font-bold underline text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                upgrade your plan
              </a>{" "}
              to post on TikTok.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Profile container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Add New Profile</h3>
          <span className="text-[10.5px] text-slate-400 font-medium">
            Create a new profile to manage social accounts
          </span>
        </div>

        <form onSubmit={handleAddProfile} className="space-y-3">
          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="e.g. business_account, personal11"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-250 rounded-xl focus:outline-hidden focus:border-indigo-500 text-slate-850 placeholder:text-slate-400 font-medium transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Profile</span>
            </button>
          </div>
          <div className="text-[10.5px] text-slate-450 font-bold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Allowed characters: letters, numbers, underscores, hyphens, and @</span>
          </div>
        </form>
      </div>

      {/* Registered Users Section list */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-xs space-y-5">
        
        {/* Search and Filters panel row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Registered Users
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-slate-100 border border-slate-200 text-indigo-600 rounded">
              {filteredProfiles.length}/{profiles.length === 0 ? "0" : "2"} Profiles (default plan)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto self-end">
            {/* Real Search bar filter widget */}
            <div className="relative flex-1 md:w-56 shrink-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active profiles..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Filter by Platform Dropdown Simulation */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-250 bg-white hover:bg-slate-50 text-slate-705 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-450" />
                <span>Platforms</span>
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Filter by Link State
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPlatformFilter("all"); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold flex items-center justify-between transition-colors ${
                      platformFilter === "all" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span>Show All Profiles</span>
                    {platformFilter === "all" && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPlatformFilter("linked"); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold flex items-center justify-between transition-colors ${
                      platformFilter === "linked" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span>Has Linked Platforms</span>
                    {platformFilter === "linked" && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPlatformFilter("unlinked"); setIsFilterDropdownOpen(false); }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold flex items-center justify-between transition-colors ${
                      platformFilter === "unlinked" ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span>No Linked Platforms</span>
                    {platformFilter === "unlinked" && <Check className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* List render / table or empty state */}
        <div className="min-h-56 border-2 border-dashed border-slate-200/90 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-50/25">
          {filteredProfiles.length === 0 ? (
            <div className="space-y-4 max-w-sm animate-fade-in">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100/80 rounded-full flex items-center justify-center text-indigo-600 mx-auto shadow-sm">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-800">No profiles matched</h4>
                <p className="text-xs text-slate-450 leading-relaxed font-medium">
                  Create your first profile, or reset searches.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full text-left divide-y divide-slate-100 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              {filteredProfiles.map((p) => (
                <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs font-mono shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-850">
                          {p.name}
                        </span>
                        <span className="px-1.5 py-0.5 text-[8.5px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                          Active
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                        <span>Created: {p.createdAt}</span>
                        <span>•</span>
                        <span>Plan: {p.plan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 self-end sm:self-center">
                    {/* Multi linked accounts badge icons */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold mr-1">Linked socials:</span>
                      <div className="flex -space-x-1 hover:space-x-1.5 transition-all">
                        {accounts.map(acc => (
                          <div 
                            key={acc.id}
                            className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] cursor-pointer shadow-2xs hover:scale-115 transition-all ${
                              acc.connected 
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                                : "bg-slate-50 border-slate-200 text-slate-305"
                            }`}
                            title={acc.connected ? `${acc.platform.replace("_shorts", "").toUpperCase()}: connected` : `${acc.platform.replace("_shorts", "").toUpperCase()}: bypassed`}
                          >
                            {acc.platform === "tiktok" && <span className="font-sans">🎵</span>}
                            {acc.platform === "instagram" && <Instagram className="w-3 h-3 text-pink-500" />}
                            {acc.platform === "facebook" && <Facebook className="w-3 h-3 text-blue-600" />}
                            {acc.platform === "youtube_shorts" && <Youtube className="w-3 h-3 text-rose-600" />}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg cursor-pointer transition-all"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
