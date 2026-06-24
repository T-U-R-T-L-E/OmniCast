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
  Video
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
    { id: "about", label: "About Us" },
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
        <button
          type="button"
          onClick={() => {
            onNavigate(isAuthenticated ? "upload" : "auth");
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-lg shadow-indigo-950/50 hover:shadow-indigo-900/60 transition-all duration-200 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>{isAuthenticated ? "Go to Dashboard" : "Start Now"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
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
  return (
    <div id="home-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 flex flex-col justify-between overflow-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[32rem] h-[32rem] bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>AI-Driven Cross-Posting Redefined</span>
          </div>

          {/* Massive high-converting headlines */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
            Publish Once. Dominate Everywhere.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent block mt-2">
              Automated Video Distribution.
            </span>
          </h1>

          {/* Persuasive Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Take a single short-form video clip and push it instantly to TikTok, Instagram Reels, Facebook, and YouTube Shorts. Our smart AI optimizes your metadata, captions, and tags for ultimate viral engagement.
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

          {/* Trust indicator */}
          <div className="pt-12 text-slate-500 text-xs font-bold uppercase tracking-wider space-y-3">
            <p>Trusted by over 14,000+ top content creators and digital marketing teams</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <span className="text-sm font-black tracking-widest text-slate-400">TIKTOK API</span>
              <span className="text-sm font-black tracking-widest text-slate-400">META REELS</span>
              <span className="text-sm font-black tracking-widest text-slate-400">YOUTUBE API</span>
            </div>
          </div>
        </motion.div>
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
      title: "AI Metadata Optimization",
      description: "Harnesses the Gemini LLM engine to intelligently polish your crude video titles, write engaging, keyword-rich video descriptions, and insert high-visibility hashtags targeted specifically to viral trends."
    },
    {
      icon: <Share2 className="w-8 h-8 text-purple-400" />,
      title: "Multi-Platform Syncing",
      description: "Directly connect and authenticate your authorized brand profiles across TikTok, YouTube, Instagram, and Facebook. Cast high-definition video assets into live rendering states with a single unified upload hook."
    },
    {
      icon: <Eye className="w-8 h-8 text-pink-400" />,
      title: "Safe-Zone Previews",
      description: "Stop guessing if your critical visual overlays get cropped by platform UI controls. Our responsive safe-zone grids align captions, graphics, and focus overlays perfectly for all target device viewports."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-emerald-400" />,
      title: "Unified Analytics",
      description: "Review and monitor impressions, likes, shares, comments, and audience retention graphs inside a single multi-profile command center. No more tab-switching to aggregate performance reports."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
      title: "Safe API Access",
      description: "Authorized third-party integrations with official social networks secure your credentials. Fully compliant with platform upload rate limits and premium video distribution specs."
    },
    {
      icon: <Globe className="w-8 h-8 text-pink-400" />,
      title: "Global Distribution Planner",
      description: "Schedule your content launches in advance to capture ideal audience peak hours across various global timezones. Visual queue calendars keep your branding schedule strictly automated."
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

        {/* Dynamic call-out CTA bar */}
        <div className="mt-12 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-900/50 p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Ready to elevate your marketing output?</h4>
            <p className="text-xs text-slate-400">Deploy custom video workflows instantly on our cloud publishing engine.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("auth")}
            className="px-6 py-3 bg-white text-[#070A13] hover:bg-slate-100 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-white/10 shrink-0"
          >
            <span>Activate Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. ABOUT US VIEW
export function AboutUsView({ onNavigate }: { onNavigate: (page: any) => void }) {
  return (
    <div id="about-view" className="min-h-[calc(100vh-4.5rem)] bg-[#070A13] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        {/* Intro */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Our Vision & Mission</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            We are on a mission to empower digital creators worldwide.
          </h2>
          <div className="h-1.5 w-16 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto" />
        </div>

        {/* Professional narrative text blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-350 leading-relaxed font-medium">
          <div className="space-y-4">
            <p>
              Omni-Cast was born in response to a painful reality experienced by modern digital creators and agencies. Crafting premium, engaging content is already a massive creative task. Manually distributing that content across four distinct social platforms—each with its own resolution limits, formatting quirks, and metadata structures—is exhausting.
            </p>
            <p>
              We believed there had to be a more intelligent approach. By leveraging modern API automation and Gemini LLM intelligence, Omni-Cast completely eliminates the hours spent copying, pasting, and cropping. We build high-throughput distribution bridges so creators can focus on storytelling.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Today, Omni-Cast serves as the critical central nervous system for creator studios, marketing agencies, and media companies looking to scale their digital reach. We serve millions of micro-batch automated publishes with near-perfect reliability, conforming assets to native safe-zones.
            </p>
            <p>
              Whether you are an independent creator trying to save hours on your workflows or a major media house coordinating hundreds of vertical short-form video assets, our modular framework provides unmatched distribution flexibility and speed.
            </p>
          </div>
        </div>

        {/* Milestone stats card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-center">
          {[
            { metric: "14,000+", label: "Active Creators" },
            { metric: "2.8M+", label: "Videos Distributed" },
            { metric: "99.98%", label: "API Success Rate" },
            { metric: "35,000 hrs", label: "Workflow Hours Saved" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0B0F19] border border-slate-800/60 p-5 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.metric}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Company principles */}
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-extrabold text-white text-center">The Values That Guide Our Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0B0F19]/40 border border-slate-800/40 p-5 rounded-xl space-y-2">
              <span className="font-bold text-indigo-400 text-sm block">1. Creator First</span>
              <p className="text-xs text-slate-400">We prioritize user ergonomics and screen layouts to maximize creative production flow and eliminate friction.</p>
            </div>
            <div className="bg-[#0B0F19]/40 border border-slate-800/40 p-5 rounded-xl space-y-2">
              <span className="font-bold text-pink-400 text-sm block">2. Complete Transparency</span>
              <p className="text-xs text-slate-400">All direct social network credentials and API quotas are tracked honestly. No hidden rates or backdoors.</p>
            </div>
            <div className="bg-[#0B0F19]/40 border border-slate-800/40 p-5 rounded-xl space-y-2">
              <span className="font-bold text-purple-400 text-sm block">3. Relentless Speed</span>
              <p className="text-xs text-slate-400">We optimize file-handling pipelines to encode, upload, and dispatch high-definition media files in minutes.</p>
            </div>
          </div>
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
            Have questions about platform capabilities, API limits, or custom team tiers? Speak with an automated distribution specialist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Information block */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0B0F19] border border-slate-800/60 p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-extrabold text-white">Public Directory</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-slate-300">
                  <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Creator Assistance</p>
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
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimated Response</p>
                    <p className="text-xs font-semibold">Under 2 hours for active subscribers</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-300">
                  <Users className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Official Discord</p>
                    <p className="text-xs font-semibold">Join the creator collective channel once inside.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/85">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Notice: We strictly comply with official TikTok for Business, Google YouTube API Service, and Meta Developer parameters.
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
                  <h3 className="text-xl font-bold text-white">Message Transmitted!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to Omni-Cast. We have securely received your query. An integration engineer will contact you shortly at your registered email address.
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
      </div>
    </div>
  );
}
