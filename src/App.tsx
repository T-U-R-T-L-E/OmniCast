import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Film,
  Link2,
  Trash2,
  UploadCloud,
  Check,
  Share2,
  Play,
  FileVideo,
  FileImage,
  ImageIcon,
  Info,
  Copy,
  Edit2,
  Plus,
  RefreshCw,
  AlertCircle,
  Clock,
  ExternalLink,
  Layers,
  CheckCircle2,
  Calendar,
  SlidersHorizontal,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MoreVertical,
  Music,
  ThumbsUp,
  ThumbsDown,
  Repeat2,
  UserPlus,
  Youtube,
  Instagram,
  Facebook,
  Activity,
  Compass,
  Rocket,
  Users,
  Key,
  LineChart,
  DollarSign,
  BookOpen,
  Star,
  LogOut,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  CreditCard,
  HelpCircle,
  User,
  ChevronUp,
  X,
  Menu,
  History
} from "lucide-react";
import { ConnectedAccount, OptimizedResult, CrossPost, PublishingStep, MediaLibraryItem, UserProfile, ApiKey } from "./types";
import { ConnectedAccounts } from "./components/ConnectedAccounts";
import { Presets, PresetVideo } from "./components/Presets";
import { Confetti } from "./components/Confetti";
import { MediaLibrary } from "./components/MediaLibrary";
import { CalendarView } from "./components/CalendarView";
import { OnboardingView } from "./components/OnboardingView";
import { UserManagement } from "./components/UserManagement";
import { ApiKeyManagement } from "./components/ApiKeyManagement";
import { AnalyticsView } from "./components/AnalyticsView";
import { PricingView } from "./components/PricingView";
import { HelpCenterView } from "./components/HelpCenterView";
import { DocumentationView } from "./components/DocumentationView";
import { ReviewFormView } from "./components/ReviewFormView";
import { ProfileView } from "./components/ProfileView";
import { QueueSettingsView } from "./components/QueueSettingsView";
import { BillingInvoicesView } from "./components/BillingInvoicesView";
import { ConnectedAppsView } from "./components/ConnectedAppsView";
import { TeamManagementView } from "./components/TeamManagementView";
import { UploadHistoryView } from "./components/UploadHistoryView";
import { 
  loadCampaignsFromFirestore, 
  saveCampaignToFirestore, 
  deleteCampaignFromFirestore,
  auth
} from "./lib/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { isUserEmailVerified, isPasswordLinkingRequired, logOutUser } from "./lib/firebaseAuth";
import { AuthScreen } from "./components/AuthScreen";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import { NotificationsPage } from "./components/NotificationsPage";
import { useAutoSaveDraft } from "./hooks/useAutoSave";
import { motion, AnimatePresence } from "motion/react";

const DEFAULT_ACCOUNTS: ConnectedAccount[] = [
  {
    id: "acc-tiktok",
    platform: "tiktok",
    username: "@tech_unboxing_clips",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
    connected: true,
    status: "active"
  },
  {
    id: "acc-instagram",
    platform: "instagram",
    username: "@curated_reels_daily",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
    connected: true,
    status: "active"
  },
  {
    id: "acc-facebook",
    platform: "facebook",
    username: "Curated Media Group",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    connected: true,
    status: "active"
  },
  {
    id: "acc-youtube",
    platform: "youtube_shorts",
    username: "CuratedShortsHQ",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    connected: true,
    status: "active"
  }
];

export default function App() {
  // Config & state
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(DEFAULT_ACCOUNTS);
  
  // Active Authenticated user state
  const [authedUser, setAuthedUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Synchronize authenticated state including email verification and account linking checks
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const verified = isUserEmailVerified(user);
        const linkRequired = isPasswordLinkingRequired(user);
        
        if (verified && !linkRequired) {
          setAuthedUser(user);
        } else {
          setAuthedUser(null);
        }
      } else {
        setAuthedUser(null);
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const getAccountForPlatform = (plat: string) => {
    return accounts.find(a => a.platform === plat) || DEFAULT_ACCOUNTS.find(a => a.platform === plat);
  };
  
  // Form inputs
  const [title, setTitle] = useState("Vlog: A Day of Light Roasting & Mindful Execution");
  const [description, setDescription] = useState("Step into my quiet creative workspace. Today we are tweaking our micro-batches, meditating before coding, and executing with strict visual focus. Let me know your routine below!");
  const [hashtags, setHashtags] = useState("productivity, workspace, design, lifestyle, desksetup");
  
  // Custom draft restore handler
  const handleRestoreDraft = React.useCallback((draft: { title: string; description: string; hashtags: string }) => {
    if (draft.title !== undefined) setTitle(draft.title);
    if (draft.description !== undefined) setDescription(draft.description);
    if (draft.hashtags !== undefined) setHashtags(draft.hashtags);
  }, []);

  // Hook for 5-second automatic local-storage backup & restore
  const { lastSaved, saveDraft } = useAutoSaveDraft(title, description, hashtags, handleRestoreDraft);

  // Helper to render platform-specific character counters and progress bars dynamically
  const renderCharacterLimitBar = (currentLength: number, maxLimit: number) => {
    const percentage = Math.min((currentLength / maxLimit) * 100, 100);
    const isExceeded = currentLength > maxLimit;
    const isWarning = currentLength >= maxLimit * 0.8 && currentLength <= maxLimit;
    
    let barColorClass = "bg-blue-500 shadow-[0_0_4px_rgba(59,130,246,0.3)]";
    if (isExceeded) {
      barColorClass = "bg-rose-500 shadow-[0_0_6px_rgba(239,68,68,0.5)] animate-pulse";
    } else if (isWarning) {
      barColorClass = "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.4)]";
    }

    return (
      <div className="space-y-1 mt-1.5">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50 relative">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px]">
          {isExceeded ? (
            <span className="text-rose-650 font-extrabold flex items-center gap-1 animate-pulse">
              ⚠️ Character limit exceeded by {currentLength - maxLimit}!
            </span>
          ) : isWarning ? (
            <span className="text-amber-600 font-bold">
              Approaching local platform limit
            </span>
          ) : (
            <span className="text-slate-400 font-medium font-sans">
              Character usage within safe bounds
            </span>
          )}
          <span className={`font-mono font-bold ${isExceeded ? "text-rose-600 font-extrabold" : isWarning ? "text-amber-500" : "text-slate-400"}`}>
            {currentLength} / {maxLimit}
          </span>
        </div>
      </div>
    );
  };
  
  // Selected preset id tracking
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Media Library states
  const [libraryItems, setLibraryItems] = useState<MediaLibraryItem[]>([
    {
      id: "preset-tech",
      name: "AI Smart Assistant Unboxing.mp4",
      size: "24.5 MB",
      src: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-a-blue-screen-on-41617-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
      type: "video",
      duration: 45
    },
    {
      id: "preset-cooking",
      name: "ASMR Roasted Garlic Bread.mp4",
      size: "18.2 MB",
      src: "https://assets.mixkit.co/videos/preview/mixkit-pouring-dripping-honey-on-fresh-pancakes-34354-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400",
      type: "video",
      duration: 32
    },
    {
      id: "preset-travel",
      name: "Hidden Bali Waterfall Hike.mp4",
      size: "30.1 MB",
      src: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-slide-at-a-water-park-41566-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
      type: "video",
      duration: 55
    }
  ]);
  const [platformAttachments, setPlatformAttachments] = useState<Record<string, MediaLibraryItem>>({});

  // Video upload simulation
  const [videoFile, setVideoFile] = useState<{
    name: string;
    size: string;
    src: string | null;
    thumbnail: string | null;
    type?: 'video' | 'image';
    duration?: number;
  } | null>({
    name: "working_session_1080p.mp4",
    size: "18.4 MB",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-a-blue-screen-on-41617-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
    type: 'video',
    duration: 45
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // AI Loading & Result state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedResult | null>({
    analytics_keywords: ["mindfulness", "routine hacks", "productivity tips", "slow coffee"],
    platforms: {
      tiktok: {
        final_caption: "Vlog: A Day of Light Roasting & Mindful Execution ☕️ Quiet creative workspace routine. Tweaking micro-batches, meditating before coding, and executing with strict visual focus. What's your routine? #productivity #workspace #design #lifestyle #desksetup #mindfulness #desksetup"
      },
      instagram: {
        caption: "A Day of Light Roasting & Mindful Execution in the quiet workspace.\n.\n.\nTweaking micro-batches, meditating before coding, and executing with strict visual focus. What tools are keeping you grounded today?\n.\n.\n#productivity #workspace #design #lifestyle #desksetup #routinehacks #slowcoffee"
      },
      facebook: {
        caption: "Transforming how we approach daily routines: Light roasting, morning meditation, and developer execution. Join the conversation and tell us about your desk setup. #productivity #workspace #mindfulness #routinehacks"
      },
      youtube_shorts: {
        title: "A Day of Mindful Workspace Execution! ☕️ #Shorts",
        description: "Behind the scenes in my quiet creative coding workspace. Meditation, coffee, and focused progress. #shorts #workspace #productivity"
      }
    }
  });

  // Client edit overrides (User can touch & tweak optimized output manually)
  const [customCaptions, setCustomCaptions] = useState<{
    tiktok: string;
    instagram: string;
    facebook: string;
    youtube_title: string;
    youtube_desc: string;
  }>({
    tiktok: "",
    instagram: "",
    facebook: "",
    youtube_title: "",
    youtube_desc: ""
  });

  // Detailed platform publishing configurations
  const [youtubeSettings, setYoutubeSettings] = useState({
    saveOrPublish: "publish", // "draft" | "publish"
    visibility: "public", // "public" | "unlisted" | "private"
    coverUrl: "",
  });

  const [tiktokSettings, setTiktokSettings] = useState({
    visibility: "everyone", // "everyone" | "friends" | "only_you"
    coverUrl: "",
  });

  const [instagramSettings, setInstagramSettings] = useState({
    postToStory: false,
    coverUrl: "",
  });

  const [facebookSettings, setFacebookSettings] = useState({
    shareToStory: false,
    visibility: "public", // "public" | "friends" | "only_me"
    coverUrl: "",
  });

  // Interactive Platform Integration Guide Active States
  const [integrationGuideTab, setIntegrationGuideTab] = useState<"youtube" | "tiktok" | "instagram" | "facebook">("youtube");
  const [showIntegrationBridge, setShowIntegrationBridge] = useState(true);

  // Diagnostic state variables for Simulated Health Check on Platform APIs
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<Record<"youtube" | "tiktok" | "instagram" | "facebook", { 
    status: "unchecked" | "success" | "failure", 
    message: string, 
    ping?: number, 
    connectedSince?: string,
    quotaUsed: number,
    quotaMax: number,
    expirySeconds?: number 
  }>>({
    youtube: { status: "unchecked", message: "Verification pending", quotaUsed: 12, quotaMax: 100 },
    tiktok: { status: "unchecked", message: "Verification pending", quotaUsed: 25, quotaMax: 150 },
    instagram: { status: "unchecked", message: "Verification pending", quotaUsed: 44, quotaMax: 200 },
    facebook: { status: "unchecked", message: "Verification pending", quotaUsed: 8, quotaMax: 100 }
  });

  // OAuth Token Expiry Countdown Timer Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setHealthStatus(prev => {
        const keys = ["youtube", "tiktok", "instagram", "facebook"] as const;
        let hasChanges = false;
        const next = { ...prev };
        for (const k of keys) {
          if (next[k].status === "success" && next[k].expirySeconds !== undefined) {
            if (next[k].expirySeconds > 0) {
              let newVal = next[k].expirySeconds - 1;
              if (newVal < 300) {
                // Instantly update to non-blocking zone and trigger animated silent refresh
                newVal = 3599; // Set buffer cleanly to avoid repeat triggers
                const platformLabel = k; // Capture key
                setTimeout(() => {
                  forceRefreshToken(platformLabel, true);
                }, 0);
              }
              next[k] = {
                ...next[k],
                expirySeconds: newVal
              };
              hasChanges = true;
            }
          }
        }
        return hasChanges ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const runHealthCheck = async () => {
    setIsPinging(true);
    triggerToast("Initiating secure pings to platform endpoints...");
    
    const platforms: Array<"youtube" | "tiktok" | "instagram" | "facebook"> = ["youtube", "tiktok", "instagram", "facebook"];
    
    for (const plat of platforms) {
      setHealthStatus(prev => ({
        ...prev,
        [plat]: { ...prev[plat], message: "Pinging safe endpoints..." }
      }));
      
      // Beautiful artificial latency for responsive feel
      await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 200));
      
      const isConnected = accounts.find((a) => a.platform === (plat === "youtube" ? "youtube_shorts" : plat))?.connected ?? false;
      const pingMs = Math.floor(45 + Math.random() * 60);
      const maxQ = plat === "youtube" ? 100 : plat === "tiktok" ? 150 : plat === "instagram" ? 200 : 100;
      
      if (isConnected) {
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const usedQ = Math.floor(maxQ * (0.05 + Math.random() * 0.15));
        const randExpiry = Math.floor(1800 + Math.random() * 1800);
        setHealthStatus(prev => ({
          ...prev,
          [plat]: { 
            status: "success", 
            message: `Connected securely (${pingMs}ms)`,
            ping: pingMs,
            connectedSince: `Today at ${timeNow}`,
            quotaUsed: usedQ,
            quotaMax: maxQ,
            expirySeconds: randExpiry
          }
        }));
      } else {
        setHealthStatus(prev => ({
          ...prev,
          [plat]: { 
            status: "failure", 
            message: "Missing credentials or OAuth keys",
            connectedSince: undefined,
            quotaUsed: prev[plat].quotaUsed || Math.floor(maxQ * 0.1),
            quotaMax: maxQ,
            expirySeconds: undefined
          }
        }));
      }
    }
    
    setIsPinging(false);
    triggerToast("All integrated channel diagnostics complete!");
  };

  const runSingleHealthCheck = async (plat: "youtube" | "tiktok" | "instagram" | "facebook") => {
    triggerToast(`Clearing status and re-verifying ${plat === "youtube" ? "YouTube" : plat} OAuth credentials...`);
    
    // Clear state or set verification state initially
    setHealthStatus(prev => ({
      ...prev,
      [plat]: { ...prev[plat], status: "unchecked", message: "Connecting to gateway...", expirySeconds: undefined }
    }));
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const isConnected = accounts.find((a) => a.platform === (plat === "youtube" ? "youtube_shorts" : plat))?.connected ?? false;
    const pingMs = Math.floor(45 + Math.random() * 60);
    const maxQ = plat === "youtube" ? 100 : plat === "tiktok" ? 150 : plat === "instagram" ? 200 : 100;
    
    if (isConnected) {
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const usedQ = Math.floor(maxQ * (0.05 + Math.random() * 0.15));
      const randExpiry = Math.floor(1800 + Math.random() * 1800);
      setHealthStatus(prev => ({
        ...prev,
        [plat]: { 
          status: "success", 
          message: `Connected securely (${pingMs}ms)`,
          ping: pingMs,
          connectedSince: `Today at ${timeNow}`,
          quotaUsed: usedQ,
          quotaMax: maxQ,
          expirySeconds: randExpiry
        }
      }));
      triggerToast(`Re-verification success: ${plat === "youtube" ? "YouTube" : plat} token is fully validated.`);
    } else {
      setHealthStatus(prev => ({
        ...prev,
        [plat]: { 
          status: "failure", 
          message: "Missing credentials or OAuth keys",
          connectedSince: undefined,
          quotaUsed: prev[plat].quotaUsed || Math.floor(maxQ * 0.1),
          quotaMax: maxQ,
          expirySeconds: undefined
        }
      }));
      triggerToast(`Re-verification failed: Missing ${plat === "youtube" ? "YouTube" : plat} credentials.`);
    }
  };

  const forceRefreshToken = async (plat: "youtube" | "tiktok" | "instagram" | "facebook", silent: boolean = false) => {
    const isConnected = accounts.find((a) => a.platform === (plat === "youtube" ? "youtube_shorts" : plat))?.connected ?? false;
    
    if (!isConnected) {
      triggerToast(`Cannot refresh: ${plat === "youtube" ? "YouTube" : plat === "tiktok" ? "TikTok" : plat === "instagram" ? "Instagram" : "Facebook"} is not linked.`);
      return;
    }

    if (silent) {
      triggerToast(`Refreshing ${plat === "youtube" ? "YouTube" : plat === "tiktok" ? "TikTok" : plat === "instagram" ? "Instagram" : "Facebook"}...`);
    } else {
      triggerToast(`Executing token refresh handshake for ${plat === "youtube" ? "YouTube" : plat === "tiktok" ? "TikTok" : plat === "instagram" ? "Instagram" : "Facebook"}...`);
    }

    // Simulate typical OAuth token refresh call (e.g. request POST with refresh_token)
    await new Promise(resolve => setTimeout(resolve, 800));

    const pingMs = Math.floor(40 + Math.random() * 55);
    const maxQ = plat === "youtube" ? 100 : plat === "tiktok" ? 150 : plat === "instagram" ? 200 : 100;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const randExpiry = Math.floor(1800 + Math.random() * 1800); // Between 30 and 60 minutes
    const refreshedQuotaUsed = Math.max(0, Math.floor(healthStatus[plat].quotaUsed * 0.45)); // Recover some daily quota following a clean OAuth cycle

    setHealthStatus(prev => ({
      ...prev,
      [plat]: {
        status: "success",
        message: `Token Refreshed (${pingMs}ms)`,
        ping: pingMs,
        connectedSince: `Refreshed at ${timeNow}`,
        quotaUsed: refreshedQuotaUsed,
        quotaMax: maxQ,
        expirySeconds: randExpiry
      }
    }));

    triggerToast(`OAuth Session Refreshed! ${plat === "youtube" ? "YouTube" : plat === "tiktok" ? "TikTok" : plat === "instagram" ? "Instagram" : "Facebook"} token is fully active.`);
  };

  // Dynamic automatic synced updates of covers/thumbnails when video selection occurs
  useEffect(() => {
    const defaultThumb = videoFile?.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400";
    setYoutubeSettings(prev => ({ ...prev, coverUrl: defaultThumb }));
    setTiktokSettings(prev => ({ ...prev, coverUrl: defaultThumb }));
    setInstagramSettings(prev => ({ ...prev, coverUrl: defaultThumb }));
    setFacebookSettings(prev => ({ ...prev, coverUrl: defaultThumb }));
  }, [videoFile?.thumbnail]);

  // Keep manual inputs aligned once optimized changes arrive
  useEffect(() => {
    if (optimizedResult) {
      setCustomCaptions({
        tiktok: optimizedResult.platforms.tiktok.final_caption,
        instagram: optimizedResult.platforms.instagram.caption,
        facebook: optimizedResult.platforms.facebook.caption,
        youtube_title: optimizedResult.platforms.youtube_shorts.title,
        youtube_desc: optimizedResult.platforms.youtube_shorts.description,
      });
    }
  }, [optimizedResult]);

  // Saved campaigns history (Local Storage synced)
  const [campaigns, setCampaigns] = useState<CrossPost[]>([]);

  // Navigation & Multi-page workspace layout
  const [activePage, setActivePage] = useState<"users" | "apikeys" | "upload" | "calendar" | "analytics" | "pricing" | "docs" | "profile" | "queue_settings" | "invoices" | "connected_apps" | "team_management" | "history">("users");
  const [uploadStep, setUploadStep] = useState<1 | 2 | 3>(1);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [docsTabOverride, setDocsTabOverride] = useState<"guides" | "helpdesk" | "review" | undefined>(undefined);

  // Selected view modes
  const [activePlatformPreview, setActivePlatformPreview] = useState<"tiktok" | "instagram" | "facebook" | "youtube_shorts" | "bulk_edit">("tiktok");
  const [previewSubTab, setPreviewSubTab] = useState<"config" | "feed">("config");

  // Bulk Edit Mode States
  const [bulkTitle, setBulkTitle] = useState("");
  const [bulkDescription, setBulkDescription] = useState("");
  const [bulkHashtags, setBulkHashtags] = useState("");
  const [bulkPlatforms, setBulkPlatforms] = useState({
    tiktok: true,
    instagram: true,
    facebook: true,
    youtube_title: false,
    youtube_desc: true,
  });

  // Publishing Queue Simulation
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStrategy, setPublishStrategy] = useState<"now" | "later">("now");
  const [scheduledDateTime, setScheduledDateTime] = useState<string>("");
  const [isPublishingStarted, setIsPublishingStarted] = useState<boolean>(false);
  const [currentPublishingStep, setCurrentPublishingStep] = useState<number>(0);
  const [publishingSteps, setPublishingSteps] = useState<PublishingStep[]>([
    { name: "Verifying credentials & authorization tokens", status: "idle", progress: 0 },
    { name: "Uploading high-definition media slice to cloud storage", status: "idle", progress: 0 },
    { name: "Translating custom JSON payloads and SEO markers", status: "idle", progress: 0 },
    { name: "Initiating platform hook publishing handles", status: "idle", progress: 0 }
  ]);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [serverLogs, setServerLogs] = useState<string[]>([]);
  const [publishingResults, setPublishingResults] = useState<Record<string, any>>({});
  const [platformPublishStatus, setPlatformPublishStatus] = useState<Record<string, { success: boolean; error?: string; url?: string; isRetrying?: boolean }>>({});
  const [simulatePlatformErrors, setSimulatePlatformErrors] = useState<Record<string, boolean>>({
    tiktok: false,
    instagram: false,
    facebook: false,
    youtube_shorts: false
  });
  const [hasPublishingFailed, setHasPublishingFailed] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("omnicast_dark") === "true";
  });

  useEffect(() => {
    localStorage.setItem("omnicast_dark", darkMode ? "true" : "false");
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Toast notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile menu bottom-sheet state
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Scroll to page top on active page modification
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [activePage]);

  // Load config & initial campaigns
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzoffset)).toISOString().slice(0, 16);
    setScheduledDateTime(localISOTime);

    fetch("/api/config")
      .then(r => r.json())
      .then(data => {
        setHasGeminiKey(data.hasGeminiKey);
      })
      .catch(e => console.error("Could not fetch Server API configuration:", e));
  }, []);

  // Load campaigns user-specific history when authedUser becomes active
  useEffect(() => {
    if (!authedUser) {
      setCampaigns([]);
      setAccounts(DEFAULT_ACCOUNTS);
      return;
    }

    const loadInitialData = async () => {
      let loadedFromFirestore = false;
      try {
        const firestoreCampaigns = await loadCampaignsFromFirestore(authedUser.uid);
        if (firestoreCampaigns) {
          setCampaigns(firestoreCampaigns);
          loadedFromFirestore = true;
          console.log("[Omni-Cast Firebase]: Synced user campaigns securely from Firestore");
        }
      } catch (err) {
        console.warn("[Omni-Cast Firebase]: Firestore campaign load bypassed/not-ready (using localized fallback):", err);
      }

      if (!loadedFromFirestore) {
        try {
          const stored = localStorage.getItem(`posting_campaigns_v1_${authedUser.uid}`);
          if (stored) {
            setCampaigns(JSON.parse(stored));
          } else {
            // Initial mock history item
            const initialMock: CrossPost[] = [
              {
                id: "camp-1",
                ownerId: authedUser.uid,
                title: "Avenue Sunset Walk in San Francisco",
                description: "A gorgeous warm day in California walking down Sunset Boulevard, checking out local micro-roasters.",
                hashtags: "sf, sunset, travelvlog, walkingtour",
                videoUrl: null,
                videoName: "california_sun_90.mp4",
                videoSize: "12.8 MB",
                thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
                platforms: { tiktok: true, instagram: true, facebook: false, youtube_shorts: true },
                status: "published",
                publishDate: "Yesterday, 4:15 PM",
                analytics: { views: 8490, likes: 1220, shares: 340, comments: 84 }
              }
            ];
            localStorage.setItem(`posting_campaigns_v1_${authedUser.uid}`, JSON.stringify(initialMock));
            setCampaigns(initialMock);
          }
        } catch (e) {
          console.error("LocalStorage load error:", e);
        }
      }
    };

    loadInitialData();

    // Load personalized connected accounts from LocalStorage
    try {
      const storedAcc = localStorage.getItem(`omnicast_accounts_v1_${authedUser.uid}`);
      if (storedAcc) {
        setAccounts(JSON.parse(storedAcc));
      } else {
        setAccounts(DEFAULT_ACCOUNTS);
      }
    } catch (e) {
      console.error("LocalStorage load accounts error:", e);
    }
  }, [authedUser]);

  const saveCampaigns = (updated: CrossPost[]) => {
    setCampaigns(updated);
    if (!authedUser) return;
    try {
      localStorage.setItem(`posting_campaigns_v1_${authedUser.uid}`, JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }

    // Proactively back up each campaign item in Firestore
    updated.forEach(campaign => {
      const dbCampaign = {
        ...campaign,
        ownerId: campaign.ownerId || authedUser.uid
      };
      saveCampaignToFirestore(dbCampaign).catch(err => {
        console.debug("[Omni-Cast Firebase]: Firestore sync skipped for campaign id:", campaign.id);
      });
    });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Connected Account handlers
  const saveAccounts = (updatedAccounts: ConnectedAccount[] | ((prev: ConnectedAccount[]) => ConnectedAccount[])) => {
    setAccounts(prev => {
      const resolved = typeof updatedAccounts === "function" ? updatedAccounts(prev) : updatedAccounts;
      if (authedUser) {
        try {
          localStorage.setItem(`omnicast_accounts_v1_${authedUser.uid}`, JSON.stringify(resolved));
        } catch (e) {
          console.error("LocalStorage save accounts error:", e);
        }
      }
      return resolved;
    });
  };

  const handleToggleConnect = (platformId: string) => {
    const updated = accounts.map(a => {
      if (a.id === platformId) {
        return { ...a, connected: !a.connected };
      }
      return a;
    });
    saveAccounts(updated);
    triggerToast(`Updated connection state for ${platformId.replace("acc-", "")}`);
  };

  const handleUpdateUsername = (platformId: string, newHandle: string) => {
    saveAccounts(accounts.map(a => {
      if (a.id === platformId) {
        return { ...a, username: newHandle };
      }
      return a;
    }));
    triggerToast(`Platform handle updated successfully`);
  };

  const handleRevokeOAuth = async (platform: string, platformId: string) => {
    try {
      const response = await fetch("/api/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platform,
          token: platform === "youtube_shorts" ? "youtube_sec_token_99a" : "meta-user-acc-token-42c"
        })
      });
      const data = await response.json();
      if (data.success) {
        // Disconnect account
        saveAccounts(prev => prev.map(a => {
          if (a.id === platformId) {
            return { ...a, connected: false, status: "not_connected" };
          }
          return a;
        }));
        
        // Log details to user or developer logs
        console.log(`[Local Sync]: Revoked tokens cleanly on ${platform}:`, data.logs);
        triggerToast(`OAuth Authorization Securely Revoked on ${platform.replace("_shorts", "").toUpperCase()}!`);
      } else {
        throw new Error(data.error || "Revocation failed");
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(`Friction revoking token: ${err.message || String(err)}`);
      throw err;
    }
  };

  // Preset Selection Loader
  const handleSelectPreset = (preset: PresetVideo) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.title);
    setDescription(preset.description);
    setHashtags(preset.hashtags);
    setVideoFile({
      name: `${preset.id.replace("preset-", "")}_vlog.mp4`,
      size: "24.5 MB",
      src: preset.videoUrl,
      thumbnail: preset.thumbnailUrl
    });
    triggerToast(`Loaded "${preset.name}" preset details into your workspace`);
  };

  // File Upload Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
 
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      registerMedia(file);
    }
  };
 
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      registerMedia(file);
    }
  };
 
  const registerMedia = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isVideo = ['mp4', 'mov', 'mkv', 'avi', 'wmv', 'webm', '3gp'].includes(ext);
    const isImage = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'svg', 'eps', 'tiff'].includes(ext);
 
    if (!isVideo && !isImage) {
      triggerToast(`Unsupported file extension ".${ext}". Please upload a supported video or image file.`);
      return;
    }
 
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    
    let objectUrl: string | null = null;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch (e) {
      console.warn("Could not create object URL for file preview:", e);
    }
 
    let thumbnail: string | null = null;
    if (isImage) {
      thumbnail = objectUrl;
      const uploadedFile = {
        name: file.name,
        size: sizeStr,
        src: objectUrl,
        thumbnail: thumbnail,
        type: 'image' as const
      };
      setVideoFile(uploadedFile);
      
      const newLibItem: MediaLibraryItem = {
        id: `lib-user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: sizeStr,
        src: objectUrl || "",
        thumbnail: thumbnail || "",
        type: 'image',
      };
      setLibraryItems(prev => [newLibItem, ...prev]);
      
      setSelectedPresetId(null);
      triggerToast(`Selected image: ${file.name} (${sizeStr}) adding to library`);
    } else {
      const randomThumbnails = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      ];
      thumbnail = randomThumbnails[Math.floor(Math.random() * randomThumbnails.length)];
 
      if (objectUrl) {
        const tempVideo = document.createElement("video");
        tempVideo.preload = "metadata";
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        tempVideo.src = objectUrl;
        
        tempVideo.onloadedmetadata = () => {
          const uploadedFile = {
            name: file.name,
            size: sizeStr,
            src: objectUrl,
            thumbnail: thumbnail,
            type: 'video' as const,
            duration: tempVideo.duration
          };
          setVideoFile(uploadedFile);

          const newLibItem: MediaLibraryItem = {
            id: `lib-user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            size: sizeStr,
            src: objectUrl || "",
            thumbnail: thumbnail || "",
            type: 'video',
            duration: tempVideo.duration
          };
          setLibraryItems(prev => [newLibItem, ...prev]);

          setSelectedPresetId(null);
          triggerToast(`Selected video: ${file.name} (${sizeStr}) • Duration parsed: ${Math.round(tempVideo.duration)}s`);
        };
 
        tempVideo.onerror = () => {
          const uploadedFile = {
            name: file.name,
            size: sizeStr,
            src: objectUrl,
            thumbnail: thumbnail,
            type: 'video' as const,
            duration: 45
          };
          setVideoFile(uploadedFile);

          const newLibItem: MediaLibraryItem = {
            id: `lib-user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            size: sizeStr,
            src: objectUrl || "",
            thumbnail: thumbnail || "",
            type: 'video',
            duration: 45
          };
          setLibraryItems(prev => [newLibItem, ...prev]);

          setSelectedPresetId(null);
          triggerToast(`Selected video: ${file.name} (${sizeStr}) adding to library`);
        };
      } else {
        const uploadedFile = {
          name: file.name,
          size: sizeStr,
          src: null,
          thumbnail: thumbnail,
          type: 'video' as const,
          duration: 45
        };
        setVideoFile(uploadedFile);

        const newLibItem: MediaLibraryItem = {
          id: `lib-user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: sizeStr,
          src: "",
          thumbnail: thumbnail || "",
          type: 'video',
          duration: 45
        };
        setLibraryItems(prev => [newLibItem, ...prev]);

        setSelectedPresetId(null);
        triggerToast(`Selected video: ${file.name} (${sizeStr})`);
      }
    }
  };
 
  const clearVideo = () => {
    setVideoFile(null);
    setSelectedPresetId(null);
    triggerToast("Media slot cleared");
  };

  // API Call to optimize captions
  const handleOptimizeAPI = async () => {
    if (!title.trim() && !description.trim()) {
      triggerToast("Please provide at least a Title or Description to optimize.");
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          hashtags,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with HTTP status ${response.status}`);
      }

      const result: OptimizedResult = await response.json();
      setOptimizedResult(result);
      triggerToast("AI optimization refined captions successfully!");
    } catch (err: any) {
      console.error("API error during optimization:", err);
      triggerToast(`Optimization failed: ${err.message || String(err)}. Using beautiful default templates.`);
      
      // Stand-in beautiful fallback optimization if credentials aren't deployed or server fails
      const fallbackResult: OptimizedResult = {
        analytics_keywords: hashtags.split(",").map(t => t.trim().toLowerCase()),
        platforms: {
          tiktok: {
            final_caption: `${title} 🚀 ${description} #${hashtags.split(",").map(t => t.trim()).join(" #")}`
          },
          instagram: {
            caption: `${title}\n.\n.\n${description}\n.\n.\n#${hashtags.split(",").map(t => t.trim()).join(" #")}`
          },
          facebook: {
            caption: `${title} - ${description} Join the discussion! #${hashtags.split(",").map(t => t.trim()).join(" #")}`
          },
          youtube_shorts: {
            title: `${title.substring(0, 80)} #Shorts`,
            description: `${description} #Shorts #${hashtags.split(",").map(t => t.trim()).join(" #")}`
          }
        }
      };
      setOptimizedResult(fallbackResult);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Active Cross-posting pipeline utilizing real server endpoints and multi-platform handlers
  const handlePublishAll = () => {
    // Check if at least one platform is active/connected
    const hasActivePlatforms = accounts.some(a => a.connected);
    if (!hasActivePlatforms) {
      triggerToast("Please connect at least one social media platform first.");
      return;
    }

    // Initialize schedule time to 2 hours from now
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzoffset)).toISOString().slice(0, 16);
    setScheduledDateTime(localISOTime);

    setPublishStrategy("now");
    setIsPublishingStarted(false);
    setShowPublishSuccess(false);
    setServerLogs([]);
    setPlatformPublishStatus({});
    setHasPublishingFailed(false);
    setIsPublishing(true);
  };

  const executeInstantPublish = async () => {
    setIsPublishingStarted(true);
    setCurrentPublishingStep(0);
    setServerLogs(["[Omni-Cast Orchestrator]: Initializing secure distribution flow...", "[Omni-Cast Orchestrator]: Gathering customized form assets..."]);

    // Initial step setup
    setPublishingSteps([
      { name: "Verifying credentials & authorization tokens", status: "running", progress: 20 },
      { name: "Uploading high-definition media slice to cloud storage", status: "idle", progress: 0 },
      { name: "Translating custom JSON payloads and SEO markers", status: "idle", progress: 0 },
      { name: "Initiating platform hook publishing handles", status: "idle", progress: 0 }
    ]);

    // Track active targets mapping
    const targets = {
      tiktok: accounts.find(a => a.platform === "tiktok")?.connected || false,
      instagram: accounts.find(a => a.platform === "instagram")?.connected || false,
      facebook: accounts.find(a => a.platform === "facebook")?.connected || false,
      youtube_shorts: accounts.find(a => a.platform === "youtube_shorts")?.connected || false
    };

    const initialStatus: Record<string, { success: boolean; error?: string; url?: string }> = {};
    Object.keys(targets).forEach((p) => {
      if (targets[p as keyof typeof targets]) {
        initialStatus[p] = { success: false, error: undefined };
      }
    });
    setPlatformPublishStatus(initialStatus);
    setHasPublishingFailed(false);

    try {
      // Advance step 1
      await new Promise(r => setTimeout(r, 800));
      setPublishingSteps(prev => [
        { ...prev[0], status: "completed", progress: 100 },
        { ...prev[1], status: "running", progress: 30 },
        prev[2],
        prev[3]
      ]);
      setCurrentPublishingStep(1);
      setServerLogs(prev => [...prev, "[Omni-Cast Orchestrator]: Access tokens and OAuth accounts validated.", "[Omni-Cast Orchestrator]: Initiating CDN upload of " + (videoFile?.name || "vertical_clip.mp4")]);

      // Advance step 2
      await new Promise(r => setTimeout(r, 1200));
      setPublishingSteps(prev => [
        prev[0],
        { ...prev[1], progress: 75 },
        prev[2],
        prev[3]
      ]);
      setServerLogs(prev => [...prev, "[Omni-Cast Cloud]: Processing multipart media frames...", "[Omni-Cast Cloud]: Video binary successfully verified against H.264 vertical format."]);

      await new Promise(r => setTimeout(r, 800));
      setPublishingSteps(prev => [
        prev[0],
        { ...prev[1], status: "completed", progress: 100 },
        { ...prev[2], status: "running", progress: 50 },
        prev[3]
      ]);
      setCurrentPublishingStep(2);
      setServerLogs(prev => [...prev, "[Omni-Cast Cloud]: Temporary public hosting generated.", "[Omni-Cast Orchestrator]: Translating customized metadata packages per platform channel."]);

      // Invoke server-side publishing handles
      const platformVideos: Record<string, string> = {};
      Object.keys(targets).forEach((p) => {
        if (targets[p as keyof typeof targets]) {
          const attachment = platformAttachments[p];
          if (attachment) {
            platformVideos[p] = attachment.src;
          }
        }
      });

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoFile?.src || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
          platformVideos,
          platforms: targets,
          youtubeSettings,
          tiktokSettings,
          instagramSettings,
          facebookSettings,
          simulateErrors: simulatePlatformErrors,
          credentials: {
            youtube_token: "mock_youtube_token",
            tiktok_token: "mock_tiktok_token",
            instagram_token: "mock_ig_token",
            facebook_token: "mock_fb_token"
          }
        })
      });

      const data = await response.json();
      
      // Advance step 3
      await new Promise(r => setTimeout(r, 500));
      setPublishingSteps(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: "completed", progress: 100 },
        { ...prev[3], status: "running", progress: 40 }
      ]);
      setCurrentPublishingStep(3);

      if (data.logs && Array.isArray(data.logs)) {
        setServerLogs(prev => [...prev, ...data.logs.map((l: string) => `[API Server]: ${l}`)]);
      } else {
        setServerLogs(prev => [...prev, "[API Server]: Dispatched publication requests to platform API hosts."]);
      }

      if (data.success) {
        setPublishingResults(data.results || {});
        
        // Match response to status of each target channel
        const updatedStatus: Record<string, { success: boolean; error?: string; url?: string }> = {};
        let someFailed = false;
        Object.keys(targets).forEach((p) => {
          if (targets[p as keyof typeof targets]) {
            const hasResult = data.results && data.results[p];
            const platformSuccess = hasResult ? data.results[p].success : true;
            const platformError = hasResult ? data.results[p].error : undefined;
            const platformUrl = hasResult ? data.results[p].url : undefined;
            
            updatedStatus[p] = {
              success: platformSuccess,
              error: platformError,
              url: platformUrl
            };
            if (!platformSuccess) {
              someFailed = true;
            }
          }
        });
        setPlatformPublishStatus(updatedStatus);

        if (someFailed) {
          setHasPublishingFailed(true);
          setPublishingSteps(prev => [
            prev[0],
            prev[1],
            prev[2],
            { ...prev[3], status: "running", name: "Handles finished with platform errors", progress: 100 }
          ]);
          triggerToast("Some publishing channels reported failure. You can retry those failed platforms.");
        } else {
          setHasPublishingFailed(false);
          // Complete remaining step
          await new Promise(r => setTimeout(r, 1000));
          setPublishingSteps(prev => prev.map(s => ({ ...s, status: "completed", progress: 100 })));
          setIsPublishing(false);
          setShowPublishSuccess(true);
          triggerToast("Successfully broadcasted to your enabled social channels!");

          // Save into durable campaign logs!
          const newCampaign: CrossPost = {
            id: `camp-${Date.now()}`,
            title: title || "Untitled post",
            description: description,
            hashtags: hashtags,
            videoUrl: videoFile?.src || null,
            videoName: videoFile?.name || "unnamed.mp4",
            videoSize: videoFile?.size || "Unknown Size",
            thumbnailUrl: videoFile?.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
            platforms: targets,
            status: "published",
            publishDate: "Just now",
            customCaptions: {
              tiktok: customCaptions.tiktok,
              instagram: customCaptions.instagram,
              facebook: customCaptions.facebook,
              youtube_shorts_title: customCaptions.youtube_title,
              youtube_shorts_description: customCaptions.youtube_desc
            },
            youtubeSettings: youtubeSettings,
            tiktokSettings: tiktokSettings,
            instagramSettings: instagramSettings,
            facebookSettings: facebookSettings,
            analytics: {
              views: 0,
              likes: 0,
              shares: 0,
              comments: 0
            }
          };

          saveCampaigns([newCampaign, ...campaigns]);
        }
      } else {
        throw new Error(data.error || "Execution failed during distribution request.");
      }

    } catch (err: any) {
      console.error(err);
      setServerLogs(prev => [...prev, `[CRITICAL ERROR]: ${err.message || String(err)}`]);
      setPublishingSteps(prev => prev.map((s, idx) => idx === currentPublishingStep ? { ...s, status: "idle", progress: 0 } : s));
      triggerToast(`Friction detected: ${err.message || "Failed to finalize distribution channels"}`);
      setHasPublishingFailed(true);
    }
  };

  const handleRetryFailed = async () => {
    // Identify which active platforms failed
    const failedPlatforms = Object.keys(platformPublishStatus).filter(
      p => !platformPublishStatus[p].success
    );

    if (failedPlatforms.length === 0) return;

    setHasPublishingFailed(false);
    setServerLogs(prev => [
      ...prev,
      `[Omni-Cast Retry]: Reactivating publishing pipeline only for failed platforms: ${failedPlatforms.map(p => p.toUpperCase().replace("_SHORTS", "")).join(", ")}...`
    ]);

    // Update state to retrying
    setPlatformPublishStatus(prev => {
      const copy = { ...prev };
      failedPlatforms.forEach(p => {
        copy[p] = { ...copy[p], isRetrying: true, error: undefined };
      });
      return copy;
    });

    // Reset step 4 indicator to active progress animation
    setPublishingSteps(prev => [
      prev[0],
      prev[1],
      prev[2],
      { name: `Retrying handles: ${failedPlatforms.map(p => p.toUpperCase().replace("_SHORTS", "")).join(", ")}`, status: "running", progress: 60 }
    ]);

    // Prepare target object with ONLY failed channels
    const retryTargets = {
      tiktok: failedPlatforms.includes("tiktok"),
      instagram: failedPlatforms.includes("instagram"),
      facebook: failedPlatforms.includes("facebook"),
      youtube_shorts: failedPlatforms.includes("youtube_shorts")
    };

    try {
      await new Promise(r => setTimeout(r, 1200));

      const platformVideos: Record<string, string> = {};
      Object.keys(retryTargets).forEach((p) => {
        if (retryTargets[p as keyof typeof retryTargets]) {
          const attachment = platformAttachments[p];
          if (attachment) {
            platformVideos[p] = attachment.src;
          }
        }
      });

      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoFile?.src || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
          platformVideos,
          platforms: retryTargets,
          youtubeSettings,
          tiktokSettings,
          instagramSettings,
          facebookSettings,
          simulateErrors: simulatePlatformErrors,
          credentials: {
            youtube_token: "mock_youtube_token",
            tiktok_token: "mock_tiktok_token",
            instagram_token: "mock_ig_token",
            facebook_token: "mock_fb_token"
          }
        })
      });

      const data = await response.json();

      if (data.logs && Array.isArray(data.logs)) {
        setServerLogs(prev => [...prev, ...data.logs.map((l: string) => `[API Server Retry]: ${l}`)]);
      }

      if (data.success) {
        const copyStatus = { ...platformPublishStatus };
        let stillSomeFailed = false;

        failedPlatforms.forEach((p) => {
          const resObj = data.results && data.results[p];
          if (resObj) {
            copyStatus[p] = {
              success: resObj.success,
              error: resObj.error,
              url: resObj.url,
              isRetrying: false
            };
            if (!resObj.success) {
              stillSomeFailed = true;
            }
          }
        });

        // Add previously successful platform statuses back
        Object.keys(platformPublishStatus).forEach(p => {
          if (!failedPlatforms.includes(p)) {
            copyStatus[p] = platformPublishStatus[p];
          }
        });

        setPlatformPublishStatus(copyStatus);

        if (stillSomeFailed) {
          setHasPublishingFailed(true);
          setPublishingSteps(prev => [
            prev[0],
            prev[1],
            prev[2],
            { name: "Slight friction repeating: retry failed on some platform channels", status: "running", progress: 100 }
          ]);
          triggerToast("Some platforms fail to publish on retry. Correct issues or try again.");
        } else {
          setHasPublishingFailed(false);
          setPublishingSteps(prev => [
            prev[0],
            prev[1],
            prev[2],
            { name: "All channels successfully posted and validated", status: "completed", progress: 100 }
          ]);
          await new Promise(r => setTimeout(r, 1000));
          setIsPublishing(false);
          setShowPublishSuccess(true);
          triggerToast("Successfully completed retry workflow! All channels are post online.");

          // Record as full success in Localized Distribution History
          const finalActiveTargets = {
            tiktok: !!copyStatus.tiktok?.success,
            instagram: !!copyStatus.instagram?.success,
            facebook: !!copyStatus.facebook?.success,
            youtube_shorts: !!copyStatus.youtube_shorts?.success
          };

          const newCampaign: CrossPost = {
            id: `camp-${Date.now()}`,
            title: title || "Untitled post",
            description: description,
            hashtags: hashtags,
            videoUrl: videoFile?.src || null,
            videoName: videoFile?.name || "unnamed.mp4",
            videoSize: videoFile?.size || "Unknown Size",
            thumbnailUrl: videoFile?.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
            platforms: finalActiveTargets,
            status: "published",
            publishDate: "Just now",
            customCaptions: {
              tiktok: customCaptions.tiktok,
              instagram: customCaptions.instagram,
              facebook: customCaptions.facebook,
              youtube_shorts_title: customCaptions.youtube_title,
              youtube_shorts_description: customCaptions.youtube_desc
            },
            youtubeSettings: youtubeSettings,
            tiktokSettings: tiktokSettings,
            instagramSettings: instagramSettings,
            facebookSettings: facebookSettings,
            analytics: {
              views: 0,
              likes: 0,
              shares: 0,
              comments: 0
            }
          };

          saveCampaigns([newCampaign, ...campaigns]);
        }
      } else {
        throw new Error(data.error || "Retry pipeline crashed on server response.");
      }

    } catch (err: any) {
      console.error(err);
      setServerLogs(prev => [...prev, `[CRITICAL RETRY ERROR]: ${err.message || String(err)}`]);
      setHasPublishingFailed(true);
      setPlatformPublishStatus(prev => {
        const copy = { ...prev };
        failedPlatforms.forEach(p => {
          copy[p] = { ...copy[p], isRetrying: false };
        });
        return copy;
      });
      triggerToast(`Retry failed: ${err.message || "Failed to broadcast retried platforms"}`);
    }
  };

  const executeScheduledPublish = async () => {
    const selectedDateObj = new Date(scheduledDateTime);
    const now = new Date();
    
    // Simple verification check to ensure time is in the future
    if (selectedDateObj.getTime() <= now.getTime()) {
      triggerToast("Please choose a future date and time to schedule your broadcast.");
      return;
    }

    setIsPublishingStarted(true);
    setCurrentPublishingStep(0);
    
    const formattedDateTime = selectedDateObj.toLocaleString([], {
      year: 'numeric', month: 'short', day: '2-digit', 
      hour: '2-digit', minute: '2-digit'
    });

    setServerLogs([
      `[Omni-Cast Scheduler]: Initializing schedule handshakes for destination: ${formattedDateTime}...`,
      "[Omni-Cast Scheduler]: Validating content guidelines & cross-platform rules..."
    ]);

    setPublishingSteps([
      { name: "Validating requested time slot criteria", status: "running", progress: 25 },
      { name: "Packaging localized video headers & cover frames", status: "idle", progress: 0 },
      { name: "Syncing secure platform upload buffers", status: "idle", progress: 0 },
      { name: "Registering scheduled cron trigger handles", status: "idle", progress: 0 }
    ]);

    // Track active targets mapping
    const targets = {
      tiktok: accounts.find(a => a.platform === "tiktok")?.connected || false,
      instagram: accounts.find(a => a.platform === "instagram")?.connected || false,
      facebook: accounts.find(a => a.platform === "facebook")?.connected || false,
      youtube_shorts: accounts.find(a => a.platform === "youtube_shorts")?.connected || false
    };

    try {
      // Step 1
      await new Promise(r => setTimeout(r, 800));
      setPublishingSteps(prev => [
        { ...prev[0], status: "completed", progress: 100 },
        { ...prev[1], status: "running", progress: 40 },
        prev[2],
        prev[3]
      ]);
      setCurrentPublishingStep(1);
      setServerLogs(prev => [
        ...prev,
        `[Omni-Cast Scheduler]: Future slot locked & secured content buffer tags.`,
        "[Omni-Cast Scheduler]: Encoding metadata arrays & custom thumbnails..."
      ]);

      // Step 2
      await new Promise(r => setTimeout(r, 1000));
      setPublishingSteps(prev => [
        prev[0],
        { ...prev[1], status: "completed", progress: 100 },
        { ...prev[2], status: "running", progress: 50 },
        prev[3]
      ]);
      setCurrentPublishingStep(2);
      setServerLogs(prev => [
        ...prev,
        "[Omni-Cast Scheduler]: Form captions encrypted and cached on remote distributor relays.",
        "[Omni-Cast Scheduler]: Syncing authorization tokens with OAuth platform gateways..."
      ]);

      // Step 3
      await new Promise(r => setTimeout(r, 1000));
      setPublishingSteps(prev => [
        prev[0],
        prev[1],
        { ...prev[2], status: "completed", progress: 100 },
        { ...prev[3], status: "running", progress: 60 }
      ]);
      setCurrentPublishingStep(3);
      setServerLogs(prev => [
        ...prev,
        "[Omni-Cast Scheduler]: Secure handshakes verified.",
        `[Omni-Cast Scheduler]: Mounting cloud execution logs to target at: ${formattedDateTime}.`
      ]);

      // Step 4
      await new Promise(r => setTimeout(r, 800));
      setPublishingSteps(prev => prev.map(s => ({ ...s, status: "completed", progress: 100 })));
      setServerLogs(prev => [
        ...prev,
        `[Omni-Cast Scheduler]: Distribution broadcast queued on cloud runner.`,
        `[Omni-Cast Scheduler]: Scheduling process finished successfully.`
      ]);

      await new Promise(r => setTimeout(r, 600));
      setIsPublishing(false);
      setShowPublishSuccess(true);
      triggerToast(`All cross-posts successfully scheduled for ${formattedDateTime}!`);

      // Save into durable campaign logs as "queued"
      const scheduledCampaign: CrossPost = {
        id: `camp-${Date.now()}`,
        title: title || "Untitled post",
        description: description,
        hashtags: hashtags,
        videoUrl: videoFile?.src || null,
        videoName: videoFile?.name || "unnamed.mp4",
        videoSize: videoFile?.size || "Unknown Size",
        thumbnailUrl: videoFile?.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
        platforms: targets,
        status: "queued",
        publishDate: formattedDateTime,
        customCaptions: {
          tiktok: customCaptions.tiktok,
          instagram: customCaptions.instagram,
          facebook: customCaptions.facebook,
          youtube_shorts_title: customCaptions.youtube_title,
          youtube_shorts_description: customCaptions.youtube_desc
        },
        youtubeSettings: youtubeSettings,
        tiktokSettings: tiktokSettings,
        instagramSettings: instagramSettings,
        facebookSettings: facebookSettings,
        analytics: {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        }
      };

      saveCampaigns([scheduledCampaign, ...campaigns]);

    } catch (err: any) {
      console.error(err);
      setServerLogs(prev => [...prev, `[CRITICAL SCHEDULING ERROR]: ${err.message || String(err)}`]);
      setPublishingSteps(prev => prev.map((s, idx) => idx === currentPublishingStep ? { ...s, status: "idle", progress: 0 } : s));
      triggerToast(`Scheduling friction: ${err.message || "Failed to register campaign locks"}`);
      await new Promise(r => setTimeout(r, 4500));
      setIsPublishing(false);
    }
  };

  const handleDeleteCampaign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    saveCampaigns(campaigns.filter(c => c.id !== id));
    deleteCampaignFromFirestore(id).catch(err => {
      console.debug("[Omni-Cast Firebase]: Firestore campaign deletion skipped:", err);
    });
    triggerToast("Broadcast entry cleared from localized history");
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast("Copied optimized caption text to clipboard!");
  };

  const getAlternativeCovers = () => {
    const baseId = selectedPresetId || "preset-tech";
    switch (baseId) {
      case "preset-tech":
        return [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400"
        ];
      case "preset-cooking":
        return [
          "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400"
        ];
      case "preset-travel":
        return [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=400"
        ];
      case "preset-fitness":
      default:
        return [
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
        ];
    }
  };

  // Global Keyboard Shortcuts for power users (Ctrl+S to save draft, Ctrl+Enter to distribute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      
      const key = e.key.toLowerCase();
      if (isCmdOrCtrl && key === "s") {
        e.preventDefault();
        const savedTime = saveDraft();
        if (savedTime) {
          triggerToast(`Success: Draft saved manually at ${savedTime}!`);
        } else {
          triggerToast("Skipped: No draft content found to store.");
        }
      }
      
      if (isCmdOrCtrl && e.key === "enter") {
        e.preventDefault();
        if (!videoFile) {
          triggerToast("Bypassed: Please attach a video file first.");
          return;
        }
        if (isPublishing) {
          triggerToast("Bypassed: A publishing wizard is already active.");
          return;
        }
        handlePublishAll();
        triggerToast("Shortcut Triggered: Release preparation wizard is now open.");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveDraft, videoFile, isPublishing, handlePublishAll]);

  // Aggregate values for the connected platforms daily API budget
  const statusValues = Object.values(healthStatus) as Array<{ quotaUsed: number; quotaMax: number }>;
  const totalQuotaUsed = statusValues.reduce((sum, s) => sum + (s.quotaUsed || 0), 0);
  const totalQuotaMax = statusValues.reduce((sum, s) => sum + (s.quotaMax || 0), 0);
  const totalQuotaPercent = totalQuotaMax > 0 ? Math.min(100, Math.round((totalQuotaUsed / totalQuotaMax) * 100)) : 0;

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="space-y-4 text-center">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold font-mono uppercase tracking-wider">Accessing Vault Session...</p>
        </div>
      </div>
    );
  }

  if (!authedUser) {
    return (
      <AuthScreen 
        onAuthSuccess={(user: any) => setAuthedUser(user)} 
        onAddToast={triggerToast} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col antialiased">
      {/* Visual Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <img 
            src="https://past-aquamarine-opezzkg3.edgeone.app/logo%204%20(2).png" 
            alt="OmniCast Logo" 
            className="w-9 h-9 object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-black text-lg tracking-tight text-slate-900 block font-sans leading-none">OmniCast</span>
            <span className="hidden sm:block text-[10px] text-slate-400 font-bold tracking-wider mt-1">CROSS-PLATFORM API DISTRIBUTION</span>
          </div>
          <span className="hidden md:inline px-2 py-0.5 bg-slate-150 text-slate-600 text-[10px] uppercase tracking-widest font-extrabold rounded">
            v2.4.0
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {!hasGeminiKey && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs leading-none">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 animate-pulse" />
              <span>No Gemini Key Configured. Defaults enabled.</span>
            </div>
          )}

          <div className="hidden sm:flex -space-x-1.5">
            {accounts.map(a => (
              <img
                key={a.id}
                src={a.avatarUrl}
                alt={a.username}
                className={`w-7.5 h-7.5 rounded-full ring-2 ring-white object-cover ${a.connected ? "opacity-100" : "opacity-30"}`}
                title={`${a.platform}: ${a.username}`}
              />
            ))}
          </div>

          {authedUser && (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification icon */}
              <button 
                type="button" 
                onClick={() => {
                  setActivePage("notifications");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-1.5 sm:p-2 rounded-xl transition-all cursor-pointer relative ${
                  activePage === "notifications" 
                    ? "text-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-50/30" 
                    : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
              </button>

              {/* Theme toggle icon */}
              <button 
                type="button" 
                onClick={() => {
                  setDarkMode(!darkMode);
                  triggerToast(`Theme switched to ${!darkMode ? "Cosmic Dark" : "Premium Light"} mode`);
                }}
                className="p-1.5 sm:p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 animate-pulse-slow" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                )}
              </button>

              {/* Profile dropdown icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }}
                  className={`flex items-center gap-1.5 p-1 hover:bg-slate-55 border border-transparent hover:border-slate-200/60 rounded-xl transition-all cursor-pointer ${
                    activePage === "profile" || isProfileDropdownOpen 
                      ? "bg-indigo-50/50 border-indigo-200 ring-4 ring-indigo-50/50" 
                      : ""
                  }`}
                  title="View Profile dropdown"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm border-2 border-white shadow-xs overflow-hidden leading-none shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      alt="User Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="hidden sm:flex items-center gap-0.5 max-w-28 text-left">
                    {isProfileDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-scale-up text-left">
                      <div className="px-4 py-2.5 border-b border-slate-105">
                        <p className="text-xs text-slate-500 font-bold truncate">
                          {authedUser?.email || "user@example.com"}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActivePage("profile");
                            setIsProfileDropdownOpen(false);
                            triggerToast("Viewing Profile");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "profile" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <User className="w-4 h-4 text-slate-450" />
                          My Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setActivePage("invoices");
                            setIsProfileDropdownOpen(false);
                            triggerToast("Viewing Invoices");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "invoices" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-slate-450" />
                          Billing & Invoices
                        </button>

                        <button
                          onClick={() => {
                            setActivePage("history");
                            setIsProfileDropdownOpen(false);
                            triggerToast("Viewing Upload History");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "history" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <Clock className="w-4 h-4 text-slate-450" />
                          History
                        </button>

                        <button
                          onClick={() => {
                            setActivePage("queue_settings");
                            setIsProfileDropdownOpen(false);
                            triggerToast("Viewing Queue Settings");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "queue_settings" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-slate-450" />
                          Queue Settings
                        </button>

                        <button
                          onClick={() => {
                            setActivePage("connected_apps");
                            setIsProfileDropdownOpen(false);
                            triggerToast("Viewing Connected Access");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "connected_apps" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <Key className="w-4 h-4 text-slate-450" />
                          Connected Apps
                        </button>

                        <button
                          onClick={() => {
                            setActivePage("team_management");
                            setIsProfileDropdownOpen(false);
                            triggerToast("Viewing Team Management");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "team_management" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <Users className="w-4 h-4 text-slate-450" />
                          Team Management
                        </button>

                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setDocsTabOverride("helpdesk");
                            setActivePage("docs");
                            triggerToast("Opening Help Center...");
                          }}
                          className={`w-full px-4 py-2.5 hover:bg-slate-50 text-slate-705 text-xs font-bold flex items-center gap-2.5 transition-colors ${
                            activePage === "docs" && docsTabOverride === "helpdesk" ? "bg-indigo-50/50 text-indigo-700" : ""
                          }`}
                        >
                          <HelpCircle className="w-4 h-4 text-slate-450" />
                          Support
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Primary Tab Navigation */}
      <div className="hidden lg:block bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-1 scrollbar-none select-none">
            <button
              type="button"
              onClick={() => setActivePage("users")}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "users"
                  ? "border-indigo-600 text-indigo-750 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Users</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "users" ? "bg-indigo-100 text-indigo-700 font-extrabold" : "bg-slate-100 text-slate-500"
              }`}>
                {accounts.length ? `${accounts.length} Profiles` : "Profiles"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage("apikeys")}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "apikeys"
                  ? "border-indigo-600 text-indigo-750 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <Key className="w-4 h-4 text-indigo-500" />
              <span>API Keys</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "apikeys" ? "bg-indigo-100 text-indigo-700 font-extrabold" : "bg-slate-100 text-slate-500"
              }`}>
                Generate
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage("upload")}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "upload"
                  ? "border-blue-600 text-blue-700 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <Film className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>Upload</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "upload" ? "bg-blue-100 text-blue-700 font-extrabold" : "bg-slate-100 text-slate-500"
              }`}>
                Step {uploadStep}/3
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage("calendar")}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "calendar"
                  ? "border-emerald-600 text-emerald-700 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Calendar</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "calendar" ? "bg-emerald-100 text-emerald-700 font-extrabold" : "bg-slate-100 text-slate-500"
              }`}>
                {campaigns.length} Posts
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage("analytics")}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "analytics"
                  ? "border-indigo-600 text-indigo-750 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <LineChart className="w-4 h-4 text-indigo-505" />
              <span>Analytics</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "analytics" ? "bg-indigo-100 text-indigo-700 font-extrabold" : "bg-slate-100 text-slate-500"
              }`}>
                Live Stats
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePage("pricing")}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "pricing"
                  ? "border-indigo-650 text-indigo-800 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <DollarSign className="w-4 h-4 text-[#4F46E5]" />
              <span>Pricing</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "pricing" ? "bg-indigo-100 text-indigo-700 font-black animate-pulse" : "bg-slate-100 text-slate-500"
              }`}>
                Save 40%
              </span>
            </button>

            <button
              type="button"
              onClick={() => { 
                setDocsTabOverride(undefined);
                setActivePage("docs"); 
                triggerToast("Opening Documentation Hub..."); 
              }}
              className={`py-3 px-1 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activePage === "docs"
                  ? "border-indigo-600 text-indigo-750 font-extrabold"
                  : "border-transparent text-slate-455 hover:text-slate-700"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-505" />
              <span>Docs</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold font-sans ${
                activePage === "docs" ? "bg-indigo-100 text-indigo-700 font-extrabold" : "bg-slate-100 text-slate-500"
              }`}>
                Guides
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 pb-28 sm:p-6 sm:pb-12 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 overflow-x-hidden overflow-y-visible">
        
        {activePage === "users" ? (
          <div className="lg:col-span-12 space-y-8">
            <UserManagement 
              accounts={accounts}
              onAddToast={triggerToast}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ConnectedAccounts
                  accounts={accounts}
                  onToggleConnect={handleToggleConnect}
                  onUpdateUsername={handleUpdateUsername}
                  onRevokeOAuth={handleRevokeOAuth}
                />
              </div>
              <div className="lg:col-span-5">
                {/* Real-world API Distribution Bridge Guide */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm text-left" id="api-integration-bridge">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🔌 Core OAuth Distribution Bridge</h3>
                    <p className="text-[11px] text-slate-400">Configure global profile scopes and token handshakes</p>
                  </div>
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                    Social tokens are securely persistent in the client session. When token lifetimes expire, OmniCast schedules transparent OAuth handshakes via standard refresh grant types.
                  </p>
                  {/* Daily API budget stats */}
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2 text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Channel Dispatch Status</span>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-605">
                      <span>Aggregate Quotas Limit</span>
                      <span className="font-mono text-indigo-705 font-bold">{totalQuotaUsed} / {totalQuotaMax || 100} Reqs</span>
                    </div>
                    <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-600 h-1.5 rounded-full transition-all" style={{ width: `${totalQuotaPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activePage === "apikeys" ? (
          <div className="lg:col-span-12">
            <ApiKeyManagement 
              onAddToast={triggerToast}
            />
          </div>
        ) : activePage === "analytics" ? (
          <div className="lg:col-span-12">
            <AnalyticsView 
              onAddToast={triggerToast}
            />
          </div>
        ) : activePage === "pricing" ? (
          <div className="lg:col-span-12">
            <PricingView 
              onAddToast={triggerToast}
            />
          </div>
        ) : activePage === "calendar" ? (
          <div className="lg:col-span-12">
            <CalendarView 
              campaigns={campaigns}
              accounts={accounts}
              onAddToast={triggerToast}
              onNavigateToUpload={() => {
                setActivePage("upload");
                setUploadStep(1);
              }}
              libraryItems={libraryItems}
              onAddLibraryItem={(item) => setLibraryItems(prev => [item, ...prev])}
              onRemoveLibraryItem={(id) => {
                setLibraryItems(prev => prev.filter(item => item.id !== id));
                setPlatformAttachments(prev => {
                  const updated = { ...prev };
                  Object.keys(updated).forEach(k => {
                    if (updated[k]?.id === id) {
                      delete updated[k];
                    }
                  });
                  return updated;
                });
              }}
              platformAttachments={platformAttachments}
              setPlatformAttachments={setPlatformAttachments}
              onDeleteCampaign={(id) => {
                setCampaigns(prev => prev.filter(c => c.id !== id));
              }}
            />
          </div>
        ) : activePage === "docs" ? (
          <div className="lg:col-span-12" key={docsTabOverride || "docs-guides"}>
            <DocumentationView 
              onAddToast={triggerToast}
              onNavigatePage={(page: any) => {
                setActivePage(page);
              }}
              initialTab={docsTabOverride}
            />
          </div>
        ) : activePage === "profile" ? (
          <div className="lg:col-span-12">
            <ProfileView 
              userEmail={authedUser?.email || "user@example.com"}
              onLogout={async () => {
                try {
                  await logOutUser();
                  triggerToast("👋 Checked out of the OmniCast authorized cycle.");
                } catch (e) {
                  triggerToast("Could not complete logout handoff");
                }
              }}
              onAddToast={triggerToast}
              onNavigateToTab={(tab) => {
                setActivePage(tab);
              }}
            />
          </div>
        ) : activePage === "queue_settings" ? (
          <div className="lg:col-span-12">
            <QueueSettingsView 
              onAddToast={triggerToast}
              onBackToProfile={() => setActivePage("profile")}
            />
          </div>
        ) : activePage === "invoices" ? (
          <div className="lg:col-span-12">
            <BillingInvoicesView 
              onAddToast={triggerToast}
              onBackToProfile={() => setActivePage("profile")}
            />
          </div>
        ) : activePage === "connected_apps" ? (
          <div className="lg:col-span-12">
            <ConnectedAppsView 
              onAddToast={triggerToast}
              onBackToProfile={() => setActivePage("profile")}
            />
          </div>
        ) : activePage === "team_management" ? (
          <div className="lg:col-span-12">
            <TeamManagementView 
              onAddToast={triggerToast}
              onNavigateToPricing={() => setActivePage("pricing")}
              onBackToProfile={() => setActivePage("profile")}
            />
          </div>
        ) : activePage === "history" ? (
          <div className="lg:col-span-12">
            <UploadHistoryView 
              onAddToast={triggerToast}
              onBackToProfile={() => setActivePage("profile")}
              campaigns={campaigns}
            />
          </div>
        ) : activePage === "notifications" ? (
          <div className="lg:col-span-12">
            <NotificationsPage 
              onBack={() => {
                setActivePage("upload");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onSave={() => triggerToast("Preferences updated successfully")}
            />
          </div>
        ) : activePage === "privacy" ? (
          <div className="lg:col-span-12 text-left">
            <PrivacyPolicyPage onBack={() => {
              setActivePage("upload");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} />
          </div>
        ) : activePage === "terms" ? (
          <div className="lg:col-span-12 text-left">
            <TermsOfServicePage onBack={() => {
              setActivePage("upload");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} />
          </div>
        ) : (
          <>
            {/* Left Column: Form Editing, Accounts & Presets (7 cols) */}
            <div className="lg:col-span-7 space-y-6 overflow-visible pr-0 lg:pr-1">
          
          {/* Preset Picker Trigger Panel */}
          {activePage === "upload" && uploadStep === 1 && (
            <Presets selectedId={selectedPresetId} onSelect={handleSelectPreset} />
          )}

          {activePage === "connections" && (
            <>
              {/* Connected accounts manager */}
              <ConnectedAccounts
            accounts={accounts}
            onToggleConnect={handleToggleConnect}
            onUpdateUsername={handleUpdateUsername}
            onRevokeOAuth={handleRevokeOAuth}
          />

          {/* Real-world API Distribution Bridge Guide */}
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm" 
            id="api-integration-bridge"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🔌 Real API distribution bridge</h3>
                  <p className="text-[11px] text-slate-400">Configure OAuth Secrets and Platform Core Credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIntegrationBridge(!showIntegrationBridge)}
                className="px-2.5 py-1 text-[11px] font-bold border border-slate-250 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer transition-colors"
              >
                {showIntegrationBridge ? "Collapse Guide" : "Expand Developer Guide"}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showIntegrationBridge && (
                <motion.div
                  key="bridge-collapsible"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-4 text-xs">
                    <p className="text-slate-550 leading-relaxed text-[11px] bg-slate-50/50 p-3 border border-slate-200/60 rounded-xl">
                      Omni-Cast is configured with a live server-side module (<code className="bg-slate-150 px-1 py-0.2 rounded text-[10px] font-mono text-purple-700">/server/platforms.ts</code>) capable of executing real multi-part video uploads and status polling on platform clusters. Once credentials are live, the <strong>Distribute All</strong> trigger routes payloads directly to production targets.
                    </p>

                    {/* Daily API Budget Card */}
                    <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Activity className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div>
                            <span className="font-extrabold text-[10.5px] text-slate-800 tracking-wider uppercase block leading-tight">Daily API Quota Budget</span>
                            <span className="text-[9.5px] text-slate-450">Aggregate request density tracking across connected streams</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-black text-indigo-700 block leading-none">
                            {totalQuotaUsed} / {totalQuotaMax} Reqs
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-widest mt-0.5">
                            {totalQuotaPercent}% capacity filled
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${totalQuotaPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[8.5px] text-slate-450 leading-none">
                          <span>0 Reqs</span>
                          <span className="font-semibold text-slate-500">80% Soft Cap threshold active</span>
                          <span>{totalQuotaMax} Max</span>
                        </div>
                      </div>
                    </div>

                {/* Sub-tab selection grid */}
                <div className="grid grid-cols-4 gap-1.5 border-b border-slate-200/80 pb-0 shrink-0">
                  {(["youtube", "tiktok", "instagram", "facebook"] as const).map((tab) => {
                    const isSelected = integrationGuideTab === tab;
                    const isConnected = accounts.find((a) => a.platform === (tab === "youtube" ? "youtube_shorts" : tab))?.connected ?? false;
                    
                    const tabIcon = 
                      tab === "youtube" ? <Youtube className="w-3.5 h-3.5 text-rose-600 shrink-0" /> :
                      tab === "tiktok" ? <Music className="w-3.5 h-3.5 text-slate-700 shrink-0" /> :
                      tab === "instagram" ? <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" /> :
                      <Facebook className="w-3.5 h-3.5 text-blue-600 shrink-0" />;

                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setIntegrationGuideTab(tab)}
                        className={`py-2 text-[11px] font-bold capitalize transition-all duration-150 cursor-pointer text-center transform hover:scale-102 hover:shadow-xs flex items-center justify-center gap-1.5 border-b-2 ${
                          isSelected
                            ? "bg-indigo-50 shadow-inner border-indigo-500 text-indigo-700 font-extrabold rounded-t-lg"
                            : "bg-white border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50 hover:border-slate-300 rounded-lg"
                        }`}
                      >
                        {/* Status connection dot */}
                        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
                          {isConnected && isSelected && (
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                          )}
                          <span 
                            className={`relative inline-flex rounded-full h-1.5 w-1.5 border border-white ${
                              isConnected 
                                ? `bg-emerald-500 shadow-xs shadow-emerald-500/50 ${isSelected ? "animate-pulse" : ""}` 
                                : "bg-rose-500 shadow-xs"
                            }`}
                            title={isConnected ? "Authorized and Linked" : "Missing credentials"}
                          />
                        </span>
                        {tabIcon}
                        <span className="hidden sm:inline">{tab === "youtube" ? "YouTube" : tab === "tiktok" ? "TikTok" : tab === "instagram" ? "Instagram" : "Facebook"}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Sub-tab Content details */}
                <AnimatePresence mode="wait">
                  {integrationGuideTab === "youtube" && (
                    <motion.div
                      key="youtube"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-extrabold text-rose-800 text-[11px] uppercase tracking-wider">YouTube Data API v3 Setup Guide</span>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {healthStatus.youtube.status === "success" && healthStatus.youtube.connectedSince && (
                              <span className="text-[9px] font-bold font-mono text-emerald-700 bg-emerald-100/70 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 animate-fade-in shadow-xs">
                                <Clock className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                Connected: {healthStatus.youtube.connectedSince}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => runSingleHealthCheck("youtube")}
                              className="px-2 py-0.5 text-[9px] font-bold border border-rose-250 bg-white hover:bg-rose-50 text-rose-800 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 uppercase tracking-wider select-none shrink-0"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              Reset Connection
                            </button>
                            <span className="text-[9px] font-mono bg-rose-200/60 text-rose-800 px-1.5 py-0.5 rounded uppercase font-bold">Resumable Chunking</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                          <p><strong>1. Register in Google Cloud Console:</strong> Turn on the <strong>YouTube Data API v3</strong> for your cloud project instance.</p>
                          <p><strong>2. Setup Authorization Scopes:</strong> Request authorization with scope: <code className="bg-rose-100/60 px-1 font-mono text-[10px] text-rose-800">https://www.googleapis.com/auth/youtube.upload</code></p>
                          <p><strong>3. Endpoint Delivery Target:</strong> Initial authorization points to Google OAuth helper to fetch user access tokens before transfer.</p>
                        </div>

                        {/* Session Diagnostics Area */}
                        <div className="border-t border-rose-200/45 my-3 pt-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-rose-900 text-[10px] uppercase tracking-widest">Active Session Diagnostics</span>
                            <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${healthStatus.youtube.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                              Status: {healthStatus.youtube.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* API Rate Limit widget */}
                            <div className="bg-white/90 border border-rose-200/30 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">API Quota Rate Limit</span>
                                <span className="font-mono font-bold text-rose-700">
                                  {healthStatus.youtube.quotaMax - healthStatus.youtube.quotaUsed} / {healthStatus.youtube.quotaMax} remaining
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-rose-600 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${((healthStatus.youtube.quotaMax - healthStatus.youtube.quotaUsed) / healthStatus.youtube.quotaMax) * 100}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Remaining payload transactions allocated to this OAuth slot.
                              </p>
                            </div>

                            {/* Token Expiry Timer widget */}
                            <div className="bg-white/90 border border-rose-200/30 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between flex-wrap gap-1.5 text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">Token Expiry Countdown</span>
                                {healthStatus.youtube.status === "success" && healthStatus.youtube.expirySeconds !== undefined && (
                                  <button
                                    type="button"
                                    onClick={() => forceRefreshToken("youtube")}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest bg-rose-50 text-rose-850 border border-rose-250 hover:border-rose-450 rounded hover:bg-rose-100/70 active:scale-95 transition-all cursor-pointer select-none leading-none -my-1"
                                    title="Force OAuth Token Refresh"
                                  >
                                    <RefreshCw className="w-2 h-2" />
                                    Force Refresh
                                  </button>
                                )}
                                <span className="font-mono font-bold">
                                  {healthStatus.youtube.status === "success" && healthStatus.youtube.expirySeconds !== undefined ? (
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                      {Math.floor(healthStatus.youtube.expirySeconds / 60)}m {healthStatus.youtube.expirySeconds % 60}s
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium">No live token</span>
                                  )}
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-1000 ${healthStatus.youtube.status === "success" ? "bg-emerald-500" : "bg-slate-300"}`}
                                  style={{ 
                                    width: healthStatus.youtube.status === "success" && healthStatus.youtube.expirySeconds !== undefined 
                                      ? `${(healthStatus.youtube.expirySeconds / 3600) * 100}%` 
                                      : "0%" 
                                  }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Automatic token refresh triggers securely upon expiration.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-155 rounded-xl p-3 space-y-1.5 bg-slate-50/20">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Environment keys needed (.env)</p>
                        <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
{`# Google Cloud OAuth Credentials
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here`}
                        </pre>
                      </div>

                      <div className="text-[10px] text-slate-450 leading-normal bg-blue-50/45 p-2.5 border border-blue-101 rounded-lg">
                        💡 <strong>Shorts Index Integrity:</strong> YouTube automatically converts vertical videos under 60 seconds into YouTube Shorts if the metadata contains the <strong className="font-bold text-blue-900">#Shorts</strong> tag.
                      </div>
                    </motion.div>
                  )}

                  {integrationGuideTab === "tiktok" && (
                    <motion.div
                      key="tiktok"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      <div className="bg-[#FE2C55]/5 border border-[#FE2C55]/10 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-extrabold text-[#FE2C55] text-[11px] uppercase tracking-wider">TikTok For Developers Setup</span>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {healthStatus.tiktok.status === "success" && healthStatus.tiktok.connectedSince && (
                              <span className="text-[9px] font-bold font-mono text-emerald-700 bg-emerald-100/70 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 animate-fade-in shadow-xs">
                                <Clock className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                Connected: {healthStatus.tiktok.connectedSince}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => runSingleHealthCheck("tiktok")}
                              className="px-2 py-0.5 text-[9px] font-bold border border-[#FE2C55]/20 bg-white hover:bg-[#FE2C55]/5 text-[#FE2C55] rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 uppercase tracking-wider select-none shrink-0"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              Reset Connection
                            </button>
                            <span className="text-[9px] font-mono bg-[#FE2C55]/15 text-[#FE2C55] px-1.5 py-0.5 rounded uppercase font-bold">Content Posting API</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                          <p><strong>1. Register App Profile:</strong> Create a profile inside TikTok developer portal, under Web API Integration.</p>
                          <p><strong>2. OAuth Scope Request:</strong> Request approval for the permissions: <code className="bg-[#FE2C55]/10 px-1 font-mono text-[10px] text-[#FE2C55]">video.upload</code> and <code className="bg-[#FE2C55]/10 px-1 font-mono text-[10px] text-[#FE2C55]">video.publish</code>.</p>
                          <p><strong>3. Media Delivery Protocol:</strong> Direct post accepts a public URL stream (<code className="bg-slate-100 px-1 rounded font-mono text-[10px]">PULL_FROM_URL</code>) pointing to an AWS S3, Firebase Storage, or Cloud Storage bucket link.</p>
                        </div>

                        {/* Session Diagnostics Area */}
                        <div className="border-t border-[#FE2C55]/15 my-3 pt-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[#FE2C55] text-[10px] uppercase tracking-widest">Active Session Diagnostics</span>
                            <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${healthStatus.tiktok.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                              Status: {healthStatus.tiktok.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* API Rate Limit widget */}
                            <div className="bg-white/90 border border-[#FE2C55]/10 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">API Quota Rate Limit</span>
                                <span className="font-mono font-bold text-[#FE2C55]">
                                  {healthStatus.tiktok.quotaMax - healthStatus.tiktok.quotaUsed} / {healthStatus.tiktok.quotaMax} remaining
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-[#FE2C55] h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${((healthStatus.tiktok.quotaMax - healthStatus.tiktok.quotaUsed) / healthStatus.tiktok.quotaMax) * 100}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Remaining payload transactions allocated to this OAuth slot.
                              </p>
                            </div>

                            {/* Token Expiry Timer widget */}
                            <div className="bg-white/90 border border-[#FE2C55]/10 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between flex-wrap gap-1.5 text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">Token Expiry Countdown</span>
                                {healthStatus.tiktok.status === "success" && healthStatus.tiktok.expirySeconds !== undefined && (
                                  <button
                                    type="button"
                                    onClick={() => forceRefreshToken("tiktok")}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest bg-rose-50 border border-slate-200 text-[#FE2C55] rounded hover:bg-[#FE2C55]/5 active:scale-95 transition-all cursor-pointer select-none leading-none -my-1"
                                    title="Force OAuth Token Refresh"
                                  >
                                    <RefreshCw className="w-2 h-2" />
                                    Force Refresh
                                  </button>
                                )}
                                <span className="font-mono font-bold">
                                  {healthStatus.tiktok.status === "success" && healthStatus.tiktok.expirySeconds !== undefined ? (
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                      {Math.floor(healthStatus.tiktok.expirySeconds / 60)}m {healthStatus.tiktok.expirySeconds % 60}s
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium">No live token</span>
                                  )}
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-1000 ${healthStatus.tiktok.status === "success" ? "bg-emerald-500" : "bg-slate-300"}`}
                                  style={{ 
                                    width: healthStatus.tiktok.status === "success" && healthStatus.tiktok.expirySeconds !== undefined 
                                      ? `${(healthStatus.tiktok.expirySeconds / 3600) * 100}%` 
                                      : "0%" 
                                  }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Automatic token refresh triggers securely upon expiration.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-155 rounded-xl p-3 space-y-2 bg-slate-50/20">
                        <p className="text-[10px] uppercase font-bold text-slate-400">TikTok developer keys (.env)</p>
                        <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
{`# TikTok Content Posting Integration Keys
TIKTOK_CLIENT_KEY=your_tiktok_client_key_here
TIKTOK_SECRET=your_tiktok_secret_here`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {integrationGuideTab === "instagram" && (
                    <motion.div
                      key="instagram"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-extrabold text-pink-800 text-[11px] uppercase tracking-wider">Meta Graph API - Instagram Reels</span>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {healthStatus.instagram.status === "success" && healthStatus.instagram.connectedSince && (
                              <span className="text-[9px] font-bold font-mono text-emerald-700 bg-emerald-100/70 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 animate-fade-in shadow-xs">
                                <Clock className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                Connected: {healthStatus.instagram.connectedSince}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => runSingleHealthCheck("instagram")}
                              className="px-2 py-0.5 text-[9px] font-bold border border-pink-250 bg-white hover:bg-pink-50 text-pink-850 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 uppercase tracking-wider select-none shrink-0"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              Reset Connection
                            </button>
                            <span className="text-[9px] font-mono bg-pink-150 text-pink-800 px-1.5 py-0.5 rounded uppercase font-bold">Two-Phase Container</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                          <p><strong>1. Meta Business Suite Link:</strong> Connect your Instagram Creator / Business profile to a Facebook Page.</p>
                          <p><strong>2. Scope Validation:</strong> Authenticate users using Meta Login requesting: <code className="bg-pink-100/60 px-1 font-mono text-[10px] text-pink-800">instagram_content_publish</code> and <code className="bg-pink-100/60 px-1 font-mono text-[10px] text-pink-800">pages_read_engagement</code>.</p>
                          <p><strong>3. Media Processing:</strong> Video files are cached first as an IG container, processed asynchronously, then pushed live when status reports <code className="bg-slate-100 font-mono text-purple-700 text-[10px]">FINISHED</code>.</p>
                        </div>

                        {/* Session Diagnostics Area */}
                        <div className="border-t border-pink-200/45 my-3 pt-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-pink-900 text-[10px] uppercase tracking-widest">Active Session Diagnostics</span>
                            <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${healthStatus.instagram.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                              Status: {healthStatus.instagram.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* API Rate Limit widget */}
                            <div className="bg-white/90 border border-pink-200/30 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">API Quota Rate Limit</span>
                                <span className="font-mono font-bold text-pink-700">
                                  {healthStatus.instagram.quotaMax - healthStatus.instagram.quotaUsed} / {healthStatus.instagram.quotaMax} remaining
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-pink-500 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${((healthStatus.instagram.quotaMax - healthStatus.instagram.quotaUsed) / healthStatus.instagram.quotaMax) * 100}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Remaining payload transactions allocated to this OAuth slot.
                              </p>
                            </div>

                            {/* Token Expiry Timer widget */}
                            <div className="bg-white/90 border border-pink-200/30 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between flex-wrap gap-1.5 text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">Token Expiry Countdown</span>
                                {healthStatus.instagram.status === "success" && healthStatus.instagram.expirySeconds !== undefined && (
                                  <button
                                    type="button"
                                    onClick={() => forceRefreshToken("instagram")}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest bg-rose-50 border border-pink-200 text-pink-700 rounded hover:bg-pink-100/70 active:scale-95 transition-all cursor-pointer select-none leading-none -my-1"
                                    title="Force OAuth Token Refresh"
                                  >
                                    <RefreshCw className="w-2 h-2" />
                                    Force Refresh
                                  </button>
                                )}
                                <span className="font-mono font-bold">
                                  {healthStatus.instagram.status === "success" && healthStatus.instagram.expirySeconds !== undefined ? (
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                      {Math.floor(healthStatus.instagram.expirySeconds / 60)}m {healthStatus.instagram.expirySeconds % 60}s
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium">No live token</span>
                                  )}
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-1000 ${healthStatus.instagram.status === "success" ? "bg-emerald-500" : "bg-slate-300"}`}
                                  style={{ 
                                    width: healthStatus.instagram.status === "success" && healthStatus.instagram.expirySeconds !== undefined 
                                      ? `${(healthStatus.instagram.expirySeconds / 3600) * 100}%` 
                                      : "0%" 
                                  }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-455 leading-tight">
                                Automatic token refresh triggers securely upon expiration.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-155 rounded-xl p-3 space-y-2 bg-slate-50/20">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Meta/Instagram App Keys (.env)</p>
                        <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
{`# Meta developer credential credential
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {integrationGuideTab === "facebook" && (
                    <motion.div
                      key="facebook"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3.5"
                    >
                      <div className="bg-blue-50/60 border border-blue-105 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-extrabold text-blue-800 text-[11px] uppercase tracking-wider">Facebook Page Video Reels API</span>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {healthStatus.facebook.status === "success" && healthStatus.facebook.connectedSince && (
                              <span className="text-[9px] font-bold font-mono text-emerald-700 bg-emerald-100/70 border border-emerald-200/50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 animate-fade-in shadow-xs">
                                <Clock className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                Connected: {healthStatus.facebook.connectedSince}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => runSingleHealthCheck("facebook")}
                              className="px-2 py-0.5 text-[9px] font-bold border border-blue-200 bg-white hover:bg-blue-50 text-blue-850 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 uppercase tracking-wider select-none shrink-0"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              Reset Connection
                            </button>
                            <span className="text-[9px] font-mono bg-blue-150 text-blue-800 px-1.5 py-0.5 rounded uppercase font-bold">Pages Publishing</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                          <p><strong>1. Page Scopes:</strong> Ensure your user access token possesses <code className="bg-blue-100/60 px-1 font-mono text-[10px] text-blue-800">pages_manage_posts</code> and <code className="bg-blue-100/60 px-1 font-mono text-[10px] text-blue-800">publish_video</code>.</p>
                          <p><strong>2. Segmented Upload Phase:</strong> Multi-part protocol allows uploading chunks of large MP4 binaries directly to Facebook CDN edge networks.</p>
                        </div>

                        {/* Session Diagnostics Area */}
                        <div className="border-t border-blue-200/45 my-3 pt-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-blue-900 text-[10px] uppercase tracking-widest">Active Session Diagnostics</span>
                            <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${healthStatus.facebook.status === "success" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                              Status: {healthStatus.facebook.status.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* API Rate Limit widget */}
                            <div className="bg-white/90 border border-blue-200/30 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">API Quota Rate Limit</span>
                                <span className="font-mono font-bold text-blue-700">
                                  {healthStatus.facebook.quotaMax - healthStatus.facebook.quotaUsed} / {healthStatus.facebook.quotaMax} remaining
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: `${((healthStatus.facebook.quotaMax - healthStatus.facebook.quotaUsed) / healthStatus.facebook.quotaMax) * 100}%` }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Remaining payload transactions allocated to this OAuth slot.
                              </p>
                            </div>

                            {/* Token Expiry Timer widget */}
                            <div className="bg-white/90 border border-blue-200/30 rounded-xl p-2.5 space-y-1.5 shadow-2xs">
                              <div className="flex items-center justify-between flex-wrap gap-1.5 text-[10px]">
                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[8px]">Token Expiry Countdown</span>
                                {healthStatus.facebook.status === "success" && healthStatus.facebook.expirySeconds !== undefined && (
                                  <button
                                    type="button"
                                    onClick={() => forceRefreshToken("facebook")}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest bg-rose-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100/70 active:scale-95 transition-all cursor-pointer select-none leading-none -my-1"
                                    title="Force OAuth Token Refresh"
                                  >
                                    <RefreshCw className="w-2 h-2" />
                                    Force Refresh
                                  </button>
                                )}
                                <span className="font-mono font-bold">
                                  {healthStatus.facebook.status === "success" && healthStatus.facebook.expirySeconds !== undefined ? (
                                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                      {Math.floor(healthStatus.facebook.expirySeconds / 60)}m {healthStatus.facebook.expirySeconds % 60}s
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 font-medium">No live token</span>
                                  )}
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-1.5 rounded-full transition-all duration-1000 ${healthStatus.facebook.status === "success" ? "bg-emerald-500" : "bg-slate-300"}`}
                                  style={{ 
                                    width: healthStatus.facebook.status === "success" && healthStatus.facebook.expirySeconds !== undefined 
                                      ? `${(healthStatus.facebook.expirySeconds / 3600) * 100}%` 
                                      : "0%" 
                                  }}
                                />
                              </div>
                              <p className="text-[9px] text-slate-450 leading-tight">
                                Automatic token refresh triggers securely upon expiration.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-155 rounded-xl p-3 space-y-2 bg-slate-50/20">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Meta/Facebook App Keys (.env)</p>
                        <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
{`# Shares keys with Meta Instagram suite
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here`}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Simulated Health Check section */}
                <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/45 p-3.5 rounded-xl border border-indigo-100/80">
                  <div className="space-y-0.5">
                    <h4 className="text-[11px] font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                      <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isPinging ? "animate-spin" : ""}`} />
                      Cross-Platform API Health
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Initiate secure gateway diagnostics on production endpoints.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={runHealthCheck}
                    disabled={isPinging}
                    className="px-3.5 py-1.5 text-[10px] font-extrabold border border-indigo-200 bg-white text-indigo-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 hover:border-indigo-300 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0 select-none cursor-pointer uppercase tracking-wider shadow-xs"
                  >
                    {isPinging ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Pinging Gateways...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-indigo-700" />
                        Run Health Check
                      </>
                    )}
                  </button>
                </div>

                {/* Health Check Results Deck */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pb-1">
                  {(["youtube", "tiktok", "instagram", "facebook"] as const).map((plat) => {
                    const hResult = healthStatus[plat];
                    const isTabActive = integrationGuideTab === plat;
                    return (
                      <div 
                        key={plat} 
                        className={`p-2.5 rounded-xl border transition-all duration-150 flex flex-col justify-between space-y-1.5 ${
                          isTabActive 
                            ? "border-indigo-200 bg-indigo-50/30 shadow-xs" 
                            : "border-slate-200/80 bg-white/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold capitalize text-slate-700 font-mono flex items-center gap-1">
                            {plat === "youtube" ? "YouTube" : plat}
                            {isTabActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" title="Selected Tab" />}
                          </span>
                          {hResult.status === "success" && (
                            <span className="text-[9px] bg-emerald-50 border border-emerald-150 text-emerald-700 px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-widest leading-none">
                              Online
                            </span>
                          )}
                          {hResult.status === "failure" && (
                            <span className="text-[9px] bg-rose-50 border border-rose-150 text-rose-700 px-1.5 py-0.2 rounded-md font-extrabold uppercase tracking-widest leading-none">
                              Friction
                            </span>
                          )}
                          {hResult.status === "unchecked" && (
                            <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.2 rounded-md font-bold uppercase tracking-widest leading-none">
                              Pending
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] leading-snug text-slate-500 font-medium">
                          {hResult.message}
                        </p>
                        {hResult.ping !== undefined && (
                          <div className="text-[8.5px] font-mono text-emerald-600 font-bold flex items-center gap-1 pt-0.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            Latency: {hResult.ping}ms
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
            </>
          )}

          {/* Form Content Editor */}
          {activePage === "upload" && (uploadStep === 1 || uploadStep === 2) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-5 shadow-xs relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {uploadStep === 1 ? "Step 1: Vertical Clip Attachment" : "Step 2: Video Metadata Hub"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-0.5">
                    <p className="text-xs text-slate-400">
                      {uploadStep === 1 ? "Import your vertical assets for cross-posting" : "Write raw values for translation & refinement"}
                    </p>
                    {uploadStep === 2 && lastSaved && (
                      <span id="autosave-indicator" className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-150 px-1.5 py-0.5 rounded font-bold select-none shrink-0">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        Saved {lastSaved}
                      </span>
                    )}
                    {uploadStep === 2 && (
                      <>
                        <span className="inline-flex items-center gap-1 text-[9.5px] text-slate-500 bg-slate-50/50 border border-slate-200 px-1.5 py-0.5 rounded select-none font-medium shrink-0">
                          <kbd className="font-mono text-[8.5px] bg-white border border-slate-250 px-1 rounded shadow-[0_1px_0_rgba(148,163,184,0.15)] font-bold text-slate-600">Ctrl+S</kbd> Save Draft
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9.5px] text-slate-500 bg-slate-50/50 border border-slate-200 px-1.5 py-0.5 rounded select-none font-medium shrink-0">
                          <kbd className="font-mono text-[8.5px] bg-white border border-slate-250 px-1 rounded shadow-[0_1px_0_rgba(148,163,184,0.15)] font-bold text-slate-600">Ctrl+Enter</kbd> Distribute All
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {uploadStep === 2 && (
                  <button
                    type="button"
                    onClick={handleOptimizeAPI}
                    disabled={isOptimizing || (!title.trim() && !description.trim())}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isOptimizing
                        ? "bg-slate-100 text-slate-400"
                        : "bg-blue-50/85 hover:bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? "animate-spin" : "text-blue-600"}`} />
                    {isOptimizing ? "Optimizing..." : "Optimize with AI"}
                  </button>
                )}
              </div>

            {uploadStep === 2 && (
              <>
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Working Broadcast Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive raw title..."
                    className="w-full text-base font-bold text-slate-800 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Raw Post Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Feed raw context, calls to action, or notes to translate into specific platform cultures..."
                    className="w-full text-sm text-slate-600 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Reference Hashtags */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Reference Hashtags (comma-separated list)
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="ai, design, marketing, coding"
                    className="w-full text-xs font-mono text-blue-600 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Micro Thumbnail summary helper for Step 2 */}
                {videoFile && (
                  <div className="p-3 bg-indigo-50/20 border border-indigo-150 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-10 bg-slate-100 border border-slate-200 rounded overflow-hidden relative shrink-0">
                        {videoFile.thumbnail ? (
                          <img src={videoFile.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-4 h-4 text-slate-405 m-auto" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-indigo-950 block truncate">Attached clip: {videoFile.name}</span>
                        <span className="text-[10px] text-slate-500 block block font-mono font-semibold">{videoFile.size} • parsed securely</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadStep(1)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-white text-indigo-750 border border-indigo-200 rounded-lg hover:bg-indigo-50 cursor-pointer select-none whitespace-nowrap"
                    >
                      Change Media
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Video File Drag-and-Drop Slot (Guideline Compliant!) */}
            {uploadStep === 1 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Linked Media Attachment
                </span>
              
              {videoFile ? (
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-14 bg-slate-200 rounded-lg overflow-hidden relative shrink-0 border border-slate-300 flex items-center justify-center">
                        {videoFile.thumbnail ? (
                          <img src={videoFile.thumbnail} alt="Media thumbnail preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-250">
                            {videoFile.type === 'image' ? (
                              <FileImage className="w-5 h-5 text-slate-400" />
                            ) : (
                              <FileVideo className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        )}
                        {videoFile.type !== 'image' && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{videoFile.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-wider">{videoFile.size} • parsed securely</p>
                      </div>
                    </div>
                    <button
                      onClick={clearVideo}
                      className="p-1.5 hover:bg-rose-50 border border-slate-200 rounded-lg text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Clear attachments"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thumbnail / Cover Frame Custom Upload slot */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      Thumbnail / Core Cover Frame
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        id="custom-thumbnail-file-uploader"
                        type="file"
                        accept=".jpeg,.jpg,.png,.webp,.gif"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const file = e.target.files[0];
                            const link = URL.createObjectURL(file);
                            setVideoFile(prev => prev ? { ...prev, thumbnail: link } : null);
                            triggerToast(`Custom Cover Frame linked perfectly: ${file.name}`);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('custom-thumbnail-file-uploader')?.click()}
                        className="px-2.5 py-1 text-[9px] font-bold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 rounded-lg transition-all transform hover:scale-102 cursor-pointer uppercase tracking-wider"
                      >
                        Upload Custom Cover Frame
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/30"
                      : "border-slate-300/80 bg-slate-50/30 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.mov,.mkv,.avi,.wmv,.webm,.3gp,.jpeg,.jpg,.png,.webp,.gif,.bmp,.svg,.eps,.tiff"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Drag and drop raw video or image here, or click to browse</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 uppercase leading-relaxed font-semibold max-w-sm">
                    Videos: MP4, MOV, MKV, AVI, WMV, WebM, 3GP<br/>
                    Images: JPG, PNG, WebP, GIF, BMP, SVG, EPS, TIFF
                  </p>
                </div>
              )}
              
              {videoFile && videoFile.type === 'video' && typeof videoFile.duration === 'number' && (
                <div className="mt-3.5 bg-slate-50 border border-slate-250/70 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
                        Platform Duration Validation Check
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Parsed length:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono ${
                        videoFile.duration > 60 
                          ? "bg-amber-100 text-amber-800 border border-amber-200" 
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}>
                        {Math.round(videoFile.duration)}s
                      </span>
                    </div>
                  </div>

                  {videoFile.duration > 60 ? (
                    <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3 flex gap-2.5 items-start">
                      <AlertCircle className="w-4.5 h-4.5 text-amber-600 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-amber-900 leading-none block">
                          Video status alert: length exceeds 60 seconds
                        </span>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Your attached video exceeds 60 seconds. Review platform specific limitations & validation policies below to ensure compliant layout delivery.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/30 border border-emerald-150/60 rounded-lg p-3 flex gap-2.5 items-start">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-900 leading-none block">
                          Optimal video length under 60s
                        </span>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Your video is short-form compliant for all standard cross-publishing slots to maximize recommendation algorithms.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* YouTube Shorts */}
                    <div className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-colors ${
                      videoFile.duration > 60 
                        ? (videoFile.duration > 180 ? "bg-rose-50/40 border-rose-200 text-rose-950" : "bg-amber-50/30 border-amber-150 text-amber-950")
                        : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>YouTube Shorts</span>
                        <span className="text-[9px] font-bold font-mono px-1 bg-slate-100 rounded text-slate-500">Max 3m (180s)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        {videoFile.duration > 180 
                          ? "❌ Rejected: Exceeds final YouTube Shorts 3-minute cap." 
                          : videoFile.duration > 60 
                            ? "⚠️ Warning: Exceeds standard 60s Shorts recommendation. Might post as standard video." 
                            : "✓ Safe: Fully compliant with Shorts feed standard."}
                      </p>
                    </div>

                    {/* Facebook Reels */}
                    <div className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-colors ${
                      videoFile.duration > 90 
                        ? "bg-rose-50/40 border-rose-200 text-rose-950" 
                        : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>Facebook Reels</span>
                        <span className="text-[9px] font-bold font-mono px-1 bg-slate-100 rounded text-slate-500">Max 90s</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        {videoFile.duration > 90 
                          ? "❌ Rejected: Transformed video exceeds strict Facebook Reels 90s limit." 
                          : "✓ Safe: Within safe Facebook Reels bounds."}
                      </p>
                    </div>

                    {/* Instagram Reels */}
                    <div className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-colors ${
                      videoFile.duration > 1200 
                        ? "bg-rose-50/40 border-rose-200 text-rose-950" 
                        : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>Instagram Reels</span>
                        <span className="text-[9px] font-bold font-mono px-1 bg-slate-100 rounded text-slate-500">Max 20m (1200s)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        {videoFile.duration > 1200 
                          ? "❌ Rejected: Video exceeds Instagram Reels 20-minute cap." 
                          : "✓ Safe: Compliant (3m in-app direct, up to 20m pre-recorded upload file)."}
                      </p>
                    </div>

                    {/* TikTok uploads */}
                    <div className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-colors ${
                      videoFile.duration > 3600 
                        ? "bg-rose-50/40 border-rose-200 text-rose-950" 
                        : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      <div className="font-bold flex items-center justify-between">
                        <span>TikTok Uploads</span>
                        <span className="text-[9px] font-bold font-mono px-1 bg-slate-100 rounded text-slate-500">Max 60m (3600s)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                        {videoFile.duration > 3600 
                          ? "❌ Rejected: Exceeds TikTok 60-minute maximum upload threshold." 
                          : "✓ Safe: Compliant (10m in-app direct, up to 60m upload video file)."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/60 flex flex-col gap-2 text-[10px] text-slate-500">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Simulate Durations to Verify Alerts:</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="10" 
                          max="3800" 
                          value={Math.round(videoFile.duration) > 3800 ? 3800 : Math.round(videoFile.duration)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setVideoFile(prev => prev ? { ...prev, duration: val } : null);
                          }}
                          className="w-24 bg-slate-200 rounded-lg appearance-none cursor-pointer h-1 accent-indigo-600"
                        />
                        <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-indigo-600 font-bold">
                          {Math.round(videoFile.duration || 0) >= 60 
                            ? `${Math.floor((videoFile.duration || 0) / 60)}m ${Math.round((videoFile.duration || 0) % 60)}s` 
                            : `${Math.round(videoFile.duration || 0)}s`}
                        </span>
                      </div>
                    </div>
                    
                    {/* Simulation Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-400 font-semibold">Presets:</span>
                      <button 
                        type="button" 
                        onClick={() => setVideoFile(prev => prev ? { ...prev, duration: 15 } : null)} 
                        className={`px-1.5 py-0.5 border rounded font-mono text-[9px] cursor-pointer transition-colors ${
                          videoFile.duration === 15 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        15s
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setVideoFile(prev => prev ? { ...prev, duration: 85 } : null)} 
                        className={`px-1.5 py-0.5 border rounded font-mono text-[9px] cursor-pointer transition-colors ${
                          videoFile.duration === 85 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        85s (Reels Safe)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setVideoFile(prev => prev ? { ...prev, duration: 175 } : null)} 
                        className={`px-1.5 py-0.5 border rounded font-mono text-[9px] cursor-pointer transition-colors ${
                          videoFile.duration === 175 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        2.9m (Shorts Max)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setVideoFile(prev => prev ? { ...prev, duration: 1100 } : null)} 
                        className={`px-1.5 py-0.5 border rounded font-mono text-[9px] cursor-pointer transition-colors ${
                          videoFile.duration === 1100 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        18m (Reels Upload)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setVideoFile(prev => prev ? { ...prev, duration: 3500 } : null)} 
                        className={`px-1.5 py-0.5 border rounded font-mono text-[9px] cursor-pointer transition-colors ${
                          videoFile.duration === 3500 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        58m (TikTok Upload)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setVideoFile(prev => prev ? { ...prev, duration: 3700 } : null)} 
                        className={`px-1.5 py-0.5 border rounded font-mono text-[9px] cursor-pointer transition-colors ${
                          videoFile.duration === 3700 ? "bg-indigo-600 border-indigo-600 text-white font-bold" : "bg-white border-slate-200 hover:border-indigo-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        61m (Over Limit)
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            )}
            </div>
          )}

          {/* Advanced Media Library & Multi-Clip Router */}
          {activePage === "content" && (
            <>
              <MediaLibrary
            accounts={accounts}
            attachments={platformAttachments}
            onUpdateAttachments={setPlatformAttachments}
            libraryItems={libraryItems}
            onAddLibraryItem={(item) => setLibraryItems(prev => [item, ...prev])}
            onRemoveLibraryItem={(id) => {
              setLibraryItems(prev => prev.filter(item => item.id !== id));
              setPlatformAttachments(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(k => {
                  if (updated[k]?.id === id) {
                    delete updated[k];
                  }
                });
                return updated;
              });
            }}
          />

              {/* Informative Warning box */}
              <div className="bg-blue-600/5 border border-blue-105 rounded-xl p-4 flex items-start space-x-3.5 shadow-xs">
                <div className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold tracking-tight italic select-none">
                  i
                </div>
                <div className="text-xs text-blue-900 leading-relaxed font-sans">
                  <strong>Optimization rule in progress:</strong> Captions, spacer layouts, and hashtags automatically comply with maximum characters (YouTube Shorts: 100 on Title, Instagram Reels: 2,200, Facebook: 2,000, TikTok: 2,200 characters) upon AI injection. Use the tabs on the right to edit individual channels before distribution.
                </div>
              </div>
            </>
          )}

          {/* Step 3: Publishing Summary Checklist */}
          {activePage === "upload" && uploadStep === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-5 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-pulse" />
                  Broadcast Checklist Summary
                </h3>
                <p className="text-xs text-slate-400">Review your final vertical distribution specifications prior to finalization.</p>
              </div>

              {videoFile && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-slate-200 border border-slate-300 rounded-lg overflow-hidden relative shrink-0">
                      {videoFile.thumbnail ? (
                        <img src={videoFile.thumbnail} alt="Active cover frame" className="w-full h-full object-cover" />
                      ) : (
                        <Film className="w-6 h-6 m-auto mt-7 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-xs font-bold text-slate-800 block truncate leading-tight">{videoFile.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono font-semibold">Size: {videoFile.size}</span>
                      <span className="text-[10px] text-slate-405 block font-mono font-semibold">Trimmed Duration: {Math.round(videoFile.duration)} seconds</span>
                      <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-50 text-indigo-750 font-sans tracking-wider">
                        Strategy: {publishStrategy === "now" ? "INSTANT DISPATCH" : "SCHEDULED IN QUEUE"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Output Connection Pipeline</span>
                <div className="space-y-2">
                  {accounts.map(acc => {
                    const isConnected = acc.connected;
                    return (
                      <div key={acc.id} className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg bg-slate-50/20 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <img src={acc.avatarUrl} alt={acc.username} className="w-6 h-6 rounded-full ring-1 ring-slate-200 object-cover" />
                          <div>
                            <span className="font-extrabold text-[11px] block text-slate-800 uppercase">{acc.platform.replace("_shorts", "").toUpperCase()}</span>
                            <span className="text-[9.5px] text-slate-450 font-mono">{isConnected ? acc.username : "Connection inactive"}</span>
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-black ${
                          isConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"
                        }`}>
                          {isConnected ? "PIPELINE_READY" : "BYPASSED"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Output Captions & Active Previews (5 cols) */}
        <div className="lg:col-span-12 lg:col-span-5 space-y-6 flex flex-col justify-start">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              {activePage === "upload" && `Step ${uploadStep}: Live Controls`}
            </h2>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">
                {activePage === "upload" && uploadStep === 3 ? "Real-time sync render" : "System Monitored"}
              </span>
            </div>
          </div>

          {/* CONNECTIONS Right Column: Daily API Budget and Quotas */}
          {activePage === "connections" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Daily API Quotas & Budget</h3>
                    <p className="text-xs text-slate-400">Total requests across connected API networks</p>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-slate-50 border border-slate-200 rounded text-indigo-600">
                    24H CYCLE
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Progress bar representing aggregated requests */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                      <span>Aggregate Quota Load</span>
                      <span className="font-mono text-indigo-700 font-bold">42% (42/100 requests)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: "42%" }} />
                    </div>
                  </div>

                  {/* Individual API statuses */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">TikTok API</span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">12 / 30</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Instagram API</span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">18 / 30</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Facebook API</span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">8 / 20</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">YouTube API</span>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">4 / 20</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Diagnostics summary */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sync & Token Status</h3>
                </div>
                <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Automatic Silent Token Refresh:</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono text-[10px] font-black">ACTIVE (&lt; 300s)</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Your social tokens are verified automatically in real-time. If any expiration timer falls below 300 seconds, a silent token exchange request executes instantly and triggers a fleeting toast notification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT Right Column: Statistics & Highlights */}
          {activePage === "content" && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Broadcasting Statistics</h3>
                  <p className="text-xs text-slate-400">Performance overview for currently saved campaigns</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1 flex flex-col justify-between">
                    <span className="text-slate-500 font-medium">Delivered Posts</span>
                    <span className="text-2xl font-extrabold text-slate-800 leading-tight">
                      {campaigns.filter(c => c.status !== "queued").length}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-1 flex flex-col justify-between">
                    <span className="text-slate-500 font-medium">Scheduled Queue</span>
                    <span className="text-xl font-extrabold text-amber-600 leading-tight">
                      {campaigns.filter(c => c.status === "queued").length} Scheduled
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-400 leading-relaxed font-sans">
                  The distribution engine stores scheduled posts in the active local storage dispatcher. When the timer matches, the publication transmits to your API endpoints instantly.
                </div>
              </div>

              {/* Tips card */}
              <div className="bg-indigo-900 border border-indigo-950 text-indigo-50 rounded-2xl p-5 lg:p-6 shadow-md relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-800/40 rounded-full blur-xl" />
                <h4 className="font-extrabold text-xs uppercase tracking-widest text-indigo-200 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  SaaS Dispatch Pro-Tip
                </h4>
                <p className="text-xs text-indigo-100 leading-relaxed font-sans font-medium">
                  Vertical cross-posting thrives on dynamic cover curation. Select dedicated high-retention thumbnail frames during Step 3 of the editor wizard for optimized performance.
                </p>
              </div>
            </div>
          )}

          {/* EDITOR Step 1 Right Column: Next Step Guidance */}
          {activePage === "upload" && uploadStep === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm space-y-5 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-1">
                <Film className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-[280px]">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Upload Video Media</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Import any vertical video (MP4/WebM) via drag-and-drop on the left, or pick one of our fast templates above.
                </p>
              </div>

              {videoFile ? (
                <div className="pt-4 w-full max-w-sm space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-left text-xs flex gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
                    <div>
                      <span className="font-extrabold text-emerald-950 block">Media Verified Successfully!</span>
                      <p className="text-[10px] text-emerald-700 leading-normal mt-0.5">
                        Duration is {Math.round(videoFile.duration)}s. Click the button below to fill in details.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUploadStep(2)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    Configure Details & Schedule
                    <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl w-full max-w-xs text-xs text-indigo-900 border-indigo-100 bg-indigo-50/20 text-center font-bold">
                  ⚠️ Waiting for media file attachment...
                </div>
              )}
            </div>
          )}

          {/* EDITOR Step 2 Right Column: Posting Strategy Curation */}
          {activePage === "upload" && uploadStep === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 shadow-sm space-y-5 font-sans">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans">Configure Post Strategy</h3>
                <p className="text-xs text-slate-400">Decide when or if you want to publish immediately or delay queue slot.</p>
              </div>

              {/* Strategy selectors */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPublishStrategy("now")}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    publishStrategy === "now"
                      ? "bg-indigo-50/15 border-indigo-600 ring-2 ring-indigo-100"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800">
                    <Sparkles className={`w-4 h-4 ${publishStrategy === "now" ? "text-indigo-600" : "text-slate-500"}`} />
                    <span className="text-xs font-bold">Publish Now</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400 leading-relaxed">Broadcast to your channels immediately.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublishStrategy("later")}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    publishStrategy === "later"
                      ? "bg-indigo-50/15 border-indigo-600 ring-2 ring-indigo-100"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-slate-800">
                    <Calendar className={`w-4 h-4 ${publishStrategy === "later" ? "text-indigo-600" : "text-slate-500"}`} />
                    <span className="text-xs font-bold font-sans">Schedule for Later</span>
                  </div>
                  <span className="text-[9.5px] text-slate-400 leading-relaxed">Time-lock the cross-post queue for future.</span>
                </button>
              </div>

              {/* Datetime Pickers inside Column */}
              {publishStrategy === "later" && (
                <div className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: "12s" }} />
                    Specify Queue Release Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full text-xs font-bold text-slate-850 text-slate-800 bg-white border border-slate-350 rounded-lg p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono mt-1">
                    <span>Timezone: Local system</span>
                    {scheduledDateTime && (
                      <span className="text-indigo-600 font-bold">
                        Target: {new Date(scheduledDateTime).toLocaleDateString()} {new Date(scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step Navigation Button to Proceed */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadStep(1)}
                  className="px-3 py-2 text-xs font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-slate-600 transition-all cursor-pointer select-none whitespace-nowrap"
                >
                  ← Back to Step 1
                </button>
                <button
                  type="button"
                  onClick={() => setUploadStep(3)}
                  disabled={!title.trim()}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5"
                >
                  Step 3: Custom Content
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Social Platform Previews Card */}
          {activePage === "upload" && uploadStep === 3 && (
            <>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col min-h-[480px]">
            
            {/* Horizontal Platform Selectors */}
            <div className="flex border-b border-slate-100 pb-2.5 mb-4 gap-1 overflow-x-auto">
              {(["tiktok", "instagram", "facebook", "youtube_shorts"] as const).map((platform) => {
                const isSelected = activePlatformPreview === platform;
                const platformLabel = platform === "youtube_shorts" ? "YouTube Shorts" : platform.toUpperCase();
                const isEnabled = accounts.find(a => a.platform === platform)?.connected ?? false;

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setActivePlatformPreview(platform)}
                    className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {platformLabel}
                      {isEnabled ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      )}
                    </span>
                  </button>
                );
              })}

              <button
                key="bulk_edit"
                type="button"
                onClick={() => {
                  setBulkTitle(title);
                  setBulkDescription(description);
                  setBulkHashtags(hashtags);
                  setActivePlatformPreview("bulk_edit");
                }}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activePlatformPreview === "bulk_edit"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100/60 border border-indigo-200/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5 animate-pulse" />
                Bulk Customize
              </button>
            </div>

            {/* Direct sub-tabs: Config vs Feed Preview, only if not bulk_edit */}
            {activePlatformPreview !== "bulk_edit" && (
              <div className="flex bg-slate-100 rounded-xl p-1 mb-4" id="preview-display-switcher">
                <button
                  type="button"
                  onClick={() => setPreviewSubTab("config")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
                    previewSubTab === "config"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Channel Setup & Config</span>
                    <span className="sm:hidden">Setup</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewSubTab("feed")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
                    previewSubTab === "feed"
                      ? "bg-indigo-650 text-white shadow-xs font-extrabold"
                      : "text-indigo-600/75 hover:text-indigo-800"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Actual Feed Preview</span>
                    <span className="sm:hidden">Feed Preview</span>
                  </span>
                </button>
              </div>
            )}

            {/* Active Platform Card View */}
            <div className="flex-1 flex flex-col justify-between">
              
              {/* TikTok */}
              {activePlatformPreview === "tiktok" && previewSubTab === "config" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="tiktok-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">TikTok Platform Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Caption limits</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description / Caption</label>
                      <textarea
                        rows={4}
                        id="tiktok-caption-input"
                        value={customCaptions.tiktok}
                        onChange={(e) => setCustomCaptions({ ...customCaptions, tiktok: e.target.value })}
                        className={`w-full text-xs bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium transition-colors ${
                          customCaptions.tiktok.length > 2200 
                            ? "text-rose-600 border-rose-300 focus:border-rose-500 font-bold bg-rose-50/5" 
                            : "text-slate-700 border-slate-200"
                        }`}
                      />
                      {renderCharacterLimitBar(customCaptions.tiktok.length, 2200)}
                    </div>

                    {/* Who can see this post selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Who can see this post</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { key: "everyone", label: "Everyone" },
                          { key: "friends", label: "Friends" },
                          { key: "only_you", label: "Only you" }
                        ] as const).map((opt) => {
                          const isSelected = tiktokSettings.visibility === opt.key;
                          return (
                            <button
                              key={opt.key}
                              id={`tiktok-visibility-${opt.key}`}
                              type="button"
                              onClick={() => setTiktokSettings({ ...tiktokSettings, visibility: opt.key })}
                              className={`py-2 px-1 text-[11px] font-bold border rounded-lg text-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                                  : "bg-slate-50 border-slate-200/90 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Thumbnail/Cover Frame Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Thumbnail / Cover Frame</label>
                      <div className="grid grid-cols-4 gap-2">
                        {getAlternativeCovers().map((img, i) => {
                          const isSelected = tiktokSettings.coverUrl === img;
                          return (
                            <button
                              key={i}
                              id={`tiktok-cover-frame-${i}`}
                              type="button"
                              onClick={() => setTiktokSettings({ ...tiktokSettings, coverUrl: img })}
                              className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                                isSelected ? "border-blue-600 ring-2 ring-blue-150 scale-[1.02]" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <img src={img} alt={`TikTok Frame ${i+1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25" />
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-sm">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                              <span className="absolute bottom-1 left-15/2 -translate-x-1/2 bg-black/75 text-white text-[8px] font-mono px-1 py-0.2 rounded scale-90">
                                FRAME {i+1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-150 space-y-1 text-xs">
                    <p className="font-bold text-slate-700">TikTok Rule Verification</p>
                    <p className="text-slate-500 leading-normal">
                      Visibility: <span className="font-bold text-slate-800 capitalize font-mono text-[11px]">{tiktokSettings.visibility.replace("_", " ")}</span>. Cover thumbnail package ready.
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram Reels */}
              {activePlatformPreview === "instagram" && previewSubTab === "config" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="instagram-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">Instagram Reels Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Organic caption layout</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Captions</label>
                      <textarea
                        rows={4}
                        id="instagram-caption-input"
                        value={customCaptions.instagram}
                        onChange={(e) => setCustomCaptions({ ...customCaptions, instagram: e.target.value })}
                        className={`w-full text-xs bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium transition-colors ${
                          customCaptions.instagram.length > 2200 
                            ? "text-rose-600 border-rose-300 focus:border-rose-500 font-bold bg-rose-50/5" 
                            : "text-slate-700 border-slate-200"
                        }`}
                      />
                      {renderCharacterLimitBar(customCaptions.instagram.length, 2200)}
                    </div>

                    {/* Post to story toggle */}
                    <div className="bg-slate-50/65 border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                      <div>
                        <p className="text-xs font-bold text-slate-800">Post to Story</p>
                        <p className="text-[10px] text-slate-450">Additionally share this video directly to your active Instagram Story</p>
                      </div>
                      <button
                        id="instagram-story-toggle"
                        type="button"
                        onClick={() => setInstagramSettings({ ...instagramSettings, postToStory: !instagramSettings.postToStory })}
                        className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                          instagramSettings.postToStory ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                            instagramSettings.postToStory ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Thumbnail/Cover Frame Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Cover Image Frame</label>
                      <div className="grid grid-cols-4 gap-2">
                        {getAlternativeCovers().map((img, i) => {
                          const isSelected = instagramSettings.coverUrl === img;
                          return (
                            <button
                              key={i}
                              id={`instagram-cover-frame-${i}`}
                              type="button"
                              onClick={() => setInstagramSettings({ ...instagramSettings, coverUrl: img })}
                              className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                                isSelected ? "border-blue-600 ring-2 ring-blue-150 scale-[1.02]" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <img src={img} alt={`Instagram Frame ${i+1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25" />
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-sm">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                              <span className="absolute bottom-1 left-15/2 -translate-x-1/2 bg-black/75 text-white text-[8px] font-mono px-1 py-0.2 rounded scale-90">
                                FRAME {i+1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-150 space-y-1 text-xs">
                    <p className="font-bold text-slate-700">Instagram Rule Verification</p>
                    <p className="text-slate-500 leading-normal">
                      Post to Story deck is: <span className="font-bold text-slate-800 font-mono text-[11px]">{instagramSettings.postToStory ? "ENABLED" : "DISABLED"}</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Facebook Reels */}
              {activePlatformPreview === "facebook" && previewSubTab === "config" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="facebook-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">Facebook Reels Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Organic Reach Headline</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description</label>
                      <textarea
                        rows={4}
                        id="facebook-caption-input"
                        value={customCaptions.facebook}
                        onChange={(e) => setCustomCaptions({ ...customCaptions, facebook: e.target.value })}
                        className={`w-full text-xs bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium transition-colors ${
                          customCaptions.facebook.length > 2000 
                            ? "text-rose-600 border-rose-300 focus:border-rose-500 font-bold bg-rose-50/5" 
                            : "text-slate-700 border-slate-200"
                        }`}
                      />
                      {renderCharacterLimitBar(customCaptions.facebook.length, 2000)}
                    </div>

                    {/* Share to story Toggle & Audience/Who can see it */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Story Toggle */}
                      <div className="bg-slate-50/65 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">Share to Story</p>
                          <p className="text-[9px] text-slate-400">Add to FB story deck</p>
                        </div>
                        <button
                          id="facebook-story-toggle"
                          type="button"
                          onClick={() => setFacebookSettings({ ...facebookSettings, shareToStory: !facebookSettings.shareToStory })}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            facebookSettings.shareToStory ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                              facebookSettings.shareToStory ? "translate-x-4.5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Who can see it dropdown */}
                      <div className="bg-slate-50/65 border border-slate-200 rounded-xl p-2 px-3 space-y-1">
                        <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Who can see it</label>
                        <select
                          id="facebook-visibility-select"
                          value={facebookSettings.visibility}
                          onChange={(e) => setFacebookSettings({ ...facebookSettings, visibility: e.target.value })}
                          className="w-full bg-white text-xs text-slate-700 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 font-semibold"
                        >
                          <option value="public">Public</option>
                          <option value="friends">Friends</option>
                          <option value="only_me">Only me</option>
                        </select>
                      </div>
                    </div>

                    {/* Cover Frame Picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Cover Thumbnail Frame</label>
                      <div className="grid grid-cols-4 gap-2">
                        {getAlternativeCovers().map((img, i) => {
                          const isSelected = facebookSettings.coverUrl === img;
                          return (
                            <button
                              key={i}
                              id={`facebook-cover-frame-${i}`}
                              type="button"
                              onClick={() => setFacebookSettings({ ...facebookSettings, coverUrl: img })}
                              className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                                isSelected ? "border-blue-600 ring-2 ring-blue-150 scale-[1.02]" : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <img src={img} alt={`Facebook Frame ${i+1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25" />
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-sm">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </div>
                              )}
                              <span className="absolute bottom-1 left-15/2 -translate-x-1/2 bg-black/75 text-white text-[8px] font-mono px-1 py-0.2 rounded scale-90">
                                FRAME {i+1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-150 space-y-1 text-xs">
                    <p className="font-bold text-slate-700">Facebook Rule Verification</p>
                    <p className="text-slate-500 leading-normal">
                      Audience: <span className="font-bold text-slate-800 capitalize font-mono text-[11px]">{facebookSettings.visibility}</span> • Share to Story: <span className="font-bold text-slate-800 font-mono text-[11px]">{facebookSettings.shareToStory ? "YES" : "NO"}</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* YouTube Shorts */}
              {activePlatformPreview === "youtube_shorts" && previewSubTab === "config" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="youtube-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">YouTube Shorts Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Title & Description Limits</span>
                      </div>
                      <span className={`text-[10px] font-mono transition-colors duration-200 ${customCaptions.youtube_title.length === 100 ? "text-rose-600 font-extrabold" : "text-slate-400"}`}>
                        Title: {customCaptions.youtube_title.length} / 100 chars
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Title (Required)</label>
                        <input
                          type="text"
                          maxLength={100}
                          id="youtube-title-input"
                          value={customCaptions.youtube_title}
                          onChange={(e) => setCustomCaptions({ ...customCaptions, youtube_title: e.target.value })}
                          className={`w-full text-xs font-bold bg-slate-50 border rounded-lg p-2.5 focus:outline-none focus:border-blue-500 transition-colors ${
                            customCaptions.youtube_title.length >= 100 
                              ? "text-rose-600 border-rose-300 focus:border-rose-500" 
                              : "text-slate-800 border-slate-200"
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description</label>
                        <textarea
                          rows={3}
                          id="youtube-desc-input"
                          value={customCaptions.youtube_desc}
                          onChange={(e) => setCustomCaptions({ ...customCaptions, youtube_desc: e.target.value })}
                          className={`w-full text-xs bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium transition-colors ${
                            customCaptions.youtube_desc.length > 5000 
                              ? "text-rose-600 border-rose-300 focus:border-rose-500 font-bold bg-rose-50/5" 
                              : "text-slate-700 border-slate-200"
                          }`}
                        />
                        {renderCharacterLimitBar(customCaptions.youtube_desc.length, 5000)}
                      </div>

                      {/* Save or publish dropdown & Visibility dropdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Save or publish */}
                        <div className="bg-slate-50/65 border border-slate-200 rounded-xl p-2 px-3 space-y-1">
                          <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Save or Publish</label>
                          <select
                            id="youtube-save-or-publish"
                            value={youtubeSettings.saveOrPublish}
                            onChange={(e) => setYoutubeSettings({ ...youtubeSettings, saveOrPublish: e.target.value })}
                            className="w-full bg-white text-xs text-slate-700 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 font-semibold"
                          >
                            <option value="publish">Publish now</option>
                            <option value="draft">Save as draft</option>
                          </select>
                        </div>

                        {/* Visibility (Make your video public, unlisted, or private) */}
                        <div className="bg-slate-50/65 border border-slate-200 rounded-xl p-2 px-3 space-y-1">
                          <label className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Visibility option</label>
                          <select
                            id="youtube-visibility-select"
                            value={youtubeSettings.visibility}
                            onChange={(e) => setYoutubeSettings({ ...youtubeSettings, visibility: e.target.value })}
                            className="w-full bg-white text-xs text-slate-700 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:border-blue-500 font-semibold"
                          >
                            <option value="public">Public</option>
                            <option value="unlisted">Unlisted</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </div>

                      {/* Explanatory dynamic banner about specific option settings */}
                      <div className="text-[10px] text-blue-900 bg-blue-50/65 p-3.5 border border-blue-100 rounded-xl space-y-0.5">
                        <p className="font-bold text-slate-700">Dynamic Visibility Guide</p>
                        {youtubeSettings.visibility === "private" && (
                          <p className="font-medium">🔒 <strong>Private Only:</strong> Only you and people you choose can watch your video.</p>
                        )}
                        {youtubeSettings.visibility === "unlisted" && (
                          <p className="font-medium">🔗 <strong>Unlisted:</strong> Anyone with the video link can watch your video.</p>
                        )}
                        {youtubeSettings.visibility === "public" && (
                          <p className="font-medium">🌍 <strong>Public:</strong> Everyone can watch your video.</p>
                        )}
                      </div>

                      {/* Thumbnail frame selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Select Video Thumbnail Cover</label>
                        <div className="grid grid-cols-4 gap-2">
                          {getAlternativeCovers().map((img, i) => {
                            const isSelected = youtubeSettings.coverUrl === img;
                            return (
                              <button
                                key={i}
                                id={`youtube-cover-frame-${i}`}
                                type="button"
                                onClick={() => setYoutubeSettings({ ...youtubeSettings, coverUrl: img })}
                                className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all group cursor-pointer ${
                                  isSelected ? "border-blue-600 ring-2 ring-blue-150 scale-[1.02]" : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <img src={img} alt={`YouTube Frame ${i+1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25" />
                                {isSelected && (
                                  <div className="absolute top-1 right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-sm">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                )}
                                <span className="absolute bottom-1 left-15/2 -translate-x-1/2 bg-black/75 text-white text-[8px] font-mono px-1 py-0.2 rounded scale-90">
                                  FRAME {i+1}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-150 space-y-1 text-xs">
                    <p className="font-bold text-slate-700">YouTube Rule Verification</p>
                    <p className="text-slate-500 leading-normal">
                      Mode: <span className="font-bold text-slate-800 font-mono text-[11px] capitalize">{youtubeSettings.saveOrPublish}</span> • Visibility: <span className="font-bold text-slate-800 font-mono text-[11px] capitalize">{youtubeSettings.visibility}</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Actual Feed Mobile Device Live Simulator */}
              {activePlatformPreview !== "bulk_edit" && previewSubTab === "feed" && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4" id="live-feed-mockup-wrapper">
                  <div className="text-center">
                    <span className="px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full uppercase">
                      Feed Mockup Engine
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-700 mt-1 uppercase tracking-widest">
                      {activePlatformPreview === "youtube_shorts" ? "YouTube Shorts Viewport" : `${activePlatformPreview.toUpperCase()} Mobile Feed`}
                    </h3>
                  </div>

                  {/* The Smartphone container with standard glass, bevels and overlay layouts */}
                  <div className="relative w-full max-w-[290px] aspect-[9/16] bg-black rounded-[38px] shadow-xl border-[5px] border-slate-800 p-0 overflow-hidden flex flex-col justify-between" id="smartphone-frame">
                    
                    {/* Top Notch/Speaker Spacer */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-slate-900 rounded-full z-30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700 mr-2 shrink-0" />
                      <div className="w-10 h-1 bg-slate-800 rounded-full shrink-0" />
                    </div>

                    {/* StatusBar overlay elements (mimics clean smartphone status indicators) */}
                    <div className="absolute top-1.5 left-0 right-0 px-6 flex justify-between items-center text-[8.5px] font-bold text-white z-20 select-none">
                      <span className="font-sans">15:15</span>
                      <div className="flex items-center space-x-1 font-mono">
                        <span>5G</span>
                        <span className="w-3.5 h-1.5 border border-white/60 rounded-xs flex items-center p-0.5 shrink-0">
                          <span className="block w-full h-full bg-white rounded-2xs" />
                        </span>
                      </div>
                    </div>

                    {/* Canvas/Video Media Backing container */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 to-black z-0 flex items-center justify-center">
                      {videoFile ? (
                        <img
                          src={videoFile.thumbnail || videoFile.src}
                          alt="Media feed dynamic asset"
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center p-5 space-y-2">
                          <Film className="w-8 h-8 mx-auto text-slate-600 animate-pulse stroke-[1.5]" />
                          <p className="text-[10px] font-bold text-slate-550 uppercase tracking-widest">Media Pending</p>
                          <p className="text-[9px] text-slate-500 leading-normal max-w-[160px] mx-auto font-medium">
                            Choose or drag-and-drop a video file first to view standard layouts live.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* PLATFORM OVERLAYS */}

                    {/* TikTok Overlay standard layout */}
                    {activePlatformPreview === "tiktok" && (
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 pt-11 text-white bg-gradient-to-t from-black/85 via-transparent to-black/30 font-sans" id="tiktok-feed-layer">
                        
                        {/* Feed Navigation */}
                        <div className="flex justify-center items-center space-x-3.5 text-[10.5px] font-bold text-white/70 select-none">
                          <span className="hover:text-white cursor-pointer transition-colors">Following</span>
                          <span className="text-white border-b-2 border-white pb-0.5 font-extrabold">For You</span>
                        </div>

                        {/* TikTok Floating Right Actions Bar */}
                        <div className="absolute right-2.5 top-[25%] flex flex-col items-center space-y-3.5 z-20">
                          {/* Profile Circle with micro Red Plus badge */}
                          <div className="relative">
                            <div className="w-8.5 h-8.5 rounded-full border border-white/60 bg-slate-350 overflow-hidden shadow-md">
                              <img src={getAccountForPlatform("tiktok")?.avatarUrl} alt="TikTok profile clip avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#FE2C55] hover:bg-[#E11D48] rounded-full flex items-center justify-center text-white text-[9px] font-black shadow-md select-none">
                              +
                            </span>
                          </div>

                          {/* Heart Action */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/20 hover:bg-black/35 rounded-full transition-colors cursor-pointer group">
                              <Heart className="w-5.5 h-5.5 text-white fill-[#FE2C55] group-hover:scale-110 active:scale-95 transition-transform" />
                            </div>
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">182.4K</span>
                          </div>

                          {/* Comment Action */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/20 hover:bg-black/35 rounded-full transition-colors cursor-pointer group">
                              <MessageCircle className="w-5.5 h-5.5 text-white fill-white group-hover:scale-110 active:scale-95 transition-transform" />
                            </div>
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">2,491</span>
                          </div>

                          {/* Bookmark Save icon */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/20 hover:bg-black/35 rounded-full transition-colors cursor-pointer group">
                              <Bookmark className="w-5.5 h-5.5 text-white fill-amber-400 text-amber-400 group-hover:scale-110 active:scale-95 transition-transform" />
                            </div>
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">19.5K</span>
                          </div>

                          {/* Share Icon wrapper */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/20 hover:bg-black/35 rounded-full transition-colors cursor-pointer group">
                              <Send className="w-4.5 h-4.5 text-white fill-white group-hover:scale-110 active:scale-95 transition-transform" />
                            </div>
                            <span className="text-[9px] font-extrabold text-[#E2E8F0] mt-0.5">Share</span>
                          </div>

                          {/* Spinning disk track avatar */}
                          <div className="w-7 h-7 rounded-full bg-zinc-950 ring-2 ring-zinc-750/70 flex items-center justify-center mt-1 animate-spin" style={{ animationDuration: "5s" }}>
                            <div className="w-4 h-4 rounded-full border border-black overflow-hidden">
                              <img src={getAccountForPlatform("tiktok")?.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>

                        {/* Caption details and audio tracking */}
                        <div className="w-[84%] space-y-2 text-left self-start mt-auto relative z-20">
                          <div>
                            <span className="font-extrabold text-[11px] block text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                              {getAccountForPlatform("tiktok")?.username || "@tiktok_creator"}
                            </span>
                            <p className="text-[10px] font-semibold leading-relaxed text-slate-100 line-clamp-3 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] mt-0.5 break-words">
                              {customCaptions.tiktok || "Add your descriptive story caption under general config tab."}
                            </p>
                          </div>

                          {/* Music Title badge ticker */}
                          <div className="flex items-center space-x-1.5 text-[8.5px] text-white/95 bg-black/30 p-1 px-2 rounded-full w-fit">
                            <Music className="w-2.5 h-2.5 text-slate-200 animate-pulse" />
                            <span className="text-[8px] font-bold overflow-hidden whitespace-nowrap block w-20 truncate">
                              Original Sound - {getAccountForPlatform("tiktok")?.username.replace("@", "") || "vlog_track"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Instagram Reels Viewport Layout */}
                    {activePlatformPreview === "instagram" && (
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 pt-11 text-white bg-gradient-to-t from-black/85 via-transparent to-black/30 font-sans" id="instagram-feed-layer">
                        
                        {/* Top Navigation */}
                        <div className="flex justify-between items-center text-xs px-1 select-none">
                          <span className="font-extrabold text-[12.5px] tracking-wide text-white font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">Reels</span>
                          <button className="p-1 hover:bg-white/10 rounded-full cursor-pointer" type="button">
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        {/* Instagram Operations Floating Sidebar */}
                        <div className="absolute right-2.5 bottom-12 flex flex-col items-center space-y-3.5 z-20">
                          {/* Heart */}
                          <div className="flex flex-col items-center">
                            <Heart className="w-5 h-5 text-white active:scale-90 transition-transform cursor-pointer drop-shadow-sm" />
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">25.3K</span>
                          </div>

                          {/* Comment balloon */}
                          <div className="flex flex-col items-center">
                            <MessageCircle className="w-5 h-5 text-white active:scale-90 transition-transform cursor-pointer drop-shadow-sm" />
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">1,102</span>
                          </div>

                          {/* Direct message paper airplane */}
                          <div className="flex flex-col items-center">
                            <Send className="w-4.5 h-4.5 text-white active:scale-90 transition-transform cursor-pointer" />
                            <span className="text-[9px] font-bold text-white mt-0.5">Send</span>
                          </div>

                          {/* Bookmark */}
                          <div className="flex flex-col items-center">
                            <Bookmark className="w-4.5 h-4.5 text-white cursor-pointer" />
                            <span className="text-[9px] font-bold text-white mt-0.5">Save</span>
                          </div>

                          {/* Music album cover */}
                          <div className="w-6 h-6 rounded border border-white/70 overflow-hidden bg-slate-900 flex items-center justify-center animate-spin" style={{ animationDuration: "8s" }}>
                            <img src={getAccountForPlatform("instagram")?.avatarUrl} alt="music disk cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </div>

                        {/* Bottom-left user + captions */}
                        <div className="w-[84%] space-y-2 text-left self-start mt-auto relative z-20">
                          
                          {/* Account Line */}
                          <div className="flex items-center space-x-1.5 pt-1">
                            <div className="w-6.5 h-6.5 rounded-full border border-white/60 overflow-hidden shrink-0 ring-1 ring-pink-500">
                              <img src={getAccountForPlatform("instagram")?.avatarUrl} alt="insta profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="font-extrabold text-[10.5px] text-white tracking-wide truncate max-w-[100px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                              {getAccountForPlatform("instagram")?.username.replace("@", "") || "instagram_reels"}
                            </span>
                            <button className="px-1.5 py-0.5 text-[8px] bg-white/20 hover:bg-white/30 border border-white/40 rounded text-center font-black uppercase text-white transition-all select-none cursor-pointer" type="button">
                              Follow
                            </button>
                          </div>

                          {/* Instagram Caption description */}
                          <p className="text-[10px] font-semibold leading-relaxed text-slate-100 line-clamp-3 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] break-words">
                            {customCaptions.instagram || "Setup description and reference hashtags to preview caption wrapping."}
                          </p>

                          {/* Audio track line */}
                          <div className="flex items-center space-x-1 py-0.5 text-[8.5px] text-white/90">
                            <Music className="w-2.5 h-2.5 text-slate-200" />
                            <span className="font-bold truncate max-w-[140px]">Original Audio • {getAccountForPlatform("instagram")?.username.replace("@", "")}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Facebook Reels Viewport Layout */}
                    {activePlatformPreview === "facebook" && (
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 pt-11 text-white bg-gradient-to-t from-black/85 via-transparent to-black/35 font-sans" id="facebook-feed-layer">
                        
                        {/* Top Facebook Reels selector line */}
                        <div className="flex justify-between items-center text-xs font-bold px-1 select-none">
                          <span className="text-[12px] font-extrabold bg-[#1877F2] text-white px-2 py-0.5 rounded-md drop-shadow">Reels</span>
                          <span className="text-[10px] text-slate-200 hover:underline cursor-pointer">Watch Feed</span>
                        </div>

                        {/* Facebook Sidebar Items */}
                        <div className="absolute right-2.5 bottom-12 flex flex-col items-center space-y-4 z-20">
                          {/* FB Like Thumbs-up */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/15 hover:bg-black/30 rounded-full cursor-pointer transition-colors">
                              <ThumbsUp className="w-5.5 h-5.5 text-white fill-[#1877F2]" />
                            </div>
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">1.2K</span>
                          </div>

                          {/* Comment */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/15 hover:bg-black/30 rounded-full cursor-pointer transition-colors">
                              <MessageCircle className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-[9px] font-extrabold text-white mt-0.5 font-mono">240</span>
                          </div>

                          {/* Share */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 bg-black/15 hover:bg-black/30 rounded-full cursor-pointer transition-colors">
                              <Send className="w-4.5 h-4.5 text-white fill-white" />
                            </div>
                            <span className="text-[9px] font-extrabold text-[#F1F5F9] mt-0.5">Share</span>
                          </div>

                          {/* Corner avatar disk */}
                          <div className="w-6.5 h-6.5 rounded-full border border-white/60 overflow-hidden">
                            <img src={getAccountForPlatform("facebook")?.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </div>

                        {/* Bottom-left caption details */}
                        <div className="w-[84%] space-y-2 text-left self-start mt-auto relative z-20">
                          
                          {/* Profile row */}
                          <div className="flex items-center space-x-1.5">
                            <div className="w-7 h-7 rounded-full border border-white/50 bg-slate-400 overflow-hidden shrink-0">
                              <img src={getAccountForPlatform("facebook")?.avatarUrl} alt="facebook avatar details" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <span className="font-extrabold text-[10.5px] text-white block leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                {getAccountForPlatform("facebook")?.username || "Reels Group Creator"}
                              </span>
                              <span className="text-[7.5px] font-extrabold tracking-wide text-blue-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                CHANNELS DIRECT
                              </span>
                            </div>
                          </div>

                          {/* Description custom text */}
                          <p className="text-[10px] font-semibold leading-relaxed text-slate-100 line-clamp-3 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] pt-0.5 break-words">
                            {customCaptions.facebook || "No custom Facebook text setup yet. Edit the description tab to preview."}
                          </p>

                          {/* Base music line */}
                          <div className="flex items-center space-x-1 py-0.5 text-[8.5px] text-slate-300">
                            <Music className="w-2.5 h-2.5 text-slate-200" />
                            <span className="font-bold truncate">Original Reels Audio track</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* YouTube Shorts Viewport Layout */}
                    {activePlatformPreview === "youtube_shorts" && (
                      <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 pt-11 text-white bg-gradient-to-t from-black/85 via-transparent to-black/35 font-sans" id="youtube-shorts-feed-layer">
                        
                        {/* Top YouTube Shorts navigation bar */}
                        <div className="flex justify-between items-center text-xs font-bold px-1 select-none">
                          <span className="font-black text-[12px] text-red-500 tracking-tight flex items-center gap-1 drop-shadow uppercase">
                            <span className="w-1.5 h-1.5 bg-red-650 rounded-full" />
                            Shorts
                          </span>
                          <span className="p-1 bg-black/15 rounded-full text-[10px]">YouTube Live</span>
                        </div>

                        {/* Shorts standard right-floating action panels */}
                        <div className="absolute right-2.5 bottom-12 flex flex-col items-center space-y-3.5 z-20">
                          {/* Like (Thumbs-up) */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 px-1.5 bg-black/20 hover:bg-black/35 rounded-full cursor-pointer transition-colors">
                              <ThumbsUp className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-[9px] font-extrabold mt-0.5 shadow-sm font-mono">841.5K</span>
                          </div>

                          {/* Dislike (Thumbs-down) */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 px-1.5 bg-black/20 hover:bg-black/35 rounded-full cursor-pointer transition-colors">
                              <ThumbsDown className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[9px] font-extrabold mt-0.5 shadow-sm">Dislike</span>
                          </div>

                          {/* Comments */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 px-1.5 bg-black/20 hover:bg-black/35 rounded-full cursor-pointer transition-colors">
                              <MessageCircle className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-[9px] font-extrabold mt-0.5 shadow-sm font-mono">1.2K</span>
                          </div>

                          {/* Share */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 px-1.5 bg-black/20 hover:bg-black/35 rounded-full cursor-pointer transition-colors">
                              <Send className="w-4.5 h-4.5 text-white fill-white animate-pulse" />
                            </div>
                            <span className="text-[9px] font-extrabold mt-0.5 shadow-sm">Share</span>
                          </div>

                          {/* Remix circular arrow */}
                          <div className="flex flex-col items-center">
                            <div className="p-1 px-1.5 bg-black/20 hover:bg-black/35 rounded-full cursor-pointer transition-colors">
                              <Repeat2 className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="text-[9px] font-extrabold mt-0.5 shadow-sm">Remix</span>
                          </div>

                          {/* Music square disk artwork */}
                          <div className="w-6.5 h-6.5 bg-rose-500 rounded border border-white overflow-hidden ring-1 ring-rose-350">
                            <img src={getAccountForPlatform("youtube_shorts")?.avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        </div>

                        {/* Bottom Left Shorts handle, subscriber state, and title blocks */}
                        <div className="w-[84%] space-y-2 text-left self-start mt-auto relative z-20">
                          
                          {/* Profile details */}
                          <div className="flex items-center space-x-2 pt-1 border-t border-white/5 bg-black/5 rounded">
                            <div className="w-6.5 h-6.5 rounded-full border border-white bg-slate-400 overflow-hidden shrink-0">
                              <img src={getAccountForPlatform("youtube_shorts")?.avatarUrl} alt="YouTube avatar Shorts" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="font-extrabold text-[10.5px] text-white tracking-wide truncate max-w-[85px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                              @{getAccountForPlatform("youtube_shorts")?.username || "youtube_shorts"}
                            </span>
                            <button className="px-2 py-0.5 text-[8px] bg-red-650 hover:bg-red-750 font-black text-white rounded-full transition-colors uppercase outline-none select-none cursor-pointer" type="button">
                              SUBSCRIBE
                            </button>
                          </div>

                          {/* The YouTube Shorts explicit title block highlighted in bold */}
                          <div className="space-y-0.5">
                            <h4 className="text-[11px] font-black leading-snug text-rose-50 drop-shadow-[0_1px_2.5px_rgba(0,0,0,0.95)] line-clamp-1 break-words">
                              {customCaptions.youtube_title || "Write a headline video title..."}
                            </h4>
                            <p className="text-[9.5px] font-semibold leading-relaxed text-slate-150 line-clamp-2 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] break-words pt-0.5 font-sans">
                              {customCaptions.youtube_desc || "No description set yet. Write custom content inside description input."}
                            </p>
                          </div>

                          {/* Audio tracker display */}
                          <div className="flex items-center space-x-1 py-0.5 text-[8.5px] text-white/95 bg-black/20 p-1 px-2 rounded w-fit">
                            <Music className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                            <span className="font-extrabold truncate max-w-[130px]">Original Sound - @{getAccountForPlatform("youtube_shorts")?.username}</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {activePlatformPreview === "bulk_edit" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="bulk-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-indigo-950 tracking-tight">Bulk Multi-Platform Editing Hub</span>
                        <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 rounded shrink-0">
                          Power Tool
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-indigo-900 bg-indigo-50/40 border border-indigo-100 p-3 rounded-xl leading-relaxed">
                      Overwrites description values, custom hashtags, or short video titles across selected active channels simultaneously. Write once, update all instantly.
                    </p>

                    <div className="space-y-3.5">
                      {/* Bulk Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Unified Title (Applies to YouTube Shorts Title)</label>
                        <input
                          type="text"
                          maxLength={100}
                          id="bulk-title-value"
                          placeholder="vlog: My creative process"
                          value={bulkTitle}
                          onChange={(e) => setBulkTitle(e.target.value)}
                          className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-350 focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-colors"
                        />
                      </div>

                      {/* Bulk Description */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Unified Base Description</label>
                        <textarea
                          rows={3}
                          id="bulk-desc-value"
                          placeholder="Type description text to broadcast..."
                          value={bulkDescription}
                          onChange={(e) => setBulkDescription(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-350 focus:border-indigo-500 rounded-xl p-3 outline-none font-sans leading-relaxed resize-none font-medium transition-colors"
                        />
                      </div>

                      {/* Bulk Hashtags */}
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Unified Hashtags (Comma or Space Separated)</label>
                        <input
                          type="text"
                          id="bulk-tags-value"
                          placeholder="productivity, design, lifestyle"
                          value={bulkHashtags}
                          onChange={(e) => setBulkHashtags(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-350 focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-colors font-mono"
                        />
                      </div>

                      {/* Output selection checkboxes */}
                      <div className="space-y-2 pt-2.5 border-t border-slate-100">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Select Platform Targets to Apply To</label>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { key: "tiktok", label: "TikTok Caption" },
                            { key: "instagram", label: "Instagram Reels Caption" },
                            { key: "facebook", label: "Facebook Page Caption" },
                            { key: "youtube_desc", label: "YouTube Shorts Description" },
                          ] as const).map((opt) => {
                            const isChecked = bulkPlatforms[opt.key];
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() =>
                                  setBulkPlatforms(prev => ({
                                    ...prev,
                                    [opt.key]: !prev[opt.key]
                                  }))
                                }
                                className={`flex items-center gap-2 px-3 py-2 border rounded-xl transition-all cursor-pointer ${
                                  isChecked
                                    ? "bg-indigo-50/40 border-indigo-200 text-indigo-700"
                                    : "bg-slate-50/30 border-slate-200 text-slate-500 hover:bg-slate-50"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-bold ${
                                  isChecked ? "bg-indigo-650 border-indigo-650 text-white" : "border-slate-350 bg-white"
                                }`}>
                                  {isChecked && "✓"}
                                </span>
                                <span className="text-[11px] font-bold text-slate-750">{opt.label}</span>
                              </button>
                            );
                          })}

                          {/* YouTube Title checkbox */}
                          <button
                            type="button"
                            onClick={() =>
                              setBulkPlatforms(prev => ({
                                ...prev,
                                youtube_title: !prev.youtube_title
                              }))
                            }
                            className={`flex items-center gap-2 px-3 py-2 border rounded-xl transition-all cursor-pointer ${
                              bulkPlatforms.youtube_title
                                ? "bg-indigo-50/40 border-indigo-200 text-indigo-700"
                                : "bg-slate-50/30 border-slate-200 text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-bold ${
                              bulkPlatforms.youtube_title ? "bg-indigo-650 border-indigo-650 text-white" : "border-slate-350 bg-white"
                            }`}>
                              {bulkPlatforms.youtube_title && "✓"}
                            </span>
                            <span className="text-[11px] font-bold text-slate-750">YouTube Title</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const rawTags = bulkHashtags;
                        const formattedTags = rawTags
                          .split(/[\s,]+/)
                          .filter(Boolean)
                          .map(t => t.startsWith("#") ? t : `#${t}`)
                          .join(" ");
                        
                        const finalCaption = bulkDescription.trim() + (formattedTags ? "\n\n" + formattedTags : "");
                        
                        setCustomCaptions(prev => {
                          const updated = { ...prev };
                          if (bulkPlatforms.tiktok) {
                            updated.tiktok = finalCaption;
                          }
                          if (bulkPlatforms.instagram) {
                            updated.instagram = finalCaption;
                          }
                          if (bulkPlatforms.facebook) {
                            updated.facebook = finalCaption;
                          }
                          if (bulkPlatforms.youtube_desc) {
                            updated.youtube_desc = finalCaption;
                          }
                          if (bulkPlatforms.youtube_title && bulkTitle.trim()) {
                            updated.youtube_title = bulkTitle.trim();
                          }
                          return updated;
                        });
                        
                        triggerToast("Success: Common description & hashtags applied across your selected channels!");
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Apply Bulk Inputs
                    </button>
                    <p className="text-[9.5px] text-center text-slate-400 font-mono">
                      Overwrites customized values for checked platform captions instantly
                    </p>
                  </div>
                </div>
              )}

              {/* Action utilities bar under previews */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-3.5 border-t border-slate-105">
                <button
                  type="button"
                  onClick={() => {
                    let targetText = "";
                    if (activePlatformPreview === "tiktok") targetText = customCaptions.tiktok;
                    else if (activePlatformPreview === "instagram") targetText = customCaptions.instagram;
                    else if (activePlatformPreview === "facebook") targetText = customCaptions.facebook;
                    else if (activePlatformPreview === "youtube_shorts") targetText = `${customCaptions.youtube_title}\n\n${customCaptions.youtube_desc}`;
                    else if (activePlatformPreview === "bulk_edit") targetText = `${bulkTitle}\n\n${bulkDescription}\n\n${bulkHashtags}`;
                    handleCopyText(targetText);
                  }}
                  className="px-3.5 py-2 text-xs font-bold border border-slate-200 hover:border-slate-300 rounded-lg hover:bg-slate-50 transition-all text-slate-600 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Platform Text
                </button>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-[10px] text-slate-400 font-mono font-bold">
                    {accounts.filter(a => a.connected).length} linked
                  </div>
                  <button
                    type="button"
                    onClick={handlePublishAll}
                    disabled={isPublishing || (!videoFile && Object.keys(platformAttachments).length === 0)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      (!videoFile && Object.keys(platformAttachments).length === 0)
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : isPublishing
                        ? "bg-slate-50 text-slate-400 border border-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Distribute Clips</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* AI Keywords Generated Drawer */}
          {optimizedResult && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Engine Extracted SEO Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {optimizedResult.analytics_keywords.map((word, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-bold px-2.5 py-1 bg-slate-55 border border-slate-200 text-slate-600 rounded-lg capitalize"
                  >
                    #{word}
                  </span>
                ))}
              </div>
            </div>
          )}
          </>
        )}

        </div>
      </>
    )}

      </main>

      {/* Interactive Distribution Dashboard Queue Modal overlay */}
      {isPublishing && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-6">
            
            {!isPublishingStarted ? (
              <>
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-1">
                    <Share2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Prepare Cross-Platform Release Plan</h3>
                  <p className="text-xs text-slate-500">Choose how and when to dispatch your custom optimized vertical clip.</p>
                </div>

                {/* Connection Status Box */}
                <div className="flex flex-col gap-2 p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Output Channels</span>
                    <span className="text-[9px] text-rose-500 font-mono font-bold">Error Simulation (Retry Test)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {accounts.map(acc => {
                      const isActive = acc.connected;
                      const hasSimulatedError = simulatePlatformErrors[acc.platform];
                      return (
                        <div
                          key={acc.id}
                          className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-50/50 text-emerald-800 border-emerald-200/80"
                              : "bg-slate-150/40 text-slate-400 border-slate-200 line-through opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-350"}`} />
                            <span className="truncate">{acc.platform.replace("_shorts", "").toUpperCase()}</span>
                          </div>
                          {isActive && (
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-slate-500 scale-90 origin-right select-none">
                              <input
                                type="checkbox"
                                checked={hasSimulatedError}
                                onChange={(e) => {
                                  setSimulatePlatformErrors(prev => ({
                                    ...prev,
                                    [acc.platform]: e.target.checked
                                  }));
                                }}
                                className="accent-rose-500 w-3 h-3 rounded cursor-pointer"
                              />
                              <span className="text-[9px] font-bold text-rose-600">Fail API</span>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strategy Cards */}
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Select Release Strategy</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPublishStrategy("now")}
                      className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        publishStrategy === "now"
                          ? "bg-blue-50/20 border-blue-600 ring-2 ring-blue-100"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded-lg ${publishStrategy === "now" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">Publish Now</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-relaxed">Broadcast package immediately to connected platforms.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPublishStrategy("later")}
                      className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        publishStrategy === "later"
                          ? "bg-blue-50/20 border-blue-600 ring-2 ring-blue-100"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded-lg ${publishStrategy === "later" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                          <Calendar className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">Schedule</span>
                      </div>
                      <span className="text-[10px] text-slate-400 leading-relaxed">Time-lock the cross-post queue for a future slot.</span>
                    </button>
                  </div>
                </div>

                {/* Date & Time Picker */}
                {publishStrategy === "later" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5 leading-none">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      Specify Queue Release Time
                    </label>
                    <input
                      type="datetime-local"
                      id="schedule-datetime-picker"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-350 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1">
                      <span>Timezone: Local system</span>
                      {scheduledDateTime && (
                        <span className="text-blue-600 font-bold">
                          Release at: {new Date(scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Confirm & Cancel Buttons in Strategy Screen */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPublishing(false)}
                    className="py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Cancel Selection
                  </button>
                  <button
                    type="button"
                    onClick={publishStrategy === "later" ? executeScheduledPublish : executeInstantPublish}
                    className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5 font-sans"
                  >
                    {publishStrategy === "later" ? (
                      <>
                        <Calendar className="w-3.5 h-3.5" />
                        Queue Broadcast
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        Confirm & Publish
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-1 animate-bounce">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {publishStrategy === "later" ? "Scheduling Multi-Channel Release" : "Pushing Multi-Channel Distribution"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {publishStrategy === "later" ? "Registering timed synchronization tickers..." : "Broadcasting content to enabled social platforms simultaneously"}
                  </p>
                </div>

                 {/* Platform status indicator with individual success/failure flags */}
                {Object.keys(platformPublishStatus).length > 0 ? (
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-2 text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Channel Dispatch Handlers</span>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(platformPublishStatus).map(([plat, val]) => {
                        const stat = val as { success: boolean; error?: string; url?: string; isRetrying?: boolean };
                        return (
                          <div key={plat} className="flex flex-col p-2 bg-white border border-slate-200 rounded-xl select-none shadow-xs">
                            <div className="flex items-center justify-between gap-1.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`w-2 h-2 rounded-full ${stat.success ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : stat.error ? "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.55)] animate-pulse" : stat.isRetrying ? "bg-blue-500 animate-ping" : "bg-blue-500"}`} />
                                <span className="text-[10px] font-bold text-slate-700 uppercase truncate">{plat.replace("_shorts", "")}</span>
                              </div>
                              <span className={`text-[8.5px] font-mono font-bold ${stat.success ? "text-emerald-600" : stat.isRetrying ? "text-blue-600 animate-pulse" : stat.error ? "text-rose-600" : "text-blue-500"}`}>
                                {stat.success ? "LIVE" : stat.isRetrying ? "RETRY" : stat.error ? "FAIL" : "WAIT"}
                              </span>
                            </div>
                            {stat.error && (
                              <p className="text-[8.5px] text-rose-600 font-medium leading-normal mt-1 truncate" title={stat.error}>
                                {stat.error}
                              </p>
                            )}
                            {stat.success && stat.url && (
                              <a
                                href={stat.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[8.5px] text-blue-600 font-bold hover:underline mt-1 truncate block flex items-center gap-0.5"
                              >
                                View Live Feed ↗
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Fallback Platform indicators */
                  <div className="flex justify-center gap-3 py-2 border-y border-slate-100">
                    {accounts.map(acc => {
                      const isActive = acc.connected;
                      return (
                        <div
                          key={acc.id}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-400 border-slate-150 line-through opacity-50"
                          }`}
                        >
                          {acc.platform.replace("_shorts", "").toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Stepper Progress */}
                <div className="space-y-4">
                  {publishingSteps.map((step, index) => {
                    const isRunning = step.status === "running";
                    const isCompleted = step.status === "completed";
                    const isIdle = step.status === "idle";

                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0.15, y: 6, filter: "blur(1px)" }}
                        animate={{ 
                          opacity: isIdle ? 0.35 : 1, 
                          y: isIdle ? 4 : 0,
                          filter: isIdle ? "blur(0.5px)" : "blur(0px)"
                        }}
                        transition={{ 
                          duration: 0.45, 
                          ease: "easeOut",
                          delay: isIdle ? 0 : 0.05
                        }}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-sans">
                          <span className={`font-medium transition-colors duration-300 ${isCompleted ? "text-slate-500" : isRunning ? "text-slate-900 font-bold" : "text-slate-400"}`}>
                            {step.name}
                          </span>
                          <span className={`font-mono text-[11px] transition-colors duration-300 ${isCompleted ? "text-emerald-600 font-bold" : isRunning ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                            {isCompleted ? "Completed" : isRunning ? "Processing" : "Queued"}
                          </span>
                        </div>

                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-550 ${isCompleted ? "bg-emerald-500" : isRunning ? "bg-blue-600 animate-pulse" : "bg-slate-200"}`}
                            style={{ width: `${step.progress || (isCompleted ? 100 : 0)}%` }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Live API Console Log Box */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                    Live API Orchestration Console logs
                  </span>
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-1 border border-slate-800 shadow-inner">
                    {serverLogs.map((log, i) => (
                      <div key={i} className={log.includes("[CRITICAL") ? "text-rose-400" : log.includes("[API Server]") ? "text-blue-300" : "text-slate-350"}>
                        <span className="text-slate-600 select-none mr-2">[{i+1}]</span>
                        {log}
                      </div>
                    ))}
                    {serverLogs.length === 0 && (
                      <div className="text-slate-500 italic">No logs available. Ready to distribute...</div>
                    )}
                  </div>
                </div>

                {!hasPublishingFailed ? (
                  <div className="text-[10px] text-center text-slate-400 font-mono animate-pulse">
                    Do not close window • Handoff engine is active
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5 pt-1"
                  >
                    <button
                      type="button"
                      onClick={() => setIsPublishing(false)}
                      className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 font-extrabold rounded-xl text-[11px] uppercase tracking-wider transition-colors cursor-pointer text-center font-sans"
                    >
                      Close Queue
                    </button>
                    <button
                      type="button"
                      onClick={handleRetryFailed}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5 font-sans"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "5s" }} />
                      Retry Failed
                    </button>
                  </motion.div>
                )}
              </>
            )}

          </div>
        </div>
      )}

      {/* Success Modal */}
      {showPublishSuccess && (
        <>
          <Confetti />
          <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {publishStrategy === "later" ? "Successfully Scheduled" : "Successfully Distributed"}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {publishStrategy === "later" ? (
                    <>
                      Your cross-channel broadcast draft has been locked and successfully queued to publish at{" "}
                      <span className="font-bold text-slate-700">
                        {scheduledDateTime ? new Date(scheduledDateTime).toLocaleString() : "the scheduled slot"}
                      </span>
                      . You can track this scheduled release in your Localized Distribution History list.
                    </>
                  ) : (
                    "Your video optimization package was successfully posted to live platform channels. Custom handles updated in background."
                  )}
                </p>
              </div>
              <button
                onClick={() => setShowPublishSuccess(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </>
      )}

      {/* Historic Campaigns Drawer Section */}
      <footer className="bg-white border-t border-slate-200/90 pt-8 pb-28 px-6 lg:px-8 lg:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {activePage === "content" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Localized Distribution History</h3>
                  <p className="text-xs text-slate-405">Persistent client analytics & previous broadcasts</p>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 font-bold uppercase tracking-wide px-2 py-1 rounded">
                  Durable Storage active
                </span>
              </div>

              {campaigns.length === 0 ? (
                <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-455">
                  No previous broadcasts saved locally yet. Run "Distribute All" to populate historic logs.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className={`border rounded-xl p-4 flex gap-4 hover:border-slate-300 transition-all relative overflow-hidden ${camp.status === "queued" ? "bg-amber-50/15 border-amber-200/60" : "bg-slate-50/50 border-slate-200"}`}
                    >
                      <div className="w-16 h-20 bg-slate-200 rounded overflow-hidden relative shrink-0">
                        <img src={camp.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          {camp.status === "queued" ? (
                            <Clock className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{camp.title}</p>
                              {camp.status === "queued" && (
                                <span className="px-1.5 py-0.5 text-[8.5px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200 rounded shrink-0">
                                  Scheduled
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleDeleteCampaign(camp.id, e)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0"
                              title="Delete broadcast history entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{camp.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200/50 mt-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {Object.entries(camp.platforms).map(([plat, active]) => {
                              if (!active) return null;
                              return (
                                <span
                                  key={plat}
                                  className="px-1 text-[8px] font-bold uppercase bg-slate-200 text-slate-605 rounded"
                                >
                                  {plat.replace("_shorts", "")}
                                </span>
                              );
                            })}
                          </div>

                          <span className="font-mono text-slate-505 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {camp.publishDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Core Footer Columns (Like UploadPost Screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-t border-slate-200 pt-8 text-xs text-slate-500">
            {/* Column 1: Brand Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://past-aquamarine-opezzkg3.edgeone.app/logo%204%20(2).png" 
                  alt="OmniCast Logo" 
                  className="w-6 h-6 object-contain rounded-md"
                  referrerPolicy="no-referrer"
                />
                <span className="font-black text-sm text-slate-900">OmniCast</span>
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed max-w-xs">
                Your API solution for all social media platforms. Simplifying content management for developers and creators.
              </p>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Product</h5>
              <ul className="space-y-1.5 font-medium">
                <li><button type="button" onClick={() => { setActivePage("upload"); setUploadStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">Dashboard</button></li>
                <li><button type="button" onClick={() => { setActivePage("users"); triggerToast("Managing custom upload profiles"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">Manage Profiles</button></li>
                <li><button type="button" onClick={() => { setActivePage("pricing"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">Pricing</button></li>
                <li><button type="button" onClick={() => { setActivePage("profile"); triggerToast("Viewing subscription & billing details"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">Billing & Usage</button></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Resources</h5>
              <ul className="space-y-1.5 font-medium">
                <li><button type="button" onClick={() => { setActivePage("apikeys"); triggerToast("Opening API Keys..."); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">API & Integrations</button></li>
                <li><button type="button" onClick={() => { setDocsTabOverride("guides"); setActivePage("docs"); triggerToast("Opening Documentation..."); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-indigo-600 transition-colors cursor-pointer text-left">Documentation</button></li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Support</h5>
              <ul className="space-y-1.5 font-medium">
                <li>
                  <button 
                    type="button" 
                    onClick={() => { 
                      setDocsTabOverride("helpdesk");
                      setActivePage("docs"); 
                      triggerToast("Opening Help Center in Docs Desk..."); 
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }} 
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    type="button" 
                    onClick={() => { 
                      setDocsTabOverride("review");
                      setActivePage("docs"); 
                      triggerToast("Opening Reviews Feed in Docs Desk..."); 
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }} 
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    Leave a review ⭐
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Pages & Disclosures Band */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-black text-slate-705">OmniCast</span>
              <span>•</span>
              <span className="font-semibold text-slate-500">Cross-Platform Hub</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} OmniCast. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4 animate-pulse-slow">
              <button 
                onClick={() => {
                  setActivePage("terms");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} 
                className="font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button 
                onClick={() => {
                  setActivePage("privacy");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} 
                className="font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <div id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 px-2 py-1 flex items-center justify-around shadow-[0_-8px_30px_rgba(15,23,42,0.06)] select-none">
        
        {/* Button 1: Upload (Dashboard) */}
        <button
          type="button"
          onClick={() => {
            setActivePage("upload");
            setUploadStep(1);
            setIsMobileMoreOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 relative transition-all ${
            activePage === "upload" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Upload</span>
          {activePage === "upload" && (
            <span className="absolute bottom-0 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Button 2: Profiles (Users) */}
        <button
          type="button"
          onClick={() => {
            setActivePage("users");
            setIsMobileMoreOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 relative transition-all ${
            activePage === "users" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Profiles</span>
          {activePage === "users" && (
            <span className="absolute bottom-0 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Button 3: Calendar */}
        <button
          type="button"
          onClick={() => {
            setActivePage("calendar");
            setIsMobileMoreOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 relative transition-all ${
            activePage === "calendar" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Calendar</span>
          {activePage === "calendar" && (
            <span className="absolute bottom-0 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Button 4: Analytics */}
        <button
          type="button"
          onClick={() => {
            setActivePage("analytics");
            setIsMobileMoreOpen(false);
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 relative transition-all ${
            activePage === "analytics" ? "text-indigo-600 font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LineChart className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">Analytics</span>
          {activePage === "analytics" && (
            <span className="absolute bottom-0 w-4 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </button>

        {/* Button 5: More (Command drawer) */}
        <button
          type="button"
          onClick={() => {
            setIsMobileMoreOpen(!isMobileMoreOpen);
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 relative transition-all ${
            isMobileMoreOpen ? "text-[#4F46E5] font-extrabold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">More</span>
          {isMobileMoreOpen && (
            <span className="absolute bottom-0 w-4 h-0.5 bg-[#4F46E5] rounded-full" />
          )}
        </button>
      </div>

      {/* Slide-Up Mobile "More" Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <motion.div
            id="mobile-more-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[3px] z-50 flex items-end justify-center lg:hidden"
            onClick={() => setIsMobileMoreOpen(false)}
          >
            <motion.div
              id="mobile-more-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-xl rounded-t-[2.25rem] shadow-[0_-12px_40px_rgba(15,23,42,0.12)] border-t border-slate-100 p-6 pb-26 flex flex-col max-h-[85vh] focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Visual pull/drag indicator pill */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-5 shrink-0" />

              {/* Header of sheet */}
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600 text-sm animate-pulse">✦</span>
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase font-sans">
                    OmniCast Command
                  </h3>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Grid of remaining pages */}
              <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto pr-1">
                
                {/* Profile */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("profile");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "profile" 
                      ? "bg-indigo-50/50 border-indigo-200 text-indigo-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <User className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Profile</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Preferences</p>
                  </div>
                </button>

                {/* History */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("history");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "history" 
                      ? "bg-blue-50/50 border-blue-200 text-blue-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <History className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">History</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Past uploads</p>
                  </div>
                </button>

                {/* Queue Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("queue_settings");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "queue_settings" 
                      ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <Clock className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Queue</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Time Slots</p>
                  </div>
                </button>

                {/* Billing & Invoices */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("invoices");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "invoices" 
                      ? "bg-amber-50/50 border-amber-200 text-amber-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <CreditCard className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Invoices</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Billing details</p>
                  </div>
                </button>

                {/* Connected Apps */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("connected_apps");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "connected_apps" 
                      ? "bg-indigo-50/50 border-indigo-200 text-indigo-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <Key className="w-4 h-4 text-indigo-550" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Apps Bridge</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Integrations</p>
                  </div>
                </button>

                {/* Team Management */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("team_management");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "team_management" 
                      ? "bg-purple-50/50 border-purple-200 text-purple-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <Users className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Team Admin</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Seats & roles</p>
                  </div>
                </button>

                {/* API Keys */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("apikeys");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "apikeys" 
                      ? "bg-rose-50/50 border-rose-200 text-rose-905" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <Key className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">API Keys</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Credentials</p>
                  </div>
                </button>

                {/* Pricing Plans */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("pricing");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activePage === "pricing" 
                      ? "bg-indigo-50/50 border-indigo-200 text-indigo-900" 
                      : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <DollarSign className="w-4 h-4 text-indigo-505" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Plans</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Limits & Billing</p>
                  </div>
                </button>

                {/* Docs & Guides */}
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("docs");
                    setDocsTabOverride("guides");
                    setIsMobileMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border col-span-2 text-left transition-all cursor-pointer ${
                    activePage === "docs" 
                      ? "bg-slate-100 border-slate-350 text-slate-900" 
                      : "bg-slate-50 border-slate-150 text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100 shrink-0">
                    <BookOpen className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] uppercase tracking-wide truncate">Docs & Support Guides</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 font-medium truncate">Read developers manual & platform handbooks</p>
                  </div>
                </button>

              </div>

              {/* Mobile Legal Links */}
              <div className="flex items-center justify-center gap-5 text-xs font-bold text-slate-400 mb-5 relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("terms");
                    setIsMobileMoreOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-indigo-600 hover:underline transition-all cursor-pointer text-[11px]"
                >
                  Terms of Service
                </button>
                <span className="text-slate-300 pointer-events-none">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage("privacy");
                    setIsMobileMoreOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-indigo-600 hover:underline transition-all cursor-pointer text-[11px]"
                >
                  Privacy Policy
                </button>
              </div>

              {/* Sign out */}
              <button
                type="button"
                onClick={async () => {
                  setIsMobileMoreOpen(false);
                  try {
                    await logOutUser();
                    triggerToast("👋 Checked out of the OmniCast authorized cycle.");
                  } catch (e) {
                    triggerToast("Could not complete logout handoff");
                  }
                }}
                className="w-full shrink-0 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs rounded-2xl tracking-wide uppercase flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse-slow"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-500" />
                <span>Sign Out Account</span>
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 flex items-center space-x-2 animate-fade-in animate-bounce">
          <Info className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
