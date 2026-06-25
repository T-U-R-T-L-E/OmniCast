import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Share2, 
  Eye, 
  BarChart3, 
  ArrowRight, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Menu, 
  X, 
  Send,
  MessageSquare,
  Users,
  Video,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle2,
  MapPin,
  HelpCircle,
  Code,
  Laptop,
  Terminal,
  ArrowRightLeft,
  Heart,
  Bookmark,
  Music,
  MoreVertical,
  Play,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Search
} from "lucide-react";

interface HeaderProps {
  activePage: string;
  onNavigate: (page: any) => void;
  onTriggerToast: (msg: string) => void;
  isAuthenticated?: boolean;
}

export function MarketingHeader({ activePage, onNavigate, onTriggerToast, isAuthenticated }: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "Resources" },
    { id: "contact", label: "Contact Us" }
  ];

  return (
    <header id="marketing-header" className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between text-white">
      {/* Brand logo & name */}
      <div 
        id="logo-container"
        className="flex items-center space-x-3 cursor-pointer group"
        onClick={() => onNavigate("home")}
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 opacity-40 blur-sm group-hover:opacity-70 transition-opacity duration-300"></div>
          <img 
            src="https://past-aquamarine-opezzkg3.edgeone.app/logo%204%20(2).png" 
            alt="Upload-Post Logo" 
            className="relative w-10 h-10 object-contain rounded-lg border border-slate-700/50 bg-[#0B0F19]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Upload-Post
          </span>
          <span className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase">
            SaaS Cross-Posting API
          </span>
        </div>
      </div>

      {/* Desktop navigation links */}
      <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 font-medium text-sm">
        {links.map((link) => {
          const isActive = activePage === link.id;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                onNavigate(link.id);
                onTriggerToast(`Navigating to ${link.label}`);
              }}
              className={`relative py-1.5 transition-colors cursor-pointer text-slate-300 hover:text-white ${
                isActive ? "text-white font-semibold" : ""
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeMarketingIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop actions button */}
      <div className="hidden md:flex items-center space-x-4">
        {!isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={() => {
                onNavigate("auth");
                onTriggerToast("Opening sign-in panel");
              }}
              className="text-slate-300 hover:text-white transition-colors text-xs font-bold px-3 py-2 cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate("auth");
                onTriggerToast("Directing to startup panel");
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-lg shadow-indigo-950/50 hover:shadow-indigo-900/60 transition-all duration-200 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              onNavigate("upload");
              onTriggerToast("Entering the app workspace");
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-lg shadow-indigo-950/50 hover:shadow-indigo-900/60 transition-all duration-200 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mobile menu hamburger toggle */}
      <div className="flex items-center md:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-18 bg-[#0B0F19] border-b border-slate-800 px-6 py-6 flex flex-col space-y-4 md:hidden z-50 shadow-2xl"
          >
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  onNavigate(link.id);
                  setIsMobileOpen(false);
                }}
                className={`text-left py-2.5 text-base font-semibold text-slate-300 hover:text-white transition-colors ${
                  activePage === link.id ? "text-indigo-400" : ""
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  onNavigate(isAuthenticated ? "upload" : "auth");
                  setIsMobileOpen(false);
                }}
                className="w-full py-3 rounded-xl text-center text-sm font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg flex items-center justify-center gap-2"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Get Started Now"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// 1. HOME VIEW
export function HomeView({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const pillars = [
    {
      icon: "🚀",
      title: "One API call to post on all platforms",
      desc: "Distribute your content to every major channel with a single backend request."
    },
    {
      icon: "⏰",
      title: "Schedule and automate social media posts",
      desc: "Queue your uploads and set exact automated publishing windows."
    },
    {
      icon: "📊",
      title: "Social media analytics and metrics API",
      desc: "Track likes, views, comments, and real engagement metrics programmatically."
    },
    {
      icon: "🤝",
      title: "Whitelabel social media API for your brand",
      desc: "Embed native publishing capabilities directly inside your own SaaS or tool."
    },
    {
      icon: "🎯",
      title: "Auto-adapts content to each platform requirements",
      desc: "Smart layout checks and automated aspect-ratio optimization."
    }
  ];

  const painPoints = [
    {
      title: "Manual uploads are slow",
      desc: "You spend too much time uploading the same files. Businesses and entrepreneurs need faster ways."
    },
    {
      title: "Too expensive",
      desc: "High costs can be a barrier. We believe in fair pricing, especially for small businesses and entrepreneurs."
    },
    {
      title: "Social media APIs are a pain",
      desc: "Creating an app for each social media, handling OAuth flows, and dealing with different APIs takes a lot of time."
    },
    {
      title: "Hard to use",
      desc: "Complexity shouldn't slow you down. Our focus is on a simple, intuitive experience for everyone."
    }
  ];

  const faqs = [
    {
      q: "Do scheduled posts perform as well as manual ones?",
      a: "Yes! Scheduled posts perform just as well as manual ones when your content is relevant and high quality. Modern feeds are increasingly interest-based, so what matters most is the value of your post—not whether you clicked Publish or scheduled it. Scheduling helps you stay consistent and hit optimal times without sacrificing reach."
    },
    {
      q: "Is UploadPost safe to use with my accounts?",
      a: "Absolutely. Upload-Post connects directly using official APIs and developer protocols with secure OAuth handshakes. We never touch or store your passwords."
    },
    {
      q: "How does UploadPost handle uploads under the hood? Do you use rotating IPs?",
      a: "No rotating IPs or bot workarounds. We use real official partner endpoints and direct compliance webhooks, meaning your account health is always fully safe and secure."
    },
    {
      q: "Does Upload-Post store my personal data?",
      a: "We only process and store the metadata required to complete your posts and fetch metrics, keeping your personal credentials completely secure and private as outlined in our privacy protocol."
    },
    {
      q: "Can I customize how my videos are posted?",
      a: "Yes! You can specify custom titles, individual descriptive captions, platform-specific parameters, and unique options for each network within a single payload."
    }
  ];

  return (
    <div id="home-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 flex flex-col justify-between overflow-x-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[32rem] h-[32rem] bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-300 tracking-wide">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Join +62,514 creators already growing with us!</span>
          </div>

          {/* Social Media API Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
            Social Media API
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent block mt-2">
              One Call, Every Platform
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-450 max-w-3xl mx-auto leading-relaxed font-medium">
            Social Media Posting API for TikTok, Instagram, YouTube & 9 more platforms. One API call, all networks. Free tier, Python & JS SDKs. Use it as a tool for Claude, ChatGPT or any AI agent.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="text-center space-y-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate("auth")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-indigo-500 via-indigo-600 to-pink-600 hover:from-indigo-600 hover:to-pink-500 text-white shadow-xl shadow-indigo-950/80 hover:shadow-indigo-900/90 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>Create your free account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-500 font-bold">No credit card required</p>
            </div>
          </div>

          {/* User ratings banner */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 text-slate-400 text-xs">
            <div className="flex -space-x-2">
              {["JB", "SW", "KW", "CT", "L"].map((initial, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                  {initial}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-amber-400 text-sm">★★★★★</span>
              <span>4.9 rating loved by creators</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Code integration terminal & agents section */}
      <div className="bg-[#0B0F19]/60 border-y border-slate-900/80 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 uppercase rounded-md">
              <Terminal className="w-3.5 h-3.5" />
              <span>terminal</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">One API Call, Multiple Platforms</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Integrate with simple HTTP requests. Our API handles authentication, video checks, transcoding, and background scheduling on all profiles with zero configuration.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Compatible with any AI agent</h4>
                  <p className="text-xs text-slate-400">Easily integrates with Claude, ChatGPT, Cursor, and custom auto-posting bots.</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2.5">Trusted by companies like</p>
                <div className="flex flex-wrap gap-4 items-center opacity-70 text-slate-400 font-extrabold text-xs">
                  <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-850">n8n</span>
                  <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-850">Make</span>
                  <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-850">Zapier</span>
                  <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-850">Airtable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real API Curl Box */}
          <div className="bg-[#070A13] border border-slate-850 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900/70 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] text-slate-450 font-mono">cURL Interactive Code Block</span>
            </div>
            <pre className="p-5 overflow-x-auto text-slate-300 font-mono text-[11px] leading-relaxed select-all">
              {`curl \\
 -H 'Authorization: Apikey your-api-key-here' \\
 -F 'video=@/path/to/your/video.mp4' \\
 -F 'title="Your Awesome Title"' \\
 -F 'user="test"' \\
 -F 'platform[]=tiktok' \\
 -F 'platform[]=instagram' \\
 -F 'platform[]=youtube' \\
 -X POST https://api.upload-post.com/api/upload`}
            </pre>
          </div>
        </div>
      </div>

      {/* Five pillars grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest font-mono">Core Solutions</span>
          <h2 className="text-3xl font-black text-white">Feature Suite & Posting Ecosystem</h2>
          <p className="text-sm text-slate-400">Everything needed to broadcast, scale, and automate your short-form media uploads.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pl, i) => (
            <div key={i} className="bg-[#0B0F19] border border-slate-850/80 p-6 rounded-2xl space-y-4 hover:border-indigo-500/40 transition-colors group shadow-lg">
              <div className="w-12 h-12 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {pl.icon}
              </div>
              <h3 className="text-base font-bold text-white">{pl.title}</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-medium">{pl.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pain points section */}
      <div className="bg-[#0B0F19]/30 border-y border-slate-900 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest">Why Upload-Post?</span>
            <h2 className="text-3xl font-black text-white">Sharing Should Be Easy</h2>
            <p className="text-sm text-slate-400 font-semibold">We focus on making your work simpler and more efficient.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {painPoints.map((pt, i) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-850/60 p-6 rounded-2xl shadow-lg space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  {pt.title}
                </h3>
                <p className="text-xs text-slate-450 leading-relaxed font-medium">{pt.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4 pt-6">
            <h3 className="text-lg font-extrabold text-white">Your time and money matter. Do not waste them.</h3>
            <div>
              <button
                type="button"
                onClick={() => onNavigate("auth")}
                className="px-6 py-3 bg-white text-slate-950 font-extrabold rounded-xl hover:bg-slate-100 transition-colors text-xs cursor-pointer shadow-lg"
              >
                Try a Simple Tool
              </button>
              <p className="text-[10px] text-slate-500 font-bold mt-2">No credit card required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance / Safe to use section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="bg-[#0B0F19] border border-slate-850/80 rounded-3xl p-8 lg:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Safe & Official</span>
            <h2 className="text-3xl font-black text-white">Built for Platform Compliance</h2>
            <p className="text-sm text-slate-450 font-medium">Official APIs. OAuth security. No workarounds or rotational scrapers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
            <div className="space-y-4 bg-rose-950/20 border border-rose-900/30 p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold text-rose-400 uppercase tracking-wider">What CAN Get You Banned</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-rose-500">✕</span>
                  <span>Posting inappropriate or sensitive content</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-rose-500">✕</span>
                  <span>Spam behavior & uploading duplicates too fast</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-rose-500">✕</span>
                  <span>Bot-like activity on unapproved scrapers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-rose-500">✕</span>
                  <span>Violating platform terms and guidelines</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 bg-emerald-950/20 border border-emerald-900/30 p-6 rounded-2xl">
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider">How UploadPost Keeps You Safe</h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Official API integrations with partner tokens</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400">✓</span>
                  <span>OAuth security protocols (we never see passwords)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Platform-compliant methods adhering to rate limits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-400">✓</span>
                  <span>Verified app developer status with networks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section */}
      <div className="bg-[#0B0F19]/20 border-t border-slate-900/60 py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-indigo-400 mx-auto" />
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Find answers to common questions about our API platform and compliance.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i} 
                  className="bg-[#0B0F19] border border-slate-850/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full text-left p-6 font-bold text-sm sm:text-base text-white flex justify-between items-center gap-4 hover:bg-slate-900/40 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-indigo-400 transition-transform duration-300 text-lg font-black ${isOpen ? "rotate-45" : ""}`}>
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-850/60 bg-[#070A13]/40"
                      >
                        <p className="p-6 text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="border-t border-slate-900/60 bg-[#05070D] py-6 text-center text-xs text-slate-600">
        <p>© 2026 Upload-Post API network. All rights reserved. Built for creators and developers.</p>
      </div>
    </div>
  );
}

// 2. SERVICES VIEW
export function ServicesView({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [isAnnual, setIsAnnual] = useState(true);

  const features = [
    {
      title: "One-Click Upload",
      desc: "Upload your video once and let Upload-Post distribute it across all your connected social media accounts effortlessly.",
      badge: "Save time with streamlined video sharing"
    },
    {
      title: "API Integration + Analytics",
      desc: "Upload to TikTok, Facebook, LinkedIn, Threads, Instagram, Youtube and X. Plus get analytics and metrics: views, likes, comments and engagement data from all platforms.",
      badge: "Post + track performance in one API"
    },
    {
      title: "Secure and Private",
      desc: "We only process the data needed to provide the service, as described in our Privacy Policy.",
      badge: "Built with official APIs, OAuth, and security best practices"
    }
  ];

  const steps = [
    {
      num: "1",
      title: "Create Account",
      desc: "Sign up for an Upload-Post account to get started with our API services."
    },
    {
      num: "2",
      title: "Connect Social Media",
      desc: "Connect your social media accounts where you want to start uploading content."
    },
    {
      num: "3",
      title: "Start Uploading",
      desc: "Upload your content through our dashboard, API, or automation tools."
    },
    {
      num: "4",
      title: "Go Multi-Platform",
      desc: "Publish your content across TikTok, Instagram, YouTube and all supported platforms."
    }
  ];

  const automationTools = [
    {
      logo: "n8n",
      title: "N8N Integration",
      subtitle: "Official n8n Node Available",
      desc: "Seamlessly integrate Upload-Post with N8N to create powerful automated workflows. Connect your video uploads with other business processes through our robust API. We have an official Upload-Post node in n8n that makes integration super easy.",
      bullets: [
        "Trigger video uploads based on events",
        "Automate cross-platform content distribution",
        "Connect with your existing tools and workflows"
      ]
    },
    {
      logo: "Make",
      title: "Make Integration",
      subtitle: "Easy Setup",
      desc: "Build powerful automation scenarios with Make (formerly Integromat) to streamline your video content workflow and connect with thousands of apps. Connect in minutes with our HTTP module - no coding required.",
      bullets: [
        "Visual workflow builder",
        "Connect with 1000+ apps and services",
        "Real-time execution monitoring"
      ]
    },
    {
      logo: "MCP",
      title: "MCP Server",
      subtitle: "Works with Claude Desktop, Claude Code & Cursor",
      desc: "Plug Upload-Post directly into Claude, Cursor and any other MCP-compatible AI agent. The assistant gets 40 tools to publish, schedule, analyze and manage social media on your behalf. Hosted at mcp.upload-post.com — open-source, audit it on GitHub.",
      bullets: [
        "No-code, just paste your API key",
        "40 tools covering every public endpoint",
        "Self-host with one Docker command if you prefer"
      ]
    },
    {
      logo: "Claude",
      title: "Claude Code Skill",
      subtitle: "Publish from your terminal",
      desc: "Publish to social media straight from your terminal with the Upload-Post skill for Claude Code. Tell Claude to post a video, carousel or thread in plain English — it handles the API for you.",
      bullets: [
        "One-command install (npx skills add Upload-Post/upload-post-skill)",
        "Post Reels, carousels, Shorts & threads from the terminal",
        "Works with Claude Code, Cursor & other agents"
      ]
    }
  ];

  const platforms = [
    { name: "TikTok", desc: "Share your videos on TikTok and reach millions of users worldwide. Perfect for short-form viral content.", details: ["Short-form videos", "Trending sounds", "Viral challenges", "Hashtag campaigns"] },
    { name: "Instagram", desc: "Connect with your Instagram audience through Reels, Stories, and feed posts. Ideal for visual storytelling.", details: ["Instagram Reels", "Stories", "Feed posts", "Carousel posts"] },
    { name: "YouTube", desc: "Upload long-form content and Shorts to YouTube and grow your channel with high-quality videos.", details: ["Long-form content", "Video series", "Educational content", "Shorts upload"] },
    { name: "Facebook", desc: "Reach your audience on Facebook with posts, videos, and stories. Great for community engagement and brand awareness.", details: ["Feed posts", "Stories", "Page management", "Live video"] }
  ];

  const pricing = [
    {
      name: "Free",
      subtitle: "Get started with the basics",
      price: "$0",
      annualPrice: "$0",
      features: [
        "10 uploads/mo",
        "Instagram, LinkedIn, YouTube, Facebook, X, Threads, Pinterest, Reddit, Bluesky",
        "Schedule posts",
        "Analytics",
        "2 profiles",
        "Video editor API (FFmpeg) — 30 min/mo",
        "AI Shorts Uploader — 10 analyses/mo"
      ],
      cta: "Try for free",
      popular: false
    },
    {
      name: "Basic",
      subtitle: "For individuals",
      price: "$16",
      annualPrice: "$192 billed annually",
      features: [
        "∞ Unlimited uploads",
        "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Threads, Pinterest, Reddit, Bluesky",
        "Schedule posts",
        "Analytics",
        "5 profiles",
        "Video editor API (FFmpeg) — 300 min/mo",
        "AI Shorts Uploader — 100 analyses/mo",
        "1 seat (Owner only)",
        "Add extra profiles: +5 profiles+$120/yr, +10 profiles+$200/yr"
      ],
      cta: "Try for free",
      popular: false
    },
    {
      name: "Professional",
      subtitle: "For creators & freelancers",
      price: "$33",
      annualPrice: "$400 billed annually",
      features: [
        "∞ Unlimited uploads",
        "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Threads, Pinterest, Reddit, Bluesky",
        "Schedule posts",
        "Analytics",
        "Whitelabel integration",
        "25 profiles",
        "Video editor API (FFmpeg) — 1,000 min/mo",
        "AI Shorts Uploader — 300 analyses/mo",
        "2 seats (Owner + 1 member)",
        "Add extra profiles: +15 profiles+$280/yr, +25 profiles+$440/yr"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Advanced",
      subtitle: "For startups & teams",
      price: "$118",
      annualPrice: "$1,411 billed annually",
      features: [
        "∞ Unlimited uploads",
        "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Threads, Pinterest, Reddit, Bluesky",
        "Schedule posts",
        "Analytics",
        "Whitelabel integration",
        "Priority support",
        "75 profiles",
        "Video editor API (FFmpeg) — 3,000 min/mo",
        "AI Shorts Uploader — 600 analyses/mo",
        "5 seats (Owner + 4 members)",
        "Add extra profiles: +25 profiles+$650/yr, +50 profiles+$1,150/yr"
      ],
      cta: "Try for free",
      popular: false
    },
    {
      name: "Business",
      subtitle: "For companies & agencies",
      price: "$350",
      annualPrice: "$4,205 billed annually",
      features: [
        "∞ Unlimited uploads",
        "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Threads, Pinterest, Reddit, Bluesky",
        "Schedule posts",
        "Analytics",
        "Whitelabel integration",
        "Priority support",
        "225 profiles",
        "Video editor API (FFmpeg) — 10,000 min/mo",
        "AI Shorts Uploader — 1,000 analyses/mo",
        "10 seats (Owner + 9 members)",
        "Extra profiles: +$1/mo each"
      ],
      cta: "Try for free",
      popular: false
    }
  ];

  return (
    <div id="services-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Features Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Platform Ecosystem</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Key Features
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Simplify your social media workflow with our powerful platform designed for content creators and marketers.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((ft, i) => (
            <div key={i} className="bg-[#0B0F19] border border-slate-850 p-6 rounded-2xl flex flex-col justify-between shadow-lg hover:border-indigo-500/30 transition-all">
              <div className="space-y-4">
                <span className="px-2.5 py-1 text-[9px] font-black uppercase text-indigo-300 bg-indigo-950/40 border border-indigo-900/40 rounded-md block w-fit">
                  {ft.badge}
                </span>
                <h3 className="text-lg font-black text-white">{ft.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{ft.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* How it works section */}
        <div className="bg-[#0B0F19]/40 border-y border-slate-900/80 py-16 rounded-3xl p-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Quickstart Guide</span>
            <h3 className="text-2xl font-black text-white">How It Works</h3>
            <p className="text-xs text-slate-400">Get started in just a few simple steps and streamline your social media workflow.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
            {steps.map((st, i) => (
              <div key={i} className="space-y-3 p-4 bg-slate-900/40 rounded-xl border border-slate-850 relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600/25 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold mx-auto text-sm">
                  {st.num}
                </div>
                <h4 className="text-xs font-extrabold text-white">{st.title}</h4>
                <p className="text-[11px] text-slate-450 leading-relaxed font-medium">{st.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center pt-8">
            <button
              type="button"
              onClick={() => onNavigate("auth")}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Automation tools section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest font-mono">Direct Integrations</span>
            <h3 className="text-2xl font-black text-white">Easy Integration with Automation Tools</h3>
            <p className="text-xs text-slate-400">Connect Upload-Post with your favorite automation platforms — or with your AI agent through MCP.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {automationTools.map((tool, i) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-850 p-6 rounded-2xl flex flex-col justify-between shadow-xl space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-slate-900 rounded-lg text-xs font-extrabold text-slate-200 border border-slate-800">
                      {tool.logo} Logo
                    </span>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/40">
                      {tool.subtitle}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">{tool.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{tool.desc}</p>
                  
                  <ul className="space-y-1.5 pt-2 border-t border-slate-850/60">
                    {tool.bullets.map((b, bi) => (
                      <li key={bi} className="text-[11px] text-slate-350 flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("about")}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>View Integration Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Platforms Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest font-mono">Compatibility List</span>
            <h3 className="text-2xl font-black text-white">Supported Platforms</h3>
            <p className="text-xs text-slate-400">Upload your content to all major social networks with a single API.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {platforms.map((pf, i) => (
              <div key={i} className="bg-[#0B0F19]/40 border border-slate-850 p-5 rounded-xl hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="text-indigo-400 font-mono">#</span>
                    {pf.name}
                  </h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed font-medium">{pf.desc}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-850/40 mt-3">
                  {pf.details.map((dt, dti) => (
                    <span key={dti} className="text-[9px] font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {dt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-[#0B0F19] border border-slate-850 p-6 rounded-2xl max-w-xl mx-auto space-y-2">
            <h4 className="text-xs font-extrabold text-white">Need another platform?</h4>
            <p className="text-[11px] text-slate-400">If you need integration with a platform not listed here, please send us an email at <a href="mailto:info@upload-post.com" className="text-indigo-400 hover:underline">info@upload-post.com</a>.</p>
          </div>
        </div>

        {/* Predictable Pricing Section */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-black text-purple-400 uppercase tracking-widest font-mono">Subscription Plans</span>
            <h3 className="text-3xl font-black text-white">Predictable Pricing</h3>
            <p className="text-sm text-slate-400">Designed for every stage of your journey. No credit card required to try.</p>

            <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!isAnnual ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all relative flex items-center gap-1.5 ${isAnnual ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                <span>Annual</span>
                <span className="bg-emerald-500 text-[9px] text-slate-950 font-black px-1.5 py-0.5 rounded-md">-40%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {pricing.map((tier, i) => (
              <div
                key={i}
                className={`bg-[#0B0F19] border rounded-2xl p-5 flex flex-col justify-between relative shadow-xl transition-all ${
                  tier.popular ? "border-indigo-500 scale-102 lg:-translate-y-2 bg-[#0E1424]" : "border-slate-850"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-black text-white">{tier.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-1 font-medium">{tier.subtitle}</p>
                  </div>

                  <div className="py-2">
                    <span className="text-3xl font-black text-white">
                      {tier.name === "Free" ? "$0" : isAnnual ? `$${Math.round(parseInt(tier.price.replace("$", "")) * 0.6)}` : tier.price}
                    </span>
                    <span className="text-xs text-slate-400">/mo</span>
                    <p className="text-[10px] text-indigo-400 font-bold mt-1">
                      {tier.name === "Free" ? "Try for free" : isAnnual ? tier.annualPrice : "Billed monthly"}
                    </p>
                  </div>

                  <ul className="space-y-2 text-[10px] text-slate-350 border-t border-slate-850/60 pt-3">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1.5 leading-tight font-medium">
                        <span className="text-indigo-400 shrink-0">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5">
                  <button
                    type="button"
                    onClick={() => onNavigate("auth")}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      tier.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-slate-900 hover:bg-slate-850 text-slate-300"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Bottom CTA bar */}
        <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-900/50 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Start posting for free today</h4>
            <p className="text-xs text-slate-400">Try Upload-Post and connect all your active profiles in minutes.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("auth")}
            className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
          >
            <span>Start Posting for Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. RESOURCES VIEW
export function ResourcesView({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState<"tiktok" | "instagram" | "facebook" | "shorts">("tiktok");

  const platformData = {
    tiktok: {
      title: "TikTok Video Requirements",
      aspectRatio: "9:16 Portrait (Vertical)",
      resolution: "1080 x 1920 px",
      fileFormat: "MP4 or MOV video",
      maxSize: "287MB on iPhone, 72MB on Android",
      maxDuration: "Up to 10 minutes (Under 3 mins is best)",
      safeZones: "Keep text at least 120px away from the right side and 400px away from the bottom.",
      bestTime: "Tuesdays 9:00 AM, Thursdays 12:00 PM, Fridays 5:00 AM EST"
    },
    instagram: {
      title: "Instagram Reels Requirements",
      aspectRatio: "9:16 Portrait (Vertical)",
      resolution: "1080 x 1920 px",
      fileFormat: "MP4 or MOV video",
      maxSize: "Up to 4 GB video file size",
      maxDuration: "Up to 90 seconds (Under 60 secs is best)",
      safeZones: "Avoid placing logos or text in the bottom 25% or the top 15% of your screen.",
      bestTime: "Mondays 11:00 AM, Wednesdays 9:00 AM, Thursdays 12:00 PM EST"
    },
    facebook: {
      title: "Facebook Reels Requirements",
      aspectRatio: "9:16 Portrait (Vertical)",
      resolution: "1080 x 1920 px",
      fileFormat: "MP4 or MOV video",
      maxSize: "Up to 4 GB video file size",
      maxDuration: "Up to 90 seconds (Recommended under 60 seconds)",
      safeZones: "Avoid placing critical details in the bottom 25% where comments, page actions, and buttons overlay.",
      bestTime: "Mondays 1:00 PM, Tuesdays 10:00 AM, Thursdays 12:00 PM EST"
    },
    shorts: {
      title: "YouTube Shorts Requirements",
      aspectRatio: "9:16 Portrait (Vertical)",
      resolution: "1080 x 1920 px",
      fileFormat: "MP4 or MOV video",
      maxSize: "Up to 128 GB standard upload limit",
      maxDuration: "Up to 60 seconds maximum limit",
      safeZones: "Avoid placing key visuals in the bottom 20% where captions and titles appear.",
      bestTime: "Wednesdays 12:00 PM, Saturdays 10:00 AM, Sundays 12:00 PM EST"
    }
  };

  const resourceArticles = [
    {
      category: "Creator Strategy",
      title: "How to Post Videos on Multiple Platforms",
      readTime: "6 Min Read",
      desc: "Learn why posting the exact same video to every app without small changes can hurt your reach, and how to fix it."
    },
    {
      category: "AI Caption Writing",
      title: "Using AI to Write Better Captions",
      readTime: "4 Min Read",
      desc: "Learn how we use Gemini AI to automatically create short, interesting captions and hashtag lists that get people clicking."
    },
    {
      category: "Video Layouts",
      title: "Understanding Video Safe-Zones",
      readTime: "8 Min Read",
      desc: "See how hashtags, text, and icons can cover your video. Learn how to place your captions in areas where viewers can always see them."
    }
  ];

  return (
    <div id="resources-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Intro */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Guides & Formats</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Free Creator Guides & Video Specifications
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-medium">
            Get the exact video sizes, safe-zone layouts, and tips you need to succeed on TikTok, Shorts, and Reels.
          </p>
          <div className="h-1.5 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto" />
        </div>

        {/* Section: Platform Specification Matrix */}
        <div className="bg-[#0B0F19] border border-slate-850 rounded-3xl p-8 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-850">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Platform Requirements</h3>
              <p className="text-xs text-slate-400">Choose a platform below to see the exact video sizes and formats they allow.</p>
            </div>
            
            {/* Interactive Tab Buttons */}
            <div className="flex flex-wrap gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {(["tiktok", "instagram", "facebook", "shorts"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                    selectedPlatform === p
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  {p === "shorts" ? "YouTube Shorts" : p === "instagram" ? "Instagram Reels" : p === "facebook" ? "Facebook Reels" : "TikTok"}
                </button>
              ))}
            </div>
          </div>

          {/* Details layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/30 text-indigo-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black text-white">{platformData[selectedPlatform].title}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Aspect Ratio</span>
                  <p className="text-xs font-bold text-slate-200">{platformData[selectedPlatform].aspectRatio}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Ideal Resolution</span>
                  <p className="text-xs font-bold text-slate-200">{platformData[selectedPlatform].resolution}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">File Format</span>
                  <p className="text-xs font-bold text-slate-200">{platformData[selectedPlatform].fileFormat}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Max File Size</span>
                  <p className="text-xs font-bold text-slate-200">{platformData[selectedPlatform].maxSize}</p>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl space-y-1">
                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Platform Safe-Zone Guideline</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{platformData[selectedPlatform].safeZones}</p>
              </div>
            </div>

            {/* Real Smartphone mockup preview */}
            <div className="flex justify-center">
              {/* Smartphone mockup */}
              <div className="relative w-[280px] h-[500px] bg-slate-950 border-[6px] border-slate-900 rounded-[38px] overflow-hidden shadow-2xl flex flex-col justify-between font-sans text-xs text-white">
                {/* Dynamic Island / Speaker Pill */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  <div className="w-1 h-1 rounded-full bg-indigo-500/60 animate-pulse" />
                </div>

                {/* Status Bar */}
                <div className="absolute top-1.5 left-0 right-0 h-6 px-6 flex justify-between items-center z-30 text-[9px] font-bold text-white tracking-tight pointer-events-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    {/* Signal bars */}
                    <div className="flex items-end gap-0.5 h-2">
                      <div className="w-0.5 h-1 bg-white rounded-full" />
                      <div className="w-0.5 h-1.5 bg-white rounded-full" />
                      <div className="w-0.5 h-2 bg-white rounded-full" />
                    </div>
                    {/* Battery */}
                    <div className="w-5 h-2.5 border border-white/80 rounded-[3px] p-0.5 flex items-center">
                      <div className="w-full h-full bg-white rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Simulated vertical video background frame */}
                <div className="absolute inset-0 z-0 bg-slate-900 overflow-hidden pointer-events-none">
                  {/* Background specific to selected platform to look 100% real */}
                  {selectedPlatform === "tiktok" && (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-900 flex flex-col items-center justify-center opacity-90">
                      {/* Simulated abstract visual content: travel sunset with waves */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)] animate-pulse" />
                      <div className="text-center space-y-2">
                        <span className="text-5xl">🌅</span>
                        <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono font-bold">TikTok Video</div>
                      </div>
                    </div>
                  )}
                  {selectedPlatform === "instagram" && (
                    <div className="w-full h-full bg-gradient-to-bl from-purple-800 via-pink-600 to-slate-950 flex flex-col items-center justify-center opacity-90">
                      {/* Simulated transition clip content */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,100,255,0.2),transparent_70%)]" />
                      <div className="text-center space-y-2">
                        <span className="text-5xl">🌆</span>
                        <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono font-bold">Instagram Reel</div>
                      </div>
                    </div>
                  )}
                  {selectedPlatform === "facebook" && (
                    <div className="w-full h-full bg-gradient-to-br from-blue-700 via-indigo-950 to-slate-900 flex flex-col items-center justify-center opacity-90">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(29,78,216,0.2),transparent_70%)]" />
                      <div className="text-center space-y-2">
                        <span className="text-5xl">👥</span>
                        <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono font-bold">Facebook Reel</div>
                      </div>
                    </div>
                  )}
                  {selectedPlatform === "shorts" && (
                    <div className="w-full h-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-emerald-950 flex flex-col items-center justify-center opacity-90">
                      {/* Simulated review workspace */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_65%)]" />
                      <div className="text-center space-y-2">
                        <span className="text-5xl">💻</span>
                        <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono font-bold">YouTube Short</div>
                      </div>
                    </div>
                  )}

                  {/* Play circle backdrop */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-xs flex items-center justify-center border border-white/20">
                      <Play className="w-4 h-4 text-white/95 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Simulated UI Overlays and Action Buttons - Interactive Content */}
                <div className="relative w-full h-full flex flex-col justify-between p-4 pt-11 z-10 select-none">
                  
                  {/* Top Feed Tabs Header */}
                  <div className="w-full flex justify-between items-center text-[10px] font-bold tracking-wide text-white/90">
                    {selectedPlatform === "tiktok" && (
                      <>
                        <span className="opacity-80">Live</span>
                        <div className="flex gap-3">
                          <span className="opacity-60">Following</span>
                          <span className="border-b-2 border-white pb-0.5">For You</span>
                        </div>
                        <Search className="w-4 h-4 opacity-85" />
                      </>
                    )}
                    {selectedPlatform === "instagram" && (
                      <>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">Reels</span>
                          <span className="text-[8px] opacity-70">▼</span>
                        </div>
                        <span className="w-4 h-4" /> {/* Spacer */}
                        <div className="w-5 h-5 rounded-md border-2 border-white flex items-center justify-center text-[7px]">+</div>
                      </>
                    )}
                    {selectedPlatform === "facebook" && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black uppercase text-blue-500">f</span>
                          <span className="text-xs font-extrabold">Reels</span>
                        </div>
                        <span className="w-4 h-4" /> {/* Spacer */}
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 opacity-80" />
                          <span className="font-mono text-xs font-bold">⋮</span>
                        </div>
                      </>
                    )}
                    {selectedPlatform === "shorts" && (
                      <>
                        <span className="text-xs tracking-wider font-extrabold uppercase bg-red-600 px-1.5 py-0.5 rounded">Shorts</span>
                        <span className="w-4 h-4" />
                        <div className="flex gap-3 items-center">
                          <Search className="w-4 h-4 opacity-80" />
                          <span className="font-mono text-xs font-bold">⋮</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Main Screen Center (Empty, safe zones removed) */}
                  <div className="grow w-full flex flex-col justify-center relative mt-3">
                  </div>

                  {/* Bottom Layout - Captions + Right side controls */}
                  <div className="flex justify-between items-end gap-3 mt-auto pb-2 relative z-20">
                    
                    {/* Bottom Left Details Block */}
                    <div className="max-w-[170px] space-y-2 text-[9px] drop-shadow-md">
                      
                      {/* Account profile name & verification badge */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/60 flex items-center justify-center text-[10px]">🎙️</div>
                        <div className="space-y-0.5">
                          <div className="font-bold flex items-center gap-1">
                            <span>
                              {selectedPlatform === "shorts" && "@UploadPostOfficial"}
                              {selectedPlatform === "tiktok" && "@uploadpost_official"}
                              {selectedPlatform === "instagram" && "@uploadpost_official"}
                              {selectedPlatform === "facebook" && "Upload-Post Official"}
                            </span>
                            <span className="w-3 h-3 bg-blue-500 text-[6px] text-white rounded-full flex items-center justify-center font-black">✓</span>
                          </div>
                          {(selectedPlatform === "instagram" || selectedPlatform === "facebook") && (
                            <span className="text-[7px] text-indigo-300 font-extrabold bg-indigo-950/60 px-1 rounded">Suggested</span>
                          )}
                        </div>
                      </div>

                      {/* Video Caption & Hashtags */}
                      <p className="text-[8px] text-white/95 leading-snug">
                        {selectedPlatform === "tiktok" && "Never guess safe layout rules again! Our safe-zone overlay checks TikTok, Reels & Shorts at once. 🎬 #foryou #growth #marketing"}
                        {selectedPlatform === "instagram" && "Publish beautiful content safely without text getting covered by comment overlays. 📈 #marketing #creators #instagram"}
                        {selectedPlatform === "facebook" && "Maximize your organic reach with high-retention Facebook Reels. Schedule and analyze easily! 🚀 #creators #facebookreels"}
                        {selectedPlatform === "shorts" && "The easiest way to schedule and cross-post vertical videos to three feeds in seconds! 🚀 #shorts #shortscreator"}
                      </p>

                      {/* Scrolling Sound Row */}
                      <div className="flex items-center gap-1 bg-black/25 backdrop-blur-xs px-2 py-0.5 rounded-full w-max text-white/95 border border-white/10">
                        <Music className="w-2.5 h-2.5 shrink-0 animate-spin" style={{ animationDuration: "6s" }} />
                        <span className="text-[7px] font-medium truncate max-w-[100px]">Original Audio - upload_post</span>
                      </div>
                    </div>

                    {/* Right Side Social Interaction Floating Buttons */}
                    <div className="flex flex-col items-center gap-3 z-20">
                      {selectedPlatform === "tiktok" && (
                        <>
                          {/* Profile circle with red plus badge */}
                          <div className="relative">
                            <div className="w-7 h-7 rounded-full bg-slate-600 border border-white/80 flex items-center justify-center text-xs">🎙️</div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 border border-slate-900 flex items-center justify-center text-[8px] font-black text-white cursor-pointer">+</div>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-rose-500">
                              <Heart className="w-4 h-4 fill-rose-500" />
                            </button>
                            <span className="text-[7px] font-bold text-white tracking-tighter">24.5K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <MessageSquare className="w-4 h-4 fill-white" />
                            </button>
                            <span className="text-[7px] font-bold text-white tracking-tighter">1.2K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-amber-400">
                              <Bookmark className="w-4 h-4 fill-amber-400" />
                            </button>
                            <span className="text-[7px] font-bold text-white tracking-tighter">8.4K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white tracking-tighter">4.9K</span>
                          </div>

                          {/* Spinning CD cover disc */}
                          <div className="w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center p-0.5 animate-spin" style={{ animationDuration: "5s" }}>
                            <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400" />
                          </div>
                        </>
                      )}

                      {selectedPlatform === "instagram" && (
                        <>
                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white hover:text-rose-500">
                              <Heart className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">18.4K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">450</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <Send className="w-3.5 h-3.5 -rotate-12 translate-x-[1px]" />
                            </button>
                            <span className="text-[7px] font-bold text-white">2.1K</span>
                          </div>

                          <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                            <Bookmark className="w-4 h-4" />
                          </button>

                          <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Audio disc / track block */}
                          <div className="w-6 h-6 rounded-md bg-slate-900 border border-white/40 overflow-hidden flex items-center justify-center">
                            🎙️
                          </div>
                        </>
                      )}

                      {selectedPlatform === "facebook" && (
                        <>
                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white shadow-md shadow-blue-500/25">
                              <ThumbsUp className="w-3.5 h-3.5 fill-white" />
                            </button>
                            <span className="text-[7px] font-bold text-white">12.8K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">820</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">1.5K</span>
                          </div>

                          <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                            <Send className="w-3.5 h-3.5 -rotate-12 translate-x-[1px]" />
                          </button>

                          <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Profile Circle icon */}
                          <div className="w-6 h-6 rounded-full border border-white/40 overflow-hidden flex items-center justify-center bg-slate-850">
                            🎙️
                          </div>
                        </>
                      )}

                      {selectedPlatform === "shorts" && (
                        <>
                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <ThumbsUp className="w-4 h-4 fill-white" />
                            </button>
                            <span className="text-[7px] font-bold text-white">9.2K</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">Dislike</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">310</span>
                          </div>

                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <span className="text-[7px] font-bold text-white">Share</span>
                          </div>

                          {/* YouTube Remix Icon */}
                          <div className="flex flex-col items-center gap-0.5">
                            <button className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-xs flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white">
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[7px] font-bold text-white">Remix</span>
                          </div>

                          {/* Sound preview badge */}
                          <div className="w-6 h-6 rounded-lg bg-red-900 border border-red-500 flex items-center justify-center text-[10px] animate-pulse">
                            🎵
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Video Playback Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Educational Playbook Cards */}
        <div className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-pink-500 uppercase tracking-widest font-mono">Expert Guides</span>
            <h3 className="text-2xl font-black text-white">Creator Knowledge Base</h3>
            <p className="text-xs text-slate-400">Accelerate your distribution analytics and organic conversion rates with our free tutorials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resourceArticles.map((article, i) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-850 p-6 rounded-2xl space-y-4 hover:border-indigo-500/30 transition-all flex flex-col justify-between shadow-lg group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-indigo-400 uppercase tracking-widest">{article.category}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition-colors">{article.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{article.desc}</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => onNavigate("auth")}
                  className="pt-4 text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-1.5 group/btn cursor-pointer"
                >
                  <span>Unlock Guide Free</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Dynamic Resource Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { metric: "100%", label: "Direct API Standard" },
            { metric: "9:16", label: "Portrait Native Layout" },
            { metric: "Zero", label: "Render Compression Loss" },
            { metric: "24/7", label: "Telemetry Monitored" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0B0F19]/40 border border-slate-800/40 p-5 rounded-2xl">
              <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.metric}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. CONTACT US VIEW
export function ContactUsView({ onTriggerToast }: { onTriggerToast: (msg: string) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "support",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onTriggerToast("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onTriggerToast("Message received! Our creator support team will respond shortly.");
      setFormData({ name: "", email: "", subject: "support", message: "" });
    }, 1200);
  };

  return (
    <div id="contact-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white">Get in Touch</h2>
          <p className="text-slate-400 text-sm font-medium">
            Have questions about how Upload-Post works, pricing, or custom setups? Drop us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Information block */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0B0F19] border border-slate-800/60 p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-extrabold text-white">Our Contact Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Support</p>
                    <a 
                      href="mailto:info@upload-post.com" 
                      className="text-sm font-bold text-indigo-300 hover:text-indigo-200 select-all font-mono"
                    >
                      info@upload-post.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <MessageSquare className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">We reply quickly</p>
                    <p className="text-xs font-semibold">Under 2 hours for active subscribers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Users className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Official Discord</p>
                    <p className="text-xs font-semibold">Join our community channel once inside.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/85">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Notice: We connect safely with TikTok, YouTube, and Meta developer networks.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="md:col-span-3">
            <div className="bg-[#0B0F19] border border-slate-800/60 p-8 rounded-2xl shadow-xl">
              {submitted ? (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center rounded-2xl mx-auto shadow-lg">
                    <Send className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for contacting Upload-Post. We received your message and we'll write back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 focus:border-indigo-500 text-slate-100 rounded-xl px-4 py-3 text-xs font-medium outline-hidden transition-all placeholder-slate-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                      <input 
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 focus:border-indigo-500 text-slate-100 rounded-xl px-4 py-3 text-xs font-medium outline-hidden transition-all placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subject Matter</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-xl px-4 py-3 text-xs font-medium outline-hidden transition-all"
                    >
                      <option value="support">General Creator Assistance</option>
                      <option value="api">API Platform Credentials</option>
                      <option value="billing">Enterprise & billing contracts</option>
                      <option value="abuse">Platform Abuse Report</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Message</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Describe your inquiry, custom platform configurations, or distribution requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 focus:border-indigo-500 text-slate-100 rounded-xl px-4 py-3 text-xs font-medium outline-hidden transition-all placeholder-slate-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        {/* Section: Service Level Commitments */}
        <div className="bg-gradient-to-r from-slate-950 to-[#0B0F19] border border-slate-850 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl shrink-0 text-indigo-400 hidden sm:block">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">Strict Compliance & Uptime Guarantee</h4>
              <p className="text-xs text-slate-400 max-w-xl">We guarantee a 99.9% publishing uptime. Our integrations are constantly kept up-to-date with raw developer channel parameters.</p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-wider shrink-0 text-center">
            SLA ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}
