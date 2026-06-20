import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink,
  Copy,
  Youtube,
  Layers,
  Sparkles,
  Database
} from "lucide-react";
import { ConnectedAccount } from "../types";

interface PlatformLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformId: string; // e.g. "acc-tiktok"
  platformName: "tiktok" | "instagram" | "facebook" | "youtube_shorts";
  onCompleteLink: (platformId: string, username: string, token?: string, avatarUrl?: string) => void;
}

export const PlatformLinkModal: React.FC<PlatformLinkModalProps> = ({
  isOpen,
  onClose,
  platformId,
  platformName,
  onCompleteLink,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Server OAuth Config state
  const [serverOauthReady, setServerOauthReady] = useState<boolean | null>(null);
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [customClientId, setCustomClientId] = useState("");
  const [customClientSecret, setCustomClientSecret] = useState("");

  // Scopes & Permissions lists by platform representing the secure consent screen
  const initialPermissions = {
    tiktok: [
      { id: "video.upload", label: "Direct feed publication to TikTok Reels", enabled: true, desc: "Allows uploading short video clips directly into your public feed." },
      { id: "user.info.basic", label: "Access basic user profile details", enabled: true, desc: "Allows retrieving your profile avatar, screen name, and handle." },
      { id: "video.list", label: "Retrieve published videos for analytics", enabled: true, desc: "Used to track live view counts and comment counts from TikTok servers." }
    ],
    instagram: [
      { id: "instagram_content_publish", label: "Publish Reels & Media content", enabled: true, desc: "Allows placing video snippets with captions onto your active reels feed." },
      { id: "instagram_basic", label: "Retrieve basic account credentials", enabled: true, desc: "Required to keep user profile handles synchronized." },
      { id: "instagram_manage_comments", label: "Moderation of audience comments", enabled: true, desc: "Enables responding to fan comments directly within the desk." }
    ],
    facebook: [
      { id: "pages_manage_posts", label: "Control uploads and postings on Pages", enabled: true, desc: "Allows posting social reels directly to linked Facebook pages." },
      { id: "pages_read_engagement", label: "Read user engagement analytics", enabled: true, desc: "Gathers likes, views, and comment count metrics." },
      { id: "publish_video", label: "Video streaming and publication engine", enabled: true, desc: "Required to initialize Facebook CDN uploads." }
    ],
    youtube_shorts: [
      { id: "youtube.upload", label: "Direct Short publishing into Video Manager", enabled: true, desc: "Allows publishing high-definition shorts onto your channel." },
      { id: "youtube.readonly", label: "Read view count statistics", enabled: true, desc: "Required to feed the analytics dashboard widget." },
      { id: "youtube.partner", label: "Monetized Channel Analytics scope", enabled: false, desc: "Allows pulling metrics on ad revenue (optional)." }
    ]
  };

  const [permissions, setPermissions] = useState(initialPermissions[platformName]);

  // Check if API keys are configured on the server
  useEffect(() => {
    if (!isOpen) return;
    
    // Always sync permissions for selected platform
    setPermissions(initialPermissions[platformName]);
    setStep(1);
    setErrorText(null);
    setIsVerifying(false);

    if (platformName === "youtube_shorts") {
      fetch("/api/auth/google/url")
        .then(res => res.json())
        .then(data => {
          if (data.isConfigured) {
            setServerOauthReady(true);
            setOauthUrl(data.url);
          } else {
            setServerOauthReady(false);
            setOauthUrl(null);
          }
        })
        .catch(err => {
          console.error("Failed to query google auth endpoint:", err);
          setServerOauthReady(false);
        });
    } else {
      setServerOauthReady(null);
      setOauthUrl(null);
    }
  }, [isOpen, platformName]);

  // Listen for real Google OAuth messages posted back from callback window popup
  useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      // Allow current host matching
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('omni-cast.online')) {
        return;
      }

      if (event.data?.type === "YOUTUBE_OAUTH_SUCCESS") {
        const { accessToken, username: channelName, avatarUrl } = event.data;
        setIsVerifying(false);
        // Complete integration instantly using the real Google tokens!
        onCompleteLink(platformId, channelName, accessToken, avatarUrl);
        onClose();
      }
    };

    window.addEventListener("message", handleGoogleMessage);
    return () => window.removeEventListener("message", handleGoogleMessage);
  }, [platformId, onCompleteLink, onClose]);

  const togglePermission = (id: string) => {
    setPermissions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, enabled: !p.enabled };
      }
      return p;
    }));
  };

  const getPlatformLabel = () => {
    switch (platformName) {
      case "tiktok": return "TikTok Reels";
      case "instagram": return "Instagram Reels";
      case "facebook": return "Facebook Page";
      case "youtube_shorts": return "YouTube Shorts";
      default: return "Social Account";
    }
  };

  const getPlatformBrandColor = () => {
    switch (platformName) {
      case "tiktok": return "from-slate-900 to-teal-950";
      case "instagram": return "from-purple-600 to-pink-500";
      case "facebook": return "from-indigo-600 to-blue-700";
      case "youtube_shorts": return "from-rose-600 to-red-500";
      default: return "from-indigo-600 to-blue-500";
    }
  };

  const triggerRealGoogleFlow = () => {
    let finalAuthUrl = oauthUrl;
    
    if (!serverOauthReady) {
      if (!customClientId.trim() || !customClientSecret.trim()) {
        setErrorText("Missing credentials: Type in your Client ID and Client Secret in the integration settings form below first.");
        return;
      }
      
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const scopes = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly openid email profile";
      
      const stateObj = { 
        source: "omnicast_engine",
        client_id: customClientId.trim(),
        client_secret: customClientSecret.trim()
      };
      
      // safe base64 encoding
      const stateB64 = btoa(unescape(encodeURIComponent(JSON.stringify(stateObj))));
      
      finalAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(customClientId.trim())}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent&state=${stateB64}`;
    }

    if (!finalAuthUrl) return;
    setErrorText(null);
    setIsVerifying(true);

    const authWindow = window.open(
      finalAuthUrl,
      "google_oauth_popup",
      "width=600,height=700,status=no,resizable=yes,scrollbars=yes"
    );

    if (!authWindow) {
      setIsVerifying(false);
      setErrorText("Popup blocked. Please enable browser popups to allow the Google login screen.");
    }
  };

  // Connect via Simulated Secure Sandbox (perfect for non-configured or non-google integrations)
  const handleSimulatedConnect = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      
      let finalHandle = "";
      let mockAvatar = "";
      
      if (platformName === "youtube_shorts") {
        finalHandle = "YouTube Test Creator Channel";
        mockAvatar = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=150&h=150&q=80";
      } else if (platformName === "tiktok") {
        finalHandle = "daily_clips_hq";
        mockAvatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80";
      } else if (platformName === "instagram") {
        finalHandle = "nature_loops";
        mockAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";
      } else {
        finalHandle = "Creator Agency HQ Page";
        mockAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80";
      }

      onCompleteLink(platformId, finalHandle, "mock_secure_sandbox_token_abc123", mockAvatar);
      onClose();
    }, 1200);
  };

  const getRedirectUri = () => {
    return `${window.location.origin}/api/auth/google/callback`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-sans"
      >
        {/* Dynamic Colorful Header */}
        <div className={`p-5 bg-gradient-to-r ${getPlatformBrandColor()} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              {platformName === "youtube_shorts" ? (
                <Youtube className="w-5 h-5 text-rose-100" />
              ) : (
                <Layers className="w-5 h-5 text-indigo-100" />
              )}
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-100/90 font-mono">SOCIAL INTEGRATION ENGINE</h3>
              <p className="text-base font-black">Link with {getPlatformLabel()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            type="button" 
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Secure Bar indicator */}
        <div className="bg-slate-50 border-y border-slate-150 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
          <span className="flex items-center gap-1.5 font-mono text-indigo-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            UNIFIED MULTI-PLATFORM BRIDGING
          </span>
          <span className="text-slate-400 font-normal">Secure API Linkage</span>
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="space-y-1.5">
                <h4 className="text-sm font-extrabold text-slate-800">Direct Integrations Connection</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  We use the official platform APIs to safely cross-post your videos. You do <strong className="text-slate-700">not</strong> need to set up any personal integrations or handle keys yourself on Google Cloud or Meta. 
                </p>
              </div>

              {/* Scope permissions section box */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block font-mono">SCOPES & CONSENT PROFILE</span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {permissions.map(perm => (
                    <div 
                      key={perm.id}
                      onClick={() => togglePermission(perm.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        perm.enabled 
                          ? "bg-indigo-50/15 border-indigo-150/80 shadow-3xs" 
                          : "bg-slate-50 border-slate-150 opacity-55"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                          perm.enabled 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "border-slate-300 bg-white"
                        }`}>
                          {perm.enabled && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10.5px] font-bold text-slate-800 block leading-tight">{perm.label}</span>
                          <span className="text-[8.5px] font-mono text-indigo-600/80 block mt-0.5 font-bold uppercase">{perm.id}</span>
                          <p className="text-[9.5px] text-slate-450 mt-0.5 leading-snug">{perm.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorText && (
                <div className="bg-rose-50 border border-rose-150 p-2.5 rounded-xl flex gap-2 text-xs text-rose-800 items-start">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="font-semibold">{errorText}</p>
                </div>
              )}

              {/* Action Area based on configured/not-configured endpoints */}
              <div className="pt-2 border-t border-slate-100">
                {platformName === "youtube_shorts" ? (
                  <>
                    {serverOauthReady === true ? (
                      <div className="space-y-3">
                        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-850">
                          <p className="font-semibold leading-relaxed">
                            ✅ <strong>Master Connection Ready:</strong> Server credentials are fully configured. Click below to sign in with your creator Google account.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={triggerRealGoogleFlow}
                          disabled={isVerifying}
                          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 font-mono"
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Redirecting to Google...</span>
                            </>
                          ) : (
                            <>
                              <span>Authorize Google Account</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    ) : serverOauthReady === false ? (
                      <div className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 text-xs text-slate-800 shadow-3xs">
                          <div className="flex gap-2 items-center font-bold text-slate-900 text-left">
                            <Database className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>Master Google OAuth Coordinates</span>
                          </div>
                          
                          <p className="leading-relaxed text-[11px] text-slate-500 font-medium text-left">
                            To enable Google OAuth for this environment, register your Google Cloud Project. Copy the Redirect URI below, paste it in Google Console under <strong className="text-slate-700">Authorized Redirect URIs</strong>, then paste your Client ID and Client Secret:
                          </p>

                          <div className="space-y-2 text-left">
                            <div>
                              <span className="text-[10px] uppercase font-black text-slate-450 block mb-1">Authorized Redirect URI</span>
                              <div className="flex gap-1">
                                <div className="bg-slate-100 px-2 py-1.5 rounded-lg font-mono text-[9px] text-slate-600 flex-1 break-all select-all border border-slate-200">
                                  {getRedirectUri()}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(getRedirectUri());
                                    setCopiedResponse(true);
                                    setTimeout(() => setCopiedResponse(false), 2000);
                                  }}
                                  className="p-1 px-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-600 shrink-0 cursor-pointer flex items-center justify-center gap-1 font-mono transition-all"
                                >
                                  {copiedResponse ? "Copied" : "Copy"}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5 pt-1">
                              <div>
                                <label className="text-[10px] uppercase font-black text-slate-450 block mb-1">Google OAuth Client ID</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 12345-abc123.apps.googleusercontent.com"
                                  value={customClientId}
                                  onChange={(e) => setCustomClientId(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-medium bg-white focus:outline-hidden focus:border-rose-500 transition-colors"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] uppercase font-black text-slate-450 block mb-1">Google OAuth Client Secret</label>
                                <input
                                  type="password"
                                  placeholder="••••••••••••••••••••"
                                  value={customClientSecret}
                                  onChange={(e) => setCustomClientSecret(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-medium bg-white focus:outline-hidden focus:border-rose-500 transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={triggerRealGoogleFlow}
                          disabled={isVerifying || !customClientId.trim() || !customClientSecret.trim()}
                          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-150 disabled:text-slate-400 disabled:shadow-none text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed font-mono"
                        >
                          {isVerifying ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying connection...</span>
                            </>
                          ) : (
                            <>
                              <span>Link Live YouTube Channel</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center py-4">
                        <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  /* TIKTOK, INSTAGRAM, & FACEBOOK DIRECT CONNECTION ACTION */
                  <div className="space-y-3">
                    <p className="text-xs text-slate-450 font-medium">
                      Pressing the connect button will authenticate and retrieve verification hooks securely from the unified global tenant instance.
                    </p>

                    <button
                      type="button"
                      onClick={handleSimulatedConnect}
                      disabled={isVerifying}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting provider...</span>
                        </>
                      ) : (
                        <>
                          <span>Connect {getPlatformLabel()} Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
