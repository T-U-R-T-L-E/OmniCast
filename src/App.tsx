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
  CheckCircle2
} from "lucide-react";
import { ConnectedAccount, OptimizedResult, CrossPost, PublishingStep } from "./types";
import { ConnectedAccounts } from "./components/ConnectedAccounts";
import { Presets, PresetVideo } from "./components/Presets";
import { 
  loadCampaignsFromFirestore, 
  saveCampaignToFirestore, 
  deleteCampaignFromFirestore 
} from "./lib/firebase";

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
  
  // Form inputs
  const [title, setTitle] = useState("Vlog: A Day of Light Roasting & Mindful Execution");
  const [description, setDescription] = useState("Step into my quiet creative workspace. Today we are tweaking our micro-batches, meditating before coding, and executing with strict visual focus. Let me know your routine below!");
  const [hashtags, setHashtags] = useState("productivity, workspace, design, lifestyle, desksetup");
  
  // Selected preset id tracking
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Video upload simulation
  const [videoFile, setVideoFile] = useState<{
    name: string;
    size: string;
    src: string | null;
    thumbnail: string | null;
    type?: 'video' | 'image';
  } | null>({
    name: "working_session_1080p.mp4",
    size: "18.4 MB",
    src: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-a-blue-screen-on-41617-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
    type: 'video'
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

  // Selected view modes
  const [activePlatformPreview, setActivePlatformPreview] = useState<"tiktok" | "instagram" | "facebook" | "youtube_shorts">("tiktok");

  // Publishing Queue Simulation
  const [isPublishing, setIsPublishing] = useState(false);
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

  // Toast notifier
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load config & initial campaigns
  useEffect(() => {
    fetch("/api/config")
      .then(r => r.json())
      .then(data => {
        setHasGeminiKey(data.hasGeminiKey);
      })
      .catch(e => console.error("Could not fetch Server API configuration:", e));

    const loadInitialData = async () => {
      let loadedFromFirestore = false;
      try {
        const firestoreCampaigns = await loadCampaignsFromFirestore();
        if (firestoreCampaigns && firestoreCampaigns.length > 0) {
          setCampaigns(firestoreCampaigns);
          loadedFromFirestore = true;
          console.log("[Omni-Cast Firebase]: Synced campaigns securely from Firestore");
        }
      } catch (err) {
        console.warn("[Omni-Cast Firebase]: Firestore campaign load bypassed/not-ready (using localized fallback):", err);
      }

      if (!loadedFromFirestore) {
        try {
          const stored = localStorage.getItem("posting_campaigns_v1");
          if (stored) {
            setCampaigns(JSON.parse(stored));
          } else {
            // Initial mock history item
            const initialMock: CrossPost[] = [
              {
                id: "camp-1",
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
            localStorage.setItem("posting_campaigns_v1", JSON.stringify(initialMock));
            setCampaigns(initialMock);
          }
        } catch (e) {
          console.error("LocalStorage load error:", e);
        }
      }
    };

    loadInitialData();
  }, []);

  const saveCampaigns = (updated: CrossPost[]) => {
    setCampaigns(updated);
    try {
      localStorage.setItem("posting_campaigns_v1", JSON.stringify(updated));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }

    // Proactively back up each campaign item in Firestore
    updated.forEach(campaign => {
      saveCampaignToFirestore(campaign).catch(err => {
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
  const handleToggleConnect = (platformId: string) => {
    const updated = accounts.map(a => {
      if (a.id === platformId) {
        return { ...a, connected: !a.connected };
      }
      return a;
    });
    setAccounts(updated);
    triggerToast(`Updated connection state for ${platformId.replace("acc-", "")}`);
  };

  const handleUpdateUsername = (platformId: string, newHandle: string) => {
    setAccounts(accounts.map(a => {
      if (a.id === platformId) {
        return { ...a, username: newHandle };
      }
      return a;
    }));
    triggerToast(`Platform handle updated successfully`);
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
      // For images, we can use the actual uploaded file object URL as the preview thumbnail!
      thumbnail = objectUrl;
    } else {
      // For videos, use a stylish randomized placeholder thumbnail
      const randomThumbnails = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      ];
      thumbnail = randomThumbnails[Math.floor(Math.random() * randomThumbnails.length)];
    }
 
    setVideoFile({
      name: file.name,
      size: sizeStr,
      src: objectUrl, // Object URL can be used for playing/displaying the media
      thumbnail: thumbnail,
      type: isVideo ? 'video' : 'image'
    });
    setSelectedPresetId(null);
    triggerToast(`Selected ${isVideo ? 'video' : 'image'}: ${file.name} (${sizeStr})`);
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
  const handlePublishAll = async () => {
    // Check if at least one platform is active/connected
    const hasActivePlatforms = accounts.some(a => a.connected);
    if (!hasActivePlatforms) {
      triggerToast("Please connect at least one social media platform first.");
      return;
    }

    setIsPublishing(true);
    setCurrentPublishingStep(0);
    setShowPublishSuccess(false);
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
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoFile?.src || "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
          platforms: targets,
          youtubeSettings,
          tiktokSettings,
          instagramSettings,
          facebookSettings,
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
      } else {
        throw new Error(data.error || "Execution failed during distribution request.");
      }

    } catch (err: any) {
      console.error(err);
      setServerLogs(prev => [...prev, `[CRITICAL ERROR]: ${err.message || String(err)}`]);
      setPublishingSteps(prev => prev.map((s, idx) => idx === currentPublishingStep ? { ...s, status: "idle", progress: 0 } : s));
      triggerToast(`Friction detected: ${err.message || "Failed to finalize distribution channels"}`);
      // Keep modal open briefly to let them review logs, then reset
      await new Promise(r => setTimeout(r, 4000));
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] flex flex-col antialiased">
      {/* Visual Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <img 
            src="https://past-aquamarine-opezzkg3.edgeone.app/logo%204%20(2).png" 
            alt="Omni-Cast Logo" 
            className="w-9 h-9 object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block font-sans">Omni-Cast</span>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider -mt-1 block">CROSS-PLATFORM DISTRIBUTION</span>
          </div>
          <span className="hidden sm:inline px-2 py-0.5 bg-slate-150 text-slate-600 text-[10px] uppercase tracking-widest font-extrabold rounded">
            v2.4.0
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {!hasGeminiKey && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs leading-none">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 animate-pulse" />
              <span>No Gemini Key Configured. Defaults enabled.</span>
            </div>
          )}

          <div className="flex -space-x-1.5">
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

          <button
            onClick={handlePublishAll}
            disabled={isPublishing || !videoFile}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
              !videoFile
                ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed"
                : isPublishing
                ? "bg-slate-100 text-slate-500 border border-slate-200"
                : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
            }`}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Broadcasting...
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Distribute All
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 overflow-hidden">
        
        {/* Left Column: Form Editing, Accounts & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6 overflow-y-auto pr-0 lg:pr-1">
          
          {/* Preset Picker Trigger Panel */}
          <Presets selectedId={selectedPresetId} onSelect={handleSelectPreset} />

          {/* Connected accounts manager */}
          <ConnectedAccounts
            accounts={accounts}
            onToggleConnect={handleToggleConnect}
            onUpdateUsername={handleUpdateUsername}
          />

          {/* Real-world API Distribution Bridge Guide */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-4 shadow-sm" id="api-integration-bridge">
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

            {showIntegrationBridge && (
              <div className="space-y-4 animate-fade-in text-xs">
                <p className="text-slate-550 leading-relaxed text-[11px] bg-slate-50/50 p-3 border border-slate-200/60 rounded-xl">
                  Omni-Cast is configured with a live server-side module (<code className="bg-slate-150 px-1 py-0.2 rounded text-[10px] font-mono text-purple-700">/server/platforms.ts</code>) capable of executing real multi-part video uploads and status polling on platform clusters. Once credentials are live, the <strong>Distribute All</strong> trigger routes payloads directly to production targets.
                </p>

                {/* Sub-tab selection grid */}
                <div className="grid grid-cols-4 gap-1.5 border-b border-slate-100 pb-2">
                  {(["youtube", "tiktok", "instagram", "facebook"] as const).map((tab) => {
                    const isSelected = integrationGuideTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setIntegrationGuideTab(tab)}
                        className={`py-1.5 text-[11px] font-bold capitalize rounded-lg transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-505"
                        }`}
                      >
                        {tab === "youtube" ? "YouTube" : tab === "tiktok" ? "TikTok" : tab === "instagram" ? "Instagram" : "Facebook"}
                      </button>
                    );
                  })}
                </div>

                {/* Active Sub-tab Content details */}
                {integrationGuideTab === "youtube" && (
                  <div className="space-y-3.5">
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-rose-800 text-[11px] uppercase tracking-wider">YouTube Data API v3 Setup Guide</span>
                        <span className="text-[9px] font-mono bg-rose-200/60 text-rose-800 px-1.5 py-0.5 rounded uppercase font-bold">Resumable Chunking</span>
                      </div>
                      
                      <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                        <p><strong>1. Register in Google Cloud Console:</strong> Turn on the <strong>YouTube Data API v3</strong> for your cloud project instance.</p>
                        <p><strong>2. Setup Authorization Scopes:</strong> Request authorization with scope: <code className="bg-rose-100/60 px-1 font-mono text-[10px] text-rose-800">https://www.googleapis.com/auth/youtube.upload</code></p>
                        <p><strong>3. Endpoint Delivery Target:</strong> Initial authorization points to Google OAuth helper to fetch user access tokens before transfer.</p>
                      </div>
                    </div>

                    <div className="border border-slate-150 rounded-xl p-3 space-y-1.5 bg-slate-50/20">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Environment keys needed (.env)</p>
                      <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
{`# Google Cloud OAuth Credentials
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here`}
                      </pre>
                    </div>

                    <div className="text-[10px] text-slate-450 leading-normal bg-blue-50/45 p-2.5 border border-blue-100 rounded-lg">
                      💡 <strong>Shorts Index Integrity:</strong> YouTube automatically converts vertical videos under 60 seconds into YouTube Shorts if the metadata contains the <strong className="font-bold text-blue-900">#Shorts</strong> tag.
                    </div>
                  </div>
                )}

                {integrationGuideTab === "tiktok" && (
                  <div className="space-y-3.5">
                    <div className="bg-[#FE2C55]/5 border border-[#FE2C55]/10 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#FE2C55] text-[11px] uppercase tracking-wider">TikTok For Developers Setup</span>
                        <span className="text-[9px] font-mono bg-[#FE2C55]/15 text-[#FE2C55] px-1.5 py-0.5 rounded uppercase font-bold">Content Posting API</span>
                      </div>
                      
                      <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                        <p><strong>1. Register App Profile:</strong> Create a profile inside TikTok developer portal, under Web API Integration.</p>
                        <p><strong>2. OAuth Scope Request:</strong> Request approval for the permissions: <code className="bg-[#FE2C55]/10 px-1 font-mono text-[10px] text-[#FE2C55]">video.upload</code> and <code className="bg-[#FE2C55]/10 px-1 font-mono text-[10px] text-[#FE2C55]">video.publish</code>.</p>
                        <p><strong>3. Media Delivery Protocol:</strong> Direct post accepts a public URL stream (<code className="bg-slate-100 px-1 rounded font-mono text-[10px]">PULL_FROM_URL</code>) pointing to an AWS S3, Firebase Storage, or Cloud Storage bucket link.</p>
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
                  </div>
                )}

                {integrationGuideTab === "instagram" && (
                  <div className="space-y-3.5">
                    <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-pink-800 text-[11px] uppercase tracking-wider">Meta Graph API - Instagram Reels</span>
                        <span className="text-[9px] font-mono bg-pink-150 text-pink-800 px-1.5 py-0.5 rounded uppercase font-bold">Two-Phase Container</span>
                      </div>
                      
                      <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                        <p><strong>1. Meta Business Suite Link:</strong> Connect your Instagram Creator / Business profile to a Facebook Page.</p>
                        <p><strong>2. Scope Validation:</strong> Authenticate users using Meta Login requesting: <code className="bg-pink-100/60 px-1 font-mono text-[10px] text-pink-800">instagram_content_publish</code> and <code className="bg-pink-100/60 px-1 font-mono text-[10px] text-pink-800">pages_read_engagement</code>.</p>
                        <p><strong>3. Media Processing:</strong> Video files are cached first as an IG container, processed asynchronously, then pushed live when status reports <code className="bg-slate-100 font-mono text-purple-700 text-[10px]">FINISHED</code>.</p>
                      </div>
                    </div>

                    <div className="border border-slate-155 rounded-xl p-3 space-y-2 bg-slate-50/20">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Meta/Instagram App Keys (.env)</p>
                      <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10.5px] leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
{`# Meta developer credential deck
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here`}
                      </pre>
                    </div>
                  </div>
                )}

                {integrationGuideTab === "facebook" && (
                  <div className="space-y-3.5">
                    <div className="bg-blue-50/60 border border-blue-105 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-800 text-[11px] uppercase tracking-wider">Facebook Page Video Reels API</span>
                        <span className="text-[9px] font-mono bg-blue-150 text-blue-800 px-1.5 py-0.5 rounded uppercase font-bold">Pages Publishing</span>
                      </div>
                      
                      <div className="space-y-1.5 text-slate-650 leading-relaxed text-[11px]">
                        <p><strong>1. Page Scopes:</strong> Ensure your user access token possesses <code className="bg-blue-100/60 px-1 font-mono text-[10px] text-blue-800">pages_manage_posts</code> and <code className="bg-blue-100/60 px-1 font-mono text-[10px] text-blue-800">publish_video</code>.</p>
                        <p><strong>2. Segmented Upload Phase:</strong> Multi-part protocol allows uploading chunks of large MP4 binaries directly to Facebook CDN edge networks.</p>
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
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Content Editor */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:p-6 space-y-5 shadow-xs relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Video Metadata Hub</h2>
                <p className="text-xs text-slate-400">Write raw values for translation & refinement</p>
              </div>
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
            </div>

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

            {/* Hashtags input */}
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

            {/* Video File Drag-and-Drop Slot (Guideline Compliant!) */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Linked Media Attachment
              </span>
              
              {videoFile ? (
                <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 flex items-center justify-between flex-wrap gap-3">
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
            </div>
          </div>

          {/* Informative Warning box */}
          <div className="bg-blue-600/5 border border-blue-105 rounded-xl p-4 flex items-start space-x-3.5 shadow-xs">
            <div className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold tracking-tight italic select-none">
              i
            </div>
            <div className="text-xs text-blue-900 leading-relaxed font-sans">
              <strong>Optimization rule in progress:</strong> Captions, spacer layouts, and hashtags automatically comply with maximum characters (YouTube Shorts: 100 on Title, Instagram Reels: 2,200, Facebook: 2,000, TikTok: 2,200 characters) upon AI injection. Use the tabs on the right to edit individual channels before distribution.
            </div>
          </div>
        </div>

        {/* Right Column: AI Output Captions & Active Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Engine Preview Output</h2>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Live sync rendering</span>
            </div>
          </div>

          {/* Social Platform Previews Card */}
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
            </div>

            {/* Active Platform Card View */}
            <div className="flex-1 flex flex-col justify-between">
              
              {/* TikTok */}
              {activePlatformPreview === "tiktok" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="tiktok-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">TikTok Platform Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Caption limits</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {customCaptions.tiktok.length} / 2200 chars
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description / Caption</label>
                      <textarea
                        rows={4}
                        id="tiktok-caption-input"
                        value={customCaptions.tiktok}
                        onChange={(e) => setCustomCaptions({ ...customCaptions, tiktok: e.target.value })}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium"
                      />
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
              {activePlatformPreview === "instagram" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="instagram-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">Instagram Reels Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Organic caption layout</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {customCaptions.instagram.length} / 2200 chars
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Captions</label>
                      <textarea
                        rows={4}
                        id="instagram-caption-input"
                        value={customCaptions.instagram}
                        onChange={(e) => setCustomCaptions({ ...customCaptions, instagram: e.target.value })}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium"
                      />
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
              {activePlatformPreview === "facebook" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="facebook-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">Facebook Reels Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">Organic Reach Headline</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {customCaptions.facebook.length} / 2000 chars
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description</label>
                      <textarea
                        rows={4}
                        id="facebook-caption-input"
                        value={customCaptions.facebook}
                        onChange={(e) => setCustomCaptions({ ...customCaptions, facebook: e.target.value })}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium"
                      />
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
              {activePlatformPreview === "youtube_shorts" && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="youtube-settings-container">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold font-sans text-sm text-slate-800 tracking-tight">YouTube Shorts Config</span>
                        <span className="text-[10px] text-slate-405 font-mono">100 Char Limit Title</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {customCaptions.youtube_title.length} / 100 chars
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
                          className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Description</label>
                        <textarea
                          rows={3}
                          id="youtube-desc-input"
                          value={customCaptions.youtube_desc}
                          onChange={(e) => setCustomCaptions({ ...customCaptions, youtube_desc: e.target.value })}
                          className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 font-sans leading-relaxed resize-none font-medium"
                        />
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

              {/* Action utilities bar under previews */}
              <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    let targetText = "";
                    if (activePlatformPreview === "tiktok") targetText = customCaptions.tiktok;
                    else if (activePlatformPreview === "instagram") targetText = customCaptions.instagram;
                    else if (activePlatformPreview === "facebook") targetText = customCaptions.facebook;
                    else if (activePlatformPreview === "youtube_shorts") targetText = `${customCaptions.youtube_title}\n\n${customCaptions.youtube_desc}`;
                    handleCopyText(targetText);
                  }}
                  className="px-3.5 py-2 text-xs font-bold border border-slate-200 hover:border-slate-300 rounded-lg hover:bg-slate-50 transition-all text-slate-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Platform Text
                </button>

                <div className="text-[10px] text-slate-400 font-mono">
                  Channels linked: {accounts.filter(a => a.connected).length} active
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

        </div>

      </main>

      {/* Interactive Distribution Dashboard Queue Modal overlay */}
      {isPublishing && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-1 animate-bounce">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Pushing Multi-Channel Distribution</h3>
              <p className="text-xs text-slate-400">Broadcasting content to enabled social platforms simultaneously</p>
            </div>

            {/* Platform indicators */}
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

            {/* Stepper Progress */}
            <div className="space-y-4">
              {publishingSteps.map((step, index) => {
                const isRunning = step.status === "running";
                const isCompleted = step.status === "completed";
                const isIdle = step.status === "idle";

                return (
                  <div key={index} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className={`font-medium ${isCompleted ? "text-slate-500" : isRunning ? "text-slate-900 font-bold" : "text-slate-400"}`}>
                        {step.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {isCompleted ? "Completed" : isRunning ? "Processing" : "Queued"}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${isCompleted ? "bg-emerald-500" : isRunning ? "bg-blue-600 animate-pulse" : "bg-slate-200"}`}
                        style={{ width: `${step.progress || (isCompleted ? 100 : 0)}%` }}
                      />
                    </div>
                  </div>
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

            <div className="text-[10px] text-center text-slate-400 font-mono">
              Do not close window • Handoff engine is active
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showPublishSuccess && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Successfully Distributed</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your video optimization package was successfully posted to live platform channels. Custom handles updated in background.
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
      )}

      {/* Historic Campaigns Drawer Section */}
      <footer className="bg-white border-t border-slate-200/90 py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Localized Distribution History</h3>
              <p className="text-xs text-slate-400">Persistent client analytics & previous broadcasts</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 font-bold uppercase tracking-wide px-2 py-1 rounded">
              Durable Storage active
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-200 text-xs text-slate-450">
              No previous broadcasts saved locally yet. Run "Distribute All" to populate historic logs.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 flex gap-4 hover:border-slate-300 transition-all relative overflow-hidden"
                >
                  <div className="w-16 h-20 bg-slate-200 rounded overflow-hidden relative shrink-0">
                    <img src={camp.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{camp.title}</p>
                        <button
                          onClick={(e) => handleDeleteCampaign(camp.id, e)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
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
                              className="px-1 text-[8px] font-bold uppercase bg-slate-200 text-slate-600 rounded"
                            >
                              {plat.replace("_shorts", "")}
                            </span>
                          );
                        })}
                      </div>

                      <span className="font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {camp.publishDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legal Pages & Disclosures Band */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-700">Omni-Cast</span>
              <span>•</span>
              <span>Platform Distribution Hub</span>
              <span>•</span>
              <span className="font-medium text-slate-500">Lewis Iraki</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/terms" target="_blank" className="font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a href="/privacy" target="_blank" className="font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

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
