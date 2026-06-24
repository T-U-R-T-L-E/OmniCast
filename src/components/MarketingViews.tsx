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
  ArrowRightLeft
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
            alt="Omni-Cast Logo" 
            className="relative w-10 h-10 object-contain rounded-lg border border-slate-700/50 bg-[#0B0F19]"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Omni-Cast
          </span>
          <span className="text-[9px] text-indigo-400 font-extrabold tracking-widest uppercase">
            SaaS Cross-Posting
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

  const steps = [
    {
      num: "01",
      title: "Upload Your Video",
      detail: "Simply drag and drop your vertical video file into our platform. We'll instantly check that the size and format are correct so it is ready to be published.",
      badge: "Easy Upload"
    },
    {
      num: "02",
      title: "AI Caption Assistant",
      detail: "Our built-in Gemini AI reads your video topic and writes catchy descriptions, hashtags, and titles customized for each social media platform.",
      badge: "AI Powered"
    },
    {
      num: "03",
      title: "Post to All Apps",
      detail: "With one click, your video is shared to TikTok, YouTube Shorts, and Instagram Reels at the same time, keeping your content perfectly updated everywhere.",
      badge: "One-Click Share"
    }
  ];

  const faqs = [
    {
      q: "Are my social media accounts safe with Omni-Cast?",
      a: "Yes, fully secure. We use official integration systems (like Google and Meta OAuth) to connect your accounts. Your passwords are never stored or seen by us, and you can revoke access at any time."
    },
    {
      q: "What is the Safe-Zone Preview and why is it helpful?",
      a: "Different apps (like TikTok, Reels, and Shorts) place buttons, names, and text overlays in different spots on your screen. Our Safe-Zone Preview overlays these elements on your video so you can check that your key text or captions won't get covered."
    },
    {
      q: "Can I schedule my videos to be posted later?",
      a: "Yes! You can choose the exact date and time you want your videos to go live. Our automatic scheduler will publish them for you, even while you are offline."
    },
    {
      q: "Is there a limit on the video file size I can upload?",
      a: "We support standard MP4 and MOV vertical video files up to 150MB, which is perfect for high-quality short videos under 3 minutes. If you need larger uploads, we have plans that go up to 1GB."
    }
  ];

  return (
    <div id="home-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 flex flex-col justify-between overflow-x-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[32rem] h-[32rem] bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>AI-Powered Video Cross-Posting</span>
          </div>

          {/* Massive high-converting headlines */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
            Publish Once. Share Everywhere.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent block mt-2">
              Simple Video Distribution.
            </span>
          </h1>

          {/* Persuasive Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Take a single vertical video clip and share it instantly to TikTok, Instagram Reels, Facebook, and YouTube Shorts. Our built-in AI drafts optimized captions and hashtags for you.
          </p>

          {/* Action Call buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate("auth")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-indigo-500 via-indigo-600 to-pink-600 hover:from-indigo-600 hover:to-pink-500 text-white shadow-xl shadow-indigo-950/80 hover:shadow-indigo-900/90 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
            >
              <span>Start For Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("services")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              Explore Features
            </button>
          </div>

          {/* Integration Badge Indicator */}
          <div className="pt-6 text-slate-500 text-xs font-bold uppercase tracking-wider space-y-3">
            <p>Direct API Integration Partners</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <span className="text-sm font-black tracking-widest text-slate-400">TIKTOK API</span>
              <span className="text-sm font-black tracking-widest text-slate-400">META REELS</span>
              <span className="text-sm font-black tracking-widest text-slate-400">YOUTUBE API</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section 2: Interactive 3-Step Workflow */}
      <div className="bg-[#0B0F19]/40 border-y border-slate-900 py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl font-black text-white">Three Steps to Post Everywhere</h2>
            <p className="text-sm text-slate-400">Our simple tool handles video checks, AI writing, and simultaneous posting in under two minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {steps.map((st, i) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-850 p-6 rounded-2xl relative space-y-4 shadow-lg hover:border-indigo-500/40 transition-colors group">
                <div className="absolute -top-5 right-5 text-4xl font-black font-mono text-slate-800/45 group-hover:text-indigo-500/10 transition-colors">
                  {st.num}
                </div>
                <div className="px-2.5 py-1 text-[10px] font-bold text-indigo-300 bg-indigo-950/40 border border-indigo-900/40 rounded-md w-fit uppercase tracking-wider">
                  {st.badge}
                </div>
                <h3 className="text-lg font-bold text-white pt-2">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Manual Bottleneck vs. Omni-Cast Freedom */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest font-mono">Why use Omni-Cast?</span>
            <h2 className="text-3xl font-black text-white">Manual Posting vs. Omni-Cast</h2>
            <p className="text-xs sm:text-sm text-slate-400">See how much easier and faster it is to manage your vertical videos in one single dashboard.</p>
          </div>

          <div className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 bg-slate-900 border-b border-slate-800 text-xs font-bold uppercase tracking-wider p-4 text-slate-300">
              <div className="col-span-1">Action Flow</div>
              <div className="col-span-1 text-rose-400 flex items-center gap-1">Manual Publishing</div>
              <div className="col-span-1 text-emerald-400 flex items-center gap-1">Omni-Cast Way</div>
            </div>
            
            <div className="divide-y divide-slate-850/60 text-xs">
              {[
                {
                  action: "Video File Handling",
                  manual: "Crop, resize, and export multiple times. Make duplicate files manually.",
                  omni: "Upload one main video. Our system automatically adapts preview overlays."
                },
                {
                  action: "Copywriting & Tags",
                  manual: "Copy and paste into notes. Open multiple browsers. Type tags again and again.",
                  omni: "Gemini writes engaging descriptions and formats hashtags natively."
                },
                {
                  action: "Overlay Verification",
                  manual: "Post live and hope social app buttons do not cover your video text.",
                  omni: "Check visual overlays representing native app controls before dispatching."
                },
                {
                  action: "Launch Timing",
                  manual: "Remember peak hours, set phone alarms, and stay awake to click post.",
                  omni: "Queue uploads ahead of time. Our automated scheduler posts for you."
                }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 p-4 items-center gap-4 hover:bg-slate-900/30 transition-colors">
                  <div className="col-span-1 font-bold text-white">{row.action}</div>
                  <div className="col-span-1 text-slate-400 pr-2">{row.manual}</div>
                  <div className="col-span-1 text-slate-200 font-medium pl-1 border-l border-slate-800/60">{row.omni}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Interactive SaaS FAQ */}
      <div className="bg-[#0B0F19]/20 border-t border-slate-900/60 py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-indigo-400 mx-auto" />
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Get instant answers about our core integration capabilities and subscription parameters.</p>
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
                        <p className="p-6 text-xs sm:text-sm text-slate-450 leading-relaxed font-medium">
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

      {/* Footer minimal info */}
      <div className="border-t border-slate-900/60 bg-[#05070D] py-6 text-center text-xs text-slate-600">
        <p>© 2026 Omni-Cast distribution ecosystem. Built for modern high-velocity content production.</p>
      </div>
    </div>
  );
}

// 2. SERVICES VIEW
export function ServicesView({ onNavigate }: { onNavigate: (page: any) => void }) {
  const services = [
    {
      icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
      title: "AI Caption Generator",
      description: "Use Gemini AI to write catchy descriptions, trending tags, and titles for your videos so they perform great on feeds."
    },
    {
      icon: <Share2 className="w-8 h-8 text-purple-400" />,
      title: "Post Everywhere at Once",
      description: "Connect your profiles on TikTok, YouTube, and Instagram. Upload your video once, and we will send it to all apps in one click."
    },
    {
      icon: <Eye className="w-8 h-8 text-pink-400" />,
      title: "Video Safe-Zone Previews",
      description: "See exactly where buttons, comments, and captions will sit on the screen. Never let important text get covered again."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
      title: "All Your Stats in One Place",
      description: "See your views, likes, shares, and comments across all platforms in one simple dashboard without having to switch apps."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
      title: "Secure Social Connection",
      description: "We connect safely with your profiles using official links. Your login details are secure and we never see your passwords."
    },
    {
      icon: <Globe className="w-8 h-8 text-pink-400" />,
      title: "Easy Scheduling Calendar",
      description: "Pick the best time for your audience and schedule your video uploads ahead of time. Our automated system does the rest."
    }
  ];

  return (
    <div id="services-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Title and Intro header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            High-Performance Platform Features
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-medium">
            Everything you need to broadcast, optimize, and track short-form video campaigns from a single unified workspace. Stop wasting hours copying and pasting.
          </p>
        </div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6"
        >
          {services.map((svc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#0B0F19] border border-slate-800/65 rounded-2xl p-6 hover:border-indigo-500/50 hover:bg-[#0E1424] transition-all duration-300 group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 border border-slate-800 w-fit rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {svc.icon}
                </div>
                <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {svc.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section: Interactive API Code Block */}
        <div className="bg-[#0B0F19] border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/40 text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Developer Sandbox</span>
              </div>
              <h3 className="text-2xl font-black text-white">Connect with our API</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Are you running an agency or custom automation scripts? You can use our secure API and webhooks to upload videos automatically from your own servers.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure API Key Authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time notifications of post status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Simple JSON formats for easy setup</span>
                </li>
              </ul>
            </div>

            {/* Code container */}
            <div className="bg-[#070A13] border border-slate-850 rounded-2xl overflow-hidden font-mono text-[11px] shadow-xl">
              <div className="bg-slate-900/70 px-4 py-2.5 border-b border-slate-850 flex items-center justify-between text-slate-400 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span>REST-Endpoint: POST /api/broadcast</span>
              </div>
              <div className="p-4 overflow-x-auto text-slate-300 space-y-3">
                <p className="text-indigo-400 font-bold"># Transmit payload to Omni-Cast network</p>
                <p className="text-slate-200">
                  curl -X POST &quot;https://api.omni-cast.online/v1/broadcast&quot; \<br />
                  &nbsp;&nbsp;-H &quot;Authorization: Bearer <span className="text-pink-400">omni_sk_live_...</span>&quot; \<br />
                  &nbsp;&nbsp;-H &quot;Content-Type: application/json&quot; \<br />
                  &nbsp;&nbsp;-d &apos;&#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&quot;videoUrl&quot;: &quot;https://assets.storage/draft_3812.mp4&quot;,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&quot;title&quot;: &quot;Creative Process Update&quot;,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&quot;platforms&quot;: [&quot;tiktok&quot;, &quot;youtube_shorts&quot;, &quot;instagram&quot;]<br />
                  &nbsp;&nbsp;&#125;&apos;
                </p>
                <div className="border-t border-slate-850 pt-3 space-y-1.5 text-[10px] text-slate-450">
                  <p className="text-emerald-400 font-bold">HTTP/1.1 202 Accepted</p>
                  <p>&#123; &quot;broadcastId&quot;: &quot;tx_bc_8921a&quot;, &quot;status&quot;: &quot;queued&quot; &#125;</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Platform specs grid */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1.5">
            <h3 className="text-xl font-extrabold text-white">Supported Video Formats</h3>
            <p className="text-xs text-slate-400">We automatically format and optimize your videos to match what each social app wants.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            {[
              { title: "Vertical Aspect Ratio", value: "9:16 Portrait", detail: "Optimized 1080x1920 pixels" },
              { title: "Encoding Standard", value: "H.264 / AAC", detail: "Progressive scan profile" },
              { title: "Fluid Frame Rates", value: "30 fps / 60 fps", detail: "High fidelity movement" },
              { title: "Max Duration Track", value: "3 Minutes", detail: "Standard short clip limit" }
            ].map((spec, i) => (
              <div key={i} className="bg-[#0B0F19]/60 border border-slate-850 p-5 rounded-2xl">
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{spec.title}</p>
                <p className="text-lg font-black text-white mt-1">{spec.value}</p>
                <p className="text-[10px] text-slate-500 mt-1">{spec.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic call-out CTA bar */}
        <div className="mt-12 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-900/50 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Ready to reach a wider audience?</h4>
            <p className="text-xs text-slate-400">Try Omni-Cast today and post your vertical videos in seconds.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("auth")}
            className="px-6 py-3 bg-white text-[#070A13] hover:bg-slate-100 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-white/10 shrink-0"
          >
            <span>Start Posting Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. RESOURCES VIEW
export function ResourcesView({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [selectedPlatform, setSelectedPlatform] = useState<"tiktok" | "reels" | "shorts">("tiktok");

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
    reels: {
      title: "Instagram & Facebook Reels Requirements",
      aspectRatio: "9:16 Portrait (Vertical)",
      resolution: "1080 x 1920 px",
      fileFormat: "MP4 or MOV video",
      maxSize: "Up to 4 GB video file size",
      maxDuration: "Up to 90 seconds (Under 60 secs is best)",
      safeZones: "Avoid placing logos or text in the bottom 25% or the top 15% of your screen.",
      bestTime: "Mondays 11:00 AM, Wednesdays 9:00 AM, Thursdays 12:00 PM EST"
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
            <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {(["tiktok", "reels", "shorts"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                    selectedPlatform === p
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  {p === "shorts" ? "YouTube Shorts" : p === "reels" ? "Instagram/Meta Reels" : "TikTok"}
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

            {/* Simulated Safe-Zone Phone preview box */}
            <div className="flex justify-center">
              <div className="relative w-64 h-[380px] bg-slate-950 border-4 border-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between p-4 font-mono text-[9px] text-slate-400">
                {/* Speaker pill */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-full" />
                
                {/* Simulated dynamic camera video area */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-indigo-950/20 via-transparent to-pink-950/25 pointer-events-none">
                  {/* Top Header info */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white opacity-70">Live API Channel</span>
                    <span className="bg-indigo-600 text-white font-bold px-1.5 py-0.5 rounded uppercase text-[8px]">9:16 safe</span>
                  </div>

                  {/* Overlays representation depending on selected platform */}
                  {selectedPlatform === "tiktok" && (
                    <div className="space-y-1 mt-auto">
                      <div className="absolute right-2 top-1/3 flex flex-col gap-4 text-center">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white">🧑</div>
                        <div className="text-rose-500 font-bold">♥ 14K</div>
                        <div className="text-white">💬 392</div>
                        <div className="text-white">★ 1.2K</div>
                      </div>
                      <div className="bg-red-900/40 border border-red-500/50 p-2 rounded text-red-200 text-[8px] max-w-[170px] mt-24">
                        ⚠️ DANGER ZONE: Captions area. Keep key visuals above.
                      </div>
                    </div>
                  )}

                  {selectedPlatform === "reels" && (
                    <div className="space-y-1 mt-auto">
                      <div className="absolute right-2 bottom-12 flex flex-col gap-3 text-center">
                        <div className="text-white">♥ 3.2K</div>
                        <div className="text-white">💬 120</div>
                        <div className="text-white">🔗 Share</div>
                      </div>
                      <div className="bg-amber-900/40 border border-amber-500/50 p-2 rounded text-amber-200 text-[8px] max-w-[160px] mt-28">
                        ⚠️ IG CAPTIONS OVERLAY ZONE.
                      </div>
                    </div>
                  )}

                  {selectedPlatform === "shorts" && (
                    <div className="space-y-1 mt-auto">
                      <div className="absolute right-2 bottom-16 flex flex-col gap-4 text-center">
                        <div className="text-white">👍 Like</div>
                        <div className="text-white">👎 Dislike</div>
                        <div className="text-white">💬 85</div>
                      </div>
                      <div className="bg-purple-900/40 border border-purple-500/50 p-2 rounded text-purple-200 text-[8px] max-w-[170px]">
                        ⚠️ SHORTS CONTROL TEXT OVERLAY.
                      </div>
                    </div>
                  )}

                  {/* Bottom indicator */}
                  <div className="flex justify-between items-center mt-auto border-t border-slate-900/60 pt-2">
                    <span className="text-slate-500">Peak hour:</span>
                    <span className="text-emerald-400 font-bold">{platformData[selectedPlatform].bestTime.split(",")[0]}</span>
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
            Have questions about how Omni-Cast works, pricing, or custom setups? Drop us a message!
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
                      href="mailto:info@omni-cast.online" 
                      className="text-sm font-bold text-indigo-300 hover:text-indigo-200 select-all font-mono"
                    >
                      info@omni-cast.online
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
                    Thank you for contacting Omni-Cast. We received your message and we'll write back to you shortly.
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

        {/* Section: Global Operational Hubs */}
        <div className="space-y-6 pt-8 border-t border-slate-900">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono">Our Network</span>
            <h3 className="text-2xl font-black text-white">Global Operational Hubs</h3>
            <p className="text-xs text-slate-400">Where our synchronization engineers and platform support advocates operate daily.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                city: "San Francisco, USA",
                role: "R&D & AI Systems",
                address: "Market Street, Suite 400",
                coords: "37.7749° N, 122.4194° W"
              },
              {
                city: "London, UK",
                role: "Creator Advocacy",
                address: "Soho Square, West End",
                coords: "51.5151° N, 0.1303° W"
              },
              {
                city: "Dublin, Ireland",
                role: "EMEA Operations",
                address: "Grand Canal Dock",
                coords: "53.3498° N, 6.2603° W"
              }
            ].map((hub, i) => (
              <div key={i} className="bg-[#0B0F19] border border-slate-850 p-5 rounded-xl space-y-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                  <h4 className="text-sm font-bold text-white">{hub.city}</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-indigo-400 font-semibold">{hub.role}</p>
                  <p className="text-slate-400">{hub.address}</p>
                  <p className="text-[10px] text-slate-600 font-mono">{hub.coords}</p>
                </div>
              </div>
            ))}
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
