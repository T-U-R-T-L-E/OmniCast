import React, { useState } from "react";
import { 
  FileText, 
  HelpCircle, 
  Search, 
  Layers, 
  TrendingUp, 
  Key, 
  ShieldAlert, 
  Workflow, 
  BookOpen,
  ArrowRight,
  ExternalLink,
  Users,
  Film,
  Sparkles,
  Link,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
  Award,
  Star
} from "lucide-react";
import { HelpCenterView } from "./HelpCenterView";
import { ReviewFormView } from "./ReviewFormView";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "authentication" | "video" | "rate-limits" | "general";
}

interface DocumentationViewProps {
  onAddToast: (msg: string) => void;
  onNavigatePage: (page: any) => void;
  initialTab?: "guides" | "helpdesk" | "review";
}

export function DocumentationView({ onAddToast, onNavigatePage, initialTab }: DocumentationViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "authentication" | "video" | "rate-limits" | "general">("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>("faq-1");
  const [docsTab, setDocsTab] = useState<"guides" | "helpdesk" | "review">(initialTab || "guides");

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const appFeatures = [
    {
      title: "Content Upload Studio",
      desc: "Simulate and verify durations, render channel viewports, and customize aspect ratios side-by-side prior to automated API distribution.",
      target: "upload" as const,
      color: "border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700Icon",
      iconClass: "bg-blue-50 text-blue-600"
    },
    {
      title: "Integrated API Keys",
      desc: "Connect server-side custom integrations, authenticate automated CLI pipelines, and monitor secure bearer token analytics.",
      target: "apikeys" as const,
      color: "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700Icon",
      iconClass: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Operations Center Profiles",
      desc: "Securely save client metadata credentials, grant scopes for Meta, TikTok, & YouTube Shorts, and manage OAuth permission sets.",
      target: "users" as const,
      color: "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700Icon",
      iconClass: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Post Schedule Calendar",
      desc: "Review campaign histories, browse stored metadata, reuse optimized captions, and check scheduled post dates.",
      target: "calendar" as const,
      color: "border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-700Icon",
      iconClass: "bg-purple-50 text-purple-600"
    }
  ];

  const commonChallenges = [
    {
      title: "Short-Lived Token Expirations",
      icon: Key,
      desc: "Creators often face auth expiry. Meta Graph API keys expire every 60 days. Omni-Cast implements proactive background warning hooks to notify you 7 days prior to expiry.",
      solution: "In our Operations tab, use 'Renew Authorization' to re-verify OAuth access, generating a safe, persistent system user token for server posts."
    },
    {
      title: "Aspect Ratio Constraint Errors",
      icon: Film,
      desc: "Instagram Reels and YouTube Shorts throw quiet exceptions if the upload aspect ratio fails vertical thresholds (9:16 vertical crop restrictions).",
      solution: "We provide built-in in-app black padding generators and aspect helpers. When simulated above 1200 seconds or failing shape limits, the viewport logs custom pre-checks."
    },
    {
      title: "HTTP 429 Throttling Boundaries",
      icon: ShieldAlert,
      desc: "Simultaneous cross-posting across multiple major platforms can trigger IP level rate throttling during batch distributions.",
      solution: "Omni-Cast leverages queue scheduling that spreads publishing triggers by 14-second offset intervals, gracefully handling exponential backoff loops."
    },
    {
      title: "TikTok Block Upload Limitations (Chunking)",
      icon: Layers,
      desc: "TikTok's direct publishing API rejects single-part file payloads exceeding 50MB, causing generic HTTP 500 server errors for creators.",
      solution: "Our API client splits payload streams into sequential 5MB chunks automatically, complete with check-sum offsets for perfect audio-video packet alignments."
    }
  ];

  const faqs: FAQ[] = [
    {
      id: "faq-1",
      question: "Which platforms are supported by the Omni-Cast cross-posting engine?",
      answer: "We support Meta Graph API (Instagram Reels and Facebook Pages), YouTube Shorts Data API v3, and the TikTok Direct Publishing API, all organized side-by-side using high-fidelity previews.",
      category: "general"
    },
    {
      id: "faq-2",
      question: "Why does the client preview report a Reels maximum duration of 20 minutes?",
      answer: "While direct in-app interactive recording for Instagram is capped at 3 minutes, pre-recorded video files uploaded through Meta's Publishing API support up to 20 minutes (1200 seconds). We support simulation up to this threshold.",
      category: "video"
    },
    {
      id: "faq-3",
      question: "How do I secure my personal endpoints or API credentials?",
      answer: "API keys should NEVER be exposed to the client browser. Omni-Cast routes all publishing requests through our server-side API proxy (/api/*) keeping database endpoints and secret tokens hidden safely behind encrypted local storage policies.",
      category: "authentication"
    },
    {
      id: "faq-4",
      question: "What should I do if my TikTok publish request returns ‘Incorrect scope’?",
      answer: "TikTok requires the 'video.upload' and 'share.sound.query' scopes. Navigate to Operations, disconnect the current profile, and re-authorize with all permission checkboxes enabled during the redirect popup.",
      category: "authentication"
    },
    {
      id: "faq-5",
      question: "How are API rate limits computed and managed?",
      answer: "YouTube grants a daily quota of 10,000 units. A standard upload consumes about 1,600 units. To balance this, we suggest setting up custom API credentials in our API Key page to avoid taking from the shared tenant quota.",
      category: "rate-limits"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="documentation-hub" className="max-w-5xl mx-auto py-4 px-4 sm:px-0 animate-fade-in text-slate-900 space-y-8 text-left">
      
      {/* Header section matching brand colors */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs border border-indigo-900/40">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-extrabold px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-widest font-mono">
            v2.4 Technical docs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Omni-Cast Hub & Support
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-semibold">
            Discover architectural specifications, solve API rate limitations, simulate optimal video aspect ratios, write testimonials, and message support directly.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setDocsTab("helpdesk");
              onAddToast("Opening Help Center...");
            }}
            className="px-4 py-2 bg-indigo-600/30 border border-indigo-400/20 hover:bg-indigo-600 text-white text-xs font-bold font-sans uppercase rounded-xl cursor-pointer transition-all"
          >
            Help Center desk
          </button>
          <button
            type="button"
            onClick={() => {
              setDocsTab("review");
              onAddToast("Opening Feedback Center...");
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-xs font-bold font-sans uppercase rounded-xl cursor-pointer transition-all shadow-md inline-flex items-center gap-2 text-white border border-indigo-400/20"
          >
            <span>Leave a Review</span>
            <Star className="w-3.5 h-3.5 fill-white/10" />
          </button>
        </div>
      </div>

      {/* Docs / Help / Review Inner Tabs Bar */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setDocsTab("guides")}
          className={`py-3 px-4 font-extrabold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            docsTab === "guides"
              ? "border-indigo-600 text-indigo-750"
              : "border-transparent text-slate-455 hover:text-slate-700"
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>Technical Guides & API</span>
        </button>

        <button
          type="button"
          onClick={() => setDocsTab("helpdesk")}
          className={`py-3 px-4 font-extrabold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            docsTab === "helpdesk"
              ? "border-indigo-600 text-indigo-750"
              : "border-transparent text-slate-455 hover:text-slate-700"
          }`}
        >
          <Mail className="w-4 h-4 text-indigo-500" />
          <span>Support & Help desk</span>
        </button>

        <button
          type="button"
          onClick={() => setDocsTab("review")}
          className={`py-3 px-4 font-extrabold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            docsTab === "review"
              ? "border-indigo-600 text-indigo-750"
              : "border-transparent text-slate-455 hover:text-slate-700"
          }`}
        >
          <Star className="w-4 h-4 text-indigo-505" />
          <span>Write a Review</span>
        </button>
      </div>

      {docsTab === "guides" && (
        <div className="space-y-8">
          {/* Navigating app features hyperlinks section */}
          <div className="space-y-4">
            <div className="border-b border-slate-201 pb-2">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Core Features & Navigation
              </h2>
              <p className="text-xs text-slate-555 font-semibold">
                Quickly jump between Omni-Cast modules to verify credentials or deploy simulated publishing sequences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {appFeatures.map((feat) => (
                <button
                  key={feat.title}
                  type="button"
                  onClick={() => {
                    onNavigatePage(feat.target);
                    onAddToast(`Navigating to ${feat.title}...`);
                  }}
                  className="p-5 border border-slate-205 hover:border-indigo-200 bg-white hover:bg-slate-50/70 transition-all rounded-xl text-left flex flex-col justify-between h-48 group cursor-pointer shadow-3xs"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 font-black text-[10px] text-indigo-600 flex items-center justify-center uppercase border border-indigo-100/50">
                      <Link className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <h3 className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed line-clamp-3">
                      {feat.desc}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Configure Now <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Technical obstacles or challenges people face */}
          <div className="space-y-4">
            <div className="border-b border-slate-201 pb-2">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Real Technical Challenges & Solutions
              </h2>
              <p className="text-xs text-slate-555 font-semibold">
                Common stumbling blocks encountered during direct publishing execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commonChallenges.map((item) => {
                const IconComp = item.icon;
                return (
                  <div key={item.title} className="bg-white border border-slate-205 rounded-xl p-5 space-y-3.5 hover:border-slate-300 transition-colors shadow-3xs text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-705 rounded-lg border border-indigo-100/50">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.title}</h3>
                    </div>
                    <p className="text-[11.5px] text-slate-500 font-semibold leading-relaxed">{item.desc}</p>
                    <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-[11px] text-slate-600 font-semibold leading-relaxed">
                      <span className="font-extrabold text-xs block text-slate-700 mb-0.5">✓ Recommended Strategy:</span>
                      {item.solution}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search FAQ topics */}
          <div className="space-y-4">
            <div className="border-b border-slate-201 pb-2">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                Stewardship FAQs
              </h2>
              <p className="text-xs text-slate-555 font-semibold">
                Instant answers to the top-voted platform publishing query routines.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "All Topics" },
                  { id: "authentication", label: "Auth" },
                  { id: "video", label: "Video Tech" },
                  { id: "rate-limits", label: "Rate Limits" },
                  { id: "general", label: "General" }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                      activeCategory === cat.id 
                        ? "bg-indigo-600 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="search"
                  placeholder="Search documentation, topics, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = expandedFAQ === faq.id;
                  return (
                    <div 
                      key={faq.id} 
                      className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                        isOpen ? "border-indigo-200 shadow-2xs" : "border-slate-205 shadow-3xs hover:border-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full text-left p-4 flex items-center justify-between gap-4 font-black text-slate-800 text-xs hover:bg-slate-50/50 cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-505 rounded">
                            {faq.category}
                          </span>
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-indigo-505 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-405 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1.5 text-xs text-slate-650 leading-relaxed font-semibold border-t border-slate-100/50 animate-fade-in">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-25/50">
                  <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-505 font-bold">No documentation matches your keywords.</p>
                  <button 
                    type="button" 
                    onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} 
                    className="mt-2 text-xs font-black text-indigo-650 hover:underline cursor-pointer"
                  >
                    Reset search criteria
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {docsTab === "helpdesk" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-4">
          <HelpCenterView 
            onAddToast={onAddToast}
            onNavigateToDocs={() => setDocsTab("guides")}
          />
        </div>
      )}

      {docsTab === "review" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-2 sm:p-4">
          <ReviewFormView 
            onAddToast={onAddToast}
            onNavigateToDocs={() => setDocsTab("guides")}
          />
        </div>
      )}

    </div>
  );
}
