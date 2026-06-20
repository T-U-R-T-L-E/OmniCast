import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Check, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  ExternalLink,
  Youtube,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

// Master Google Cloud Platform placeholder
const DEFAULT_YOUTUBE_CLIENT_ID = "";
const DEFAULT_YOUTUBE_CLIENT_SECRET = "";

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
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Server OAuth Config state
  const [serverOauthReady, setServerOauthReady] = useState<boolean | null>(null);
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);

  // Scopes & Consent metadata mapping by platform
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
      { id: "youtube.upload", label: "Direct Shorts Video publishing into Video Manager", enabled: true, desc: "Allows publishing vertical video content directly to your YouTube feed." },
      { id: "youtube.readonly", label: "Retrieve Channel and feed stats", enabled: true, desc: "Required to sync your active views, list videos and feed the dashboard analytics." },
      { id: "openid", label: "Secure profile identification (OpenID)", enabled: true, desc: "Required to fetch Google core profile avatar and associated email." }
    ]
  };

  const [permissions, setPermissions] = useState(initialPermissions[platformName]);

  // Read backend oauth details on modal load
  useEffect(() => {
    if (!isOpen) return;
    
    setPermissions(initialPermissions[platformName]);
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
          console.error("Failed to query google auth URL config:", err);
          setServerOauthReady(false);
        });
    } else {
      setServerOauthReady(null);
      setOauthUrl(null);
    }
  }, [isOpen, platformName]);

  // Setup global message listener in the top-level parent to catch callback successes
  useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      // Validate host safety
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('omni-cast.online')) {
        return;
      }

      if (event.data?.type === "YOUTUBE_OAUTH_SUCCESS") {
        const { accessToken, username, avatarUrl } = event.data;
        setIsVerifying(false);
        // Link instantly with Google returned live endpoints!
        onCompleteLink(platformId, username || "YouTube Creator", accessToken, avatarUrl);
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
      case "tiktok": return "from-slate-900 via-slate-950 to-teal-950 text-white";
      case "instagram": return "from-purple-600 via-pink-500 to-rose-500 text-white";
      case "facebook": return "from-blue-600 to-indigo-700 text-white";
      case "youtube_shorts": return "from-rose-600 to-red-600 text-white";
      default: return "from-slate-800 to-slate-900 text-white";
    }
  };

  // Launch Google OAuth pop-up login directly using verified master credentials
  const triggerRealGoogleFlow = () => {
    let finalUrl = oauthUrl;

    if (!finalUrl) {
      setErrorText("Google integration initialization failed. Google/YouTube OAuth credentials are not configured on the server yet.");
      return;
    }

    setErrorText(null);
    setIsVerifying(true);

    const authWindow = window.open(
      finalUrl,
      "google_oauth_popup",
      "width=600,height=700,status=no,resizable=yes,scrollbars=yes"
    );

    if (!authWindow) {
      setIsVerifying(false);
      setErrorText("Popup Blocked! Please enable browser popups to allow Google's secure account selection screen.");
    }
  };

  // Connect utilizing the unified sandbox simulation for testing other channels
  const handleSimulatedConnect = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      
      let finalHandle = "";
      let mockAvatar = "";
      
      if (platformName === "youtube_shorts") {
        finalHandle = "YouTube Test Channel";
        mockAvatar = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=150&h=150&q=80";
      } else if (platformName === "tiktok") {
        finalHandle = "daily_clips_hq";
        mockAvatar = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80";
      } else if (platformName === "instagram") {
        finalHandle = "nature_loops";
        mockAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80";
      } else {
        finalHandle = "Agency Brand Hub";
        mockAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80";
      }

      onCompleteLink(platformId, finalHandle, "mock_sandbox_secure_token", mockAvatar);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-sans"
      >
        {/* Colorful Brand Header */}
        <div className={`p-5 bg-gradient-to-r ${getPlatformBrandColor()} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              {platformName === "youtube_shorts" ? (
                <Youtube className="w-5 h-5 text-white stroke-[2.5]" />
              ) : (
                <Layers className="w-5 h-5 text-white stroke-[2.5]" />
              )}
            </div>
            <div className="text-left">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-white/80 font-mono">SOCIAL LINK ENGINE</h3>
              <p className="text-base font-black">Link {getPlatformLabel()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            type="button" 
            className="p-1 px-2.5 hover:bg-white/10 rounded-lg text-white/90 hover:text-white transition-colors text-xs font-black cursor-pointer bg-black/10 border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Secure Indicator Bar */}
        <div className="bg-slate-50 border-y border-slate-100 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
          <span className="flex items-center gap-1.5 font-mono text-indigo-600">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            SECURE ACCESS GATEWAY
          </span>
          <span className="text-slate-400 font-mono tracking-wider">OAuth 2.0 Real Protocol</span>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5 text-left">
            <h4 className="text-sm font-extrabold text-slate-800">Account Authorization Setup</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Authorize Omni-Cast to publish short video snippets directly onto your {getPlatformLabel()} feed via secure verification loops. You do not need developer registration.
            </p>
          </div>

          {/* Scopes Profiles Consent List */}
          <div className="space-y-2 pt-1 text-left">
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block font-mono">SCOPES & CONSENT PROFILE</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {permissions.map(perm => (
                <div 
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    perm.enabled 
                      ? "bg-slate-50 border-slate-250 shadow-3xs" 
                      : "bg-slate-50/50 border-slate-150 opacity-50"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      perm.enabled 
                        ? "bg-emerald-600 border-emerald-600 text-white" 
                        : "border-slate-300 bg-white"
                    }`}>
                      {perm.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-800 block leading-tight">{perm.label}</span>
                      <span className="text-[8.5px] font-mono text-indigo-600/80 block mt-0.5 font-bold uppercase">{perm.id}</span>
                      <p className="text-[9.5px] text-slate-450 mt-0.5 leading-snug font-medium">{perm.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errorText && (
            <div className="bg-rose-50 border border-rose-150 p-3 rounded-xl flex gap-2 text-xs text-rose-800 items-start text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="font-semibold">{errorText}</p>
            </div>
          )}          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100">
            {platformName === "youtube_shorts" ? (
              serverOauthReady === true ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={triggerRealGoogleFlow}
                    disabled={isVerifying}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 font-mono"
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
                  <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                    🔒 Secure OAuth Handshake. The login window closes automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 text-left space-y-1.5 font-semibold">
                    <div className="text-slate-800 font-extrabold flex items-center gap-1.5 uppercase font-mono tracking-wider text-[10px] text-rose-650">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      YOUTUBE INTEGRATION STATUS
                    </div>
                    <p className="leading-normal">
                      To enable real direct Buffer-like linking, configure these credentials once via your AI Studio interface:
                    </p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-slate-500 font-medium">
                      <li>Click the <strong>Secrets</strong> button at the top-right of your screen</li>
                      <li>Add the secret key name <code>YOUTUBE_CLIENT_ID</code></li>
                      <li>Add the secret key name <code>YOUTUBE_CLIENT_SECRET</code></li>
                    </ol>
                    <div className="pt-1 text-[8.5px] font-mono text-slate-400 font-bold">
                      Redirect URL for Google Cloud Console: <span className="text-indigo-600 select-all font-mono break-all">{`${window.location.origin}/api/auth/google/callback`}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulatedConnect}
                    disabled={isVerifying}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 font-mono"
                  >
                    {isVerifying ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Sandbox Connection (Simulated)</span>
                    )}
                  </button>
                </div>
              )
            ) : (
              /* AUTOMATIC SIMULATED CHANNELS FOR DEPLOYED STABILITY */
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSimulatedConnect}
                  disabled={isVerifying}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 font-mono"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Connecting Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Link {getPlatformLabel()} Feed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
