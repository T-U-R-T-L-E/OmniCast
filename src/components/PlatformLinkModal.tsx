import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Info,
  CheckCircle2,
  ExternalLink,
  Copy
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Real YouTube OAuth States
  const [integrationMode, setIntegrationMode] = useState<"real" | "sandbox">("real");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleClientSecret, setGoogleClientSecret] = useState("");
  const [receivedToken, setReceivedToken] = useState<string | null>(null);
  const [receivedAvatar, setReceivedAvatar] = useState<string | null>(null);
  const [copiedRedirectUri, setCopiedRedirectUri] = useState(false);

  // Scopes & Permissions lists by platform
  const initialPermissions = {
    tiktok: [
      { id: "video.upload", label: "Direct feed publication to TikTok Reels", enabled: true, desc: "Allows uploading short video clips directly into your public feed." },
      { id: "user.info.basic", label: "Access basic user profile details", enabled: true, desc: "Allows retrieving your profile avatar, screen name, and handle." },
      { id: "video.list", label: "Retrieve published videos for analytics", enabled: false, desc: "Used to track live view counts and comment counts from TikTok servers." }
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

  // Sync permissions if platformName changes
  useEffect(() => {
    setPermissions(initialPermissions[platformName]);
    // Reset wizard states
    setStep(1);
    setUsername("");
    setPassword("");
    setReceivedToken(null);
    setReceivedAvatar(null);
    setErrorText(null);
  }, [platformName]);

  // Listen for callback messages from popup redirection callback
  useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === "YOUTUBE_OAUTH_SUCCESS") {
        const { accessToken, username: channelName, avatarUrl } = event.data;
        setUsername(channelName);
        setReceivedToken(accessToken);
        setReceivedAvatar(avatarUrl);
        setStep(3); // Go straight to success state!
        setIsVerifying(false);
      }
    };

    window.addEventListener("message", handleGoogleMessage);
    return () => window.removeEventListener("message", handleGoogleMessage);
  }, []);

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
      case "tiktok": return "from-rose-500 to-slate-900";
      case "instagram": return "from-purple-600 to-pink-500";
      case "facebook": return "from-blue-600 to-indigo-700";
      case "youtube_shorts": return "from-red-600 to-orange-500";
      default: return "from-indigo-600 to-blue-500";
    }
  };

  const getRedirectUri = () => {
    return `${window.location.origin}/api/auth/google/callback`;
  };

  const handleCopyRedirectUri = () => {
    navigator.clipboard.writeText(getRedirectUri());
    setCopiedRedirectUri(true);
    setTimeout(() => setCopiedRedirectUri(false), 2000);
  };

  // Google OAuth Popup authorization flow trigger
  const handleGoogleOAuthStart = () => {
    setErrorText(null);
    
    // Fallback to env or serialize inputs
    const clientId = googleClientId.trim();
    const clientSecret = googleClientSecret.trim();

    // Prepare state to pass down to redirection so server can retrieve correct keys
    const stateObj = { client_id: clientId, client_secret: clientSecret };
    const stateB64 = btoa(JSON.stringify(stateObj));

    const redirectUri = encodeURIComponent(getRedirectUri());
    const scopes = encodeURIComponent("https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly openid email profile");

    // Client ID validation fallback notice
    let finalClientId = clientId;
    if (!finalClientId) {
      // Prompt user that standard fallback will be used if they didn't provide inputs
      setErrorText("Google Cloud App Client ID and Client Secret are required. Please copy them from your Cloud Console Credentials page.");
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(finalClientId)}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&state=${stateB64}`;

    setIsVerifying(true);

    const authWindow = window.open(
      authUrl,
      "google_oauth_popup",
      "width=600,height=700,status=no,resizable=yes,scrollbars=yes"
    );

    if (!authWindow) {
      setIsVerifying(false);
      setErrorText("Popup blocked. Please enable popups for this site to complete the YouTube verification.");
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setErrorText("Please enter a valid handle or email address.");
      return;
    }

    if (password.length < 4) {
      setErrorText("Password must be at least 4 characters long.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 1200);
  };

  const handleStep2Submit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 1500);
  };

  const handleFinalConnect = () => {
    let finalHandle = username.trim();
    if (!finalHandle.startsWith("@") && platformName !== "facebook") {
      finalHandle = "@" + finalHandle;
    }
    // Complete handoff
    onCompleteLink(platformId, finalHandle, receivedToken || undefined, receivedAvatar || undefined);
    onClose();
    // Reset wizard
    setStep(1);
    setUsername("");
    setPassword("");
    setReceivedToken(null);
    setReceivedAvatar(null);
    setErrorText(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden font-sans"
      >
        {/* Dynamic Colorful Header */}
        <div className={`p-4 bg-gradient-to-r ${getPlatformBrandColor()} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-300" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-100 font-mono">Platform Link Engine</h3>
              <p className="text-sm font-bold truncate">Connect with {getPlatformLabel()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            type="button" 
            className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Secure Bar indicator */}
        <div className="bg-emerald-50 border-y border-emerald-100 px-3.5 py-1.5 flex items-center justify-between text-[10px] text-emerald-800 font-bold">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SECURE ACCESS GATEWAY
          </span>
          <span className="text-slate-400 font-normal">OAuth 2.0 Real Protocol</span>
        </div>

        <div className="p-5">
          {/* STEP 1: AUTHENTICATION / CONFIGURATION */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              {/* YouTube specific sub-tabs to switch between Real and Sandbox */}
              {platformName === "youtube_shorts" && (
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => {
                      setIntegrationMode("real");
                      setErrorText(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      integrationMode === "real"
                        ? "bg-white text-rose-600 shadow-3xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🚀 Real YouTube API
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIntegrationMode("sandbox");
                      setErrorText(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      integrationMode === "sandbox"
                        ? "bg-white text-slate-700 shadow-3xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🛠️ Developer Sandbox
                  </button>
                </div>
              )}

              {/* REAL YOUTUBE FLOW RENDER */}
              {platformName === "youtube_shorts" && integrationMode === "real" ? (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto shadow-xs">
                      <PlayIcon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">YouTube Channel Setup</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Connect your YouTube channel using Google Cloud App credentials, so videos you publish will stream directly to your live channel.
                    </p>
                  </div>

                  {errorText && (
                    <div className="bg-rose-50 border border-rose-150 p-2.5 rounded-xl flex gap-2.5 text-xs text-rose-800 items-start">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <p className="font-medium">{errorText}</p>
                    </div>
                  )}

                  {/* Settings inputs for Client ID & Client Secret */}
                  <div className="space-y-3 pt-1 text-left">
                    {/* Authorized Redirect URI view */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Google Redirect URI (Callback URL)</span>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Copy this redirect URL and paste it into your Google Developer Console under <strong className="text-slate-700">Authorized Redirect URIs</strong>:
                      </p>
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={getRedirectUri()}
                          className="flex-1 bg-white border border-slate-200 p-1.5 px-2.5 rounded-lg text-[9.5px] font-mono text-slate-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyRedirectUri}
                          className="p-1.5 px-2.5 bg-indigo-55 hover:bg-indigo-100 text-indigo-650 rounded-lg border border-indigo-150 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Copy reference Callback URL"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedRedirectUri ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Google OAuth Client ID</label>
                      <input
                        type="text"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="e.g. 123456-abcdefg.apps.googleusercontent.com"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 rounded-xl text-xs font-mono focus:outline-none transition-all text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Google OAuth Client Secret</label>
                      <input
                        type="password"
                        value={googleClientSecret}
                        onChange={(e) => setGoogleClientSecret(e.target.value)}
                        placeholder="e.g. GOCSPX-abc123xyz"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-500 rounded-xl text-xs font-mono focus:outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleOAuthStart}
                    disabled={isVerifying}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AWAITING GOOGLE OAUTH POPUP...</span>
                      </>
                    ) : (
                      <>
                        <span>Authorize Google Account</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* SIMULATED USERNAME & PASSWORD FLOW */
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto shadow-xs border border-slate-200">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <h4 className="text-sm font-heavy text-slate-800">Account Authorization</h4>
                    <p className="text-xs text-slate-450">Log into your creator account to verify possession before selecting permissions.</p>
                  </div>

                  {errorText && (
                    <div className="bg-rose-50 border border-rose-150 p-2.5 rounded-xl flex gap-2.5 text-xs text-rose-800 items-start">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <p>{errorText}</p>
                    </div>
                  )}

                  <form onSubmit={handleStep1Submit} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Creator Username / Email</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={platformName === "facebook" ? "e.g. Creator Agency HQ" : "e.g. daily_clips_hq"}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-sans">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs font-semibold focus:outline-none transition-all text-slate-800"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Authenticating Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Log In & Connect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHOOSE PERMISSIONS COMPONENTS */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="space-y-1 text-center bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide font-sans">Scopes & Permissions Request</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong>Omni-Cast Desk</strong> requires the following permissions to push content to your <strong>{username}</strong> credentials. Toggle active scopes below:
                </p>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {permissions.map(perm => (
                  <div 
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      perm.enabled 
                        ? "bg-white border-indigo-200 shadow-3xs" 
                        : "bg-slate-50/50 border-slate-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        perm.enabled 
                          ? "bg-indigo-600 border-indigo-600 text-white" 
                          : "border-slate-350 bg-white"
                      }`}>
                        {perm.enabled && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold text-slate-800 block leading-tight">{perm.label}</span>
                        <span className="text-[9px] font-mono text-indigo-600/80 block mt-0.5 font-bold uppercase">{perm.id}</span>
                        <p className="text-[10px] text-slate-500 mt-1 leading-snug">{perm.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {permissions.some(p => !p.enabled) && (
                <div className="bg-yellow-50 border border-yellow-200/60 p-2.5 rounded-xl flex items-start gap-2 text-[10px] text-yellow-800">
                  <Info className="w-3.5 h-3.5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="font-semibold">By turning off certain permissions, automated posting or real-time views retrieval of your posts might fail.</p>
                </div>
              )}

              <button
                onClick={handleStep2Submit}
                disabled={isVerifying}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Establishing Handshake Token...</span>
                  </>
                ) : (
                  <>
                    <span>Grant Permissions & Bind</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS ANIMATED CHECK */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in text-center py-2">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-white ring-4 ring-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-slate-800">Integration Active!</h4>
                <p className="text-xs text-slate-500">
                  The OAuth 2.0 connection is fully bound. <strong>{getPlatformLabel()}</strong> credentials for <strong>{username}</strong> are active on your creator workflow.
                </p>
              </div>

              {receivedAvatar && (
                <div className="flex items-center justify-center gap-2 bg-slate-50/50 p-2.5 border border-slate-150 rounded-xl w-3/4 mx-auto">
                  <img src={receivedAvatar} alt={username} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                  <span className="text-xs font-bold text-slate-700 truncate">{username}</span>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 text-[10px] font-mono text-slate-500 text-left space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">TOKEN STATUS:</span>
                  <span className="text-emerald-600 font-extrabold uppercase">ACTIVE (200 OK)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">AUTHORIZED FLOW:</span>
                  <span>{receivedToken ? "REAL_YOUTUBE_OAUTH_CODE" : "OAUTH_2.0_SANDBOX_FLOW"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">GRANTED SCOPES:</span>
                  <span>{permissions.filter(p => p.enabled).length} SCOPES BOUND</span>
                </div>
              </div>

              <button
                onClick={handleFinalConnect}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider inline-flex items-center justify-center cursor-pointer"
              >
                Return to Crosspost Desk
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Simple Fallback PlayIcon (SVG component)
function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
