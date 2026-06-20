import React, { useState } from "react";
import { 
  Check, 
  HelpCircle, 
  Info, 
  Star, 
  ChevronDown, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Globe, 
  ArrowRight,
  User,
  Instagram,
  Facebook,
  Youtube,
  Quote,
  Mail,
  Flame,
  MousePointerClick
} from "lucide-react";

interface PricingViewProps {
  onAddToast: (msg: string) => void;
}

export function PricingView({ onAddToast }: PricingViewProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // States for extra profile quantities for each tier
  const [basicExtra, setBasicExtra] = useState<number>(0);
  const [profExtra, setProfExtra] = useState<number>(0);
  const [advExtra, setAdvExtra] = useState<number>(0);

  const plans = [
    {
      name: "Basic",
      tagline: "For individuals who want a simple way to publish to multiple platforms.",
      monthlyPrice: 16,
      yearlyPrice: 10,  // with 40% off or custom math
      isPopular: false,
      color: "indigo-600",
      icon: "☁️",
      features: [
        { text: "5 profiles", bold: true },
        { text: "Each profile links 1 account per platform — e.g., 1 TikTok + 1 Instagram + 1 YouTube..." },
        { text: "∞ Unlimited uploads", bold: true, tooltip: "Upload as many videos as you've got. Maximize the views without worrying about bandwidth!" },
        { text: "Native uploads via official APIs — no scraping, no bans", bold: false },
        { text: "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Reddit, Threads, Pinterest, Bluesky, Discord & Telegram", bold: false },
        { text: "Schedule posts", bold: true },
        { text: "Analytics", bold: true },
        { text: "FFmpeg video editor API — 300 min/mo", bold: true },
        { text: "AI Shorts Uploader — 100 analyses/mo", bold: true, tooltip: "Utilize AI to evaluate short-form videos with semantic ratings." },
        { text: "1 seat (Owner only)", bold: true }
      ],
      extras: [
        { label: "5 profiles", price: 120, qty: 5 },
        { label: "10 profiles", price: 200, qty: 10 }
      ],
      upgradeNotice: "Or upgrade to Professional for +$17/mo"
    },
    {
      name: "Professional",
      tagline: "For creators and freelancers who post regularly and need more flexibility.",
      monthlyPrice: 33,
      yearlyPrice: 20,
      isPopular: true,
      color: "indigo-600",
      icon: "🚀",
      features: [
        { text: "25 profiles", bold: true },
        { text: "Each profile links 1 account per platform — e.g., 1 TikTok + 1 Instagram + 1 YouTube..." },
        { text: "∞ Unlimited uploads", bold: true, tooltip: "Upload unlimited quantities of content across connected channels." },
        { text: "Native uploads via official APIs — no scraping, no bans", bold: false },
        { text: "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Reddit, Threads, Pinterest, Bluesky, Discord & Telegram", bold: false },
        { text: "Schedule posts", bold: true },
        { text: "Analytics", bold: true },
        { text: "White-label dashboard for your clients", bold: true },
        { text: "FFmpeg video editor API — 1,000 min/mo", bold: true },
        { text: "AI Shorts Uploader — 300 analyses/mo", bold: true, tooltip: "Semantic parsing evaluations for high-reach scoring." },
        { text: "2 seats (Owner + 1)", bold: true }
      ],
      extras: [
        { label: "15 profiles", price: 280, qty: 15 },
        { label: "25 profiles", price: 440, qty: 25 }
      ],
      upgradeNotice: "Or upgrade to Advanced for +$85/mo"
    },
    {
      name: "Advanced",
      tagline: "For startups and marketing teams managing multiple social accounts.",
      monthlyPrice: 118,
      yearlyPrice: 70,
      isPopular: false,
      color: "indigo-600",
      icon: "🏢",
      features: [
        { text: "75 profiles", bold: true },
        { text: "Each profile links 1 account per platform — e.g., 1 TikTok + 1 Instagram + 1 YouTube..." },
        { text: "∞ Unlimited uploads", bold: true, tooltip: "Infinite uploads, zero throttles." },
        { text: "Native uploads via official APIs — no scraping, no bans", bold: false },
        { text: "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Reddit, Threads, Pinterest, Bluesky, Discord & Telegram", bold: false },
        { text: "Schedule posts", bold: true },
        { text: "Analytics", bold: true },
        { text: "White-label dashboard for your clients", bold: true },
        { text: "FFmpeg video editor API — 3,000 min/mo", bold: true },
        { text: "AI Shorts Uploader — 600 analyses/mo", bold: true, tooltip: "AI metadata optimizations for maximal audience retention." },
        { text: "5 seats (Owner + 4)", bold: true },
        { text: "Priority support", bold: true }
      ],
      extras: [
        { label: "25 profiles", price: 650, qty: 25 },
        { label: "50 profiles", price: 1150, qty: 50 }
      ],
      upgradeNotice: "Or upgrade to Business for +$232/mo"
    },
    {
      name: "Business",
      tagline: "Scalable plan for companies with flexible pricing for additional profiles.",
      monthlyPrice: 350,
      yearlyPrice: 210,
      isPopular: false,
      color: "indigo-600",
      icon: "💼",
      features: [
        { text: "225 profiles", bold: true },
        { text: "Each profile links 1 account per platform — e.g., 1 TikTok + 1 Instagram + 1 YouTube..." },
        { text: "∞ Unlimited uploads", bold: true, tooltip: "Complete API concurrency with parallel async executions." },
        { text: "Native uploads via official APIs — no scraping, no bans", bold: false },
        { text: "TikTok, Instagram, LinkedIn, YouTube, Facebook, X, Reddit, Threads, Pinterest, Bluesky, Discord & Telegram", bold: false },
        { text: "Schedule posts", bold: true },
        { text: "Analytics", bold: true },
        { text: "White-label dashboard for your clients", bold: true },
        { text: "FFmpeg video editor API — 10,000 min/mo", bold: true },
        { text: "AI Shorts Uploader — 1,000 analyses/mo", bold: true, tooltip: "Enterprise-grade smart filters." },
        { text: "10 seats (Owner + 9)", bold: true },
        { text: "Priority support", bold: true }
      ],
      extras: [],
      upgradeNotice: "Add extra profiles for +$1 per profile / month.",
      isBusinessTier: true
    }
  ];

  const testimonials = [
    {
      name: "Suat Bezeng",
      role: "CEO, Teknoviar",
      avatar: "SB",
      rating: 5,
      content: "I'm managing 70 million views monthly across 20 languages. I reported a Facebook bug — the Co-founder personally fixed it and deployed it within hours. Moving to Omni-Cast was the best business decision I've made this year.",
      platform: "Instagram"
    },
    {
      name: "Ivan",
      role: "Developer, akita",
      avatar: "I",
      rating: 5,
      content: "I was looking for a reliable API and Omni-Cast was incredibly easy to integrate. It streamlined my entire workflow and saves me 2+ hours of manual effort every single day.",
      platform: "Twitter"
    }
  ];

  const microTestimonials = [
    { name: "JF Bertrand", rating: 5, comment: "As someone managing multiple brands, this API is phenomenal.", date: "Jun 13, 2026", col: "JB" },
    { name: "Sugewhite", rating: 5, comment: "Just sick... I have been looking for an automated posting tool like this for ages.", date: "May 16, 2026", col: "S" },
    { name: "Kai Wen", rating: 5, comment: "I LOVE THIS Platform! It is so very easy and secure.", date: "May 15, 2026", col: "KW" },
    { name: "Can Tuğan", rating: 5, comment: "great price for great tool", date: "May 9, 2026", col: "CT" },
    { name: "Suat Bezeng", rating: 5, comment: "I've been managing a massive operation and this API simplified everything.", date: "Mar 4, 2026", col: "SB" },
    { name: "Serge", rating: 5, comment: "Just awesome, and easy to use!", date: "Mar 2, 2026", col: "S" },
    { name: "Lotfy", rating: 5, comment: "Thanks 👍🏽", date: "Feb 20, 2026", col: "L" },
    { name: "Felix Roble", rating: 5, comment: "lo estoy probando vamos aver como responde", date: "Feb 18, 2026", col: "FR" }
  ];

  const faqs = [
    {
      q: "What's included in the Free plan?",
      a: "The Free plan includes 1 profile, 10 uploads per month, and support for over 10 platforms. It is designed to let you explore our interface, preview scheduling workflows, study API responses, and link a master account."
    },
    {
      q: "What happens if I hit my profile limit?",
      a: "If you need more profiles, you can buy individual profile expansion add-ons starting from extra $+5 profiles, or scale up naturally to professional/advanced tiers which scale your workspace limits. We never delete your campaigns when limits are updated."
    },
    {
      q: "Can I switch between monthly and yearly billing?",
      a: "Absolutely! You can switch pricing cycles, and Stripe will retroactively calculate prorated values so you don't lose a penny. Choosing Yearly billing saves you up to 40% on all plans."
    },
    {
      q: "How can I cancel my subscription?",
      a: "You can cancel your subscription with a single click inside your account billing settings. Your plan will remain active until the end of your prepaid billing period, and no further charges will apply."
    },
    {
      q: "Do you offer refunds?",
      a: "Yes, we offer a no-questions-asked 15-day money-back guarantee. If you are not fully satisfied, simply shoot us a message via email or support ticket, and we will process your full refund immediately."
    },
    {
      q: "Is the payment process secure?",
      a: "Yes. Payment transactions are processed entirely through Stripe. Your payment credentials never hit our servers directly, ensuring peak modern compliance and cybersecurity."
    }
  ];

  const handleSubscribe = (planName: string, calculatedPrice: number) => {
    onAddToast(`Initiating Stripe redirect for Omni-Cast ${planName} plan ($${calculatedPrice}/${billingCycle === "yearly" ? "yr" : "mo"})...`);
  };

  return (
    <div id="pricing-page" className="max-w-7xl mx-auto space-y-12 py-4 animate-fade-in text-slate-800">
      
      {/* Dynamic Slogan and subtitle text */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest font-sans">
          Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
          Plans designed for <span className="text-indigo-650 bg-gradient-to-r from-indigo-600 to-indigo-805 bg-clip-text text-indigo-600">your success</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed">
          From solo creators to agencies managing hundreds of accounts.
        </p>

        {/* Monthly / Yearly cycle selector button */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-2xl border border-slate-205 inline-flex gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                billingCycle === "monthly" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-805"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" 
                  ? "bg-[#4F46E5] text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-805"
              }`}
            >
              <span>Yearly</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded font-black tracking-wider uppercase ${
                billingCycle === "yearly" ? "bg-white text-indigo-700" : "bg-indigo-100 text-indigo-700"
              }`}>
                Save 40%
              </span>
            </button>
          </div>

          {/* Badges strip matching bottom labels in Image 2 */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-[11px] font-black text-slate-450 uppercase tracking-wider pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-500">🛡️</span>
              <span>15-day money-back</span>
            </div>
            <span className="text-slate-250">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-505">🔒</span>
              <span>Secured by Stripe</span>
            </div>
            <span className="text-slate-250">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-500">⚙️</span>
              <span>Official APIs - no scraping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Summary Row (Free plan active summary indicator block) */}
      <div className="bg-[#4F46E5]/5 border border-indigo-200/80 rounded-2xl p-5 shadow-3xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg select-none">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-xs font-black uppercase text-indigo-750 font-sans tracking-wide">
                  Your current plan
                </span>
                <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[9px] uppercase tracking-wider rounded">
                  Free
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-850 mt-0.5">Explore our features with lifetime complimentary access</h3>
            </div>
          </div>

          {/* Core limit stats */}
          <div className="flex items-center gap-8 text-center shrink-0 border-t lg:border-t-0 border-slate-200/60 pt-4 lg:pt-0 w-full lg:w-auto justify-around lg:justify-end">
            <div>
              <div className="text-2xl font-black text-indigo-650">1</div>
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Profile</div>
            </div>
            <div className="h-6 w-px bg-slate-200/80"></div>
            <div>
              <div className="text-2xl font-black text-indigo-650">10</div>
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Uploads / Mo</div>
            </div>
            <div className="h-6 w-px bg-slate-200/80"></div>
            <div>
              <div className="text-2xl font-black text-indigo-650">10+</div>
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Platforms</div>
            </div>
          </div>

          <div className="text-slate-450 text-[11px] font-bold shrink-0 self-center hidden xl:block">
            Unlock <strong className="text-indigo-650">unlimited uploads</strong> and up to <strong className="text-indigo-650">225 profiles</strong> below.
          </div>
        </div>
      </div>

      {/* Grid of 4 Plan comparison structures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((p, pIdx) => {
          // Calculate price based on yearly factor
          const rawPrice = billingCycle === "yearly" ? p.yearlyPrice : p.monthlyPrice;
          const billingDisplay = billingCycle === "yearly" ? `$${rawPrice * 12} billed annually` : `$${rawPrice} / month`;
          
          // Extra add-on profiles selections
          const selectedExtraQty = p.name === "Basic" ? basicExtra : p.name === "Professional" ? profExtra : p.name === "Advanced" ? advExtra : 0;
          const extraPrice = selectedExtraQty > 0 ? (p.name === "Basic" ? (selectedExtraQty === 5 ? 120 : 200) : p.name === "Professional" ? (selectedExtraQty === 15 ? 280 : 440) : (selectedExtraQty === 25 ? 650 : 1150)) : 0;
          
          const finalPostPrice = billingCycle === "yearly" ? rawPrice + Math.floor(extraPrice / 12) : rawPrice + (selectedExtraQty > 0 ? Math.floor(extraPrice / 10) : 0);

          return (
            <div 
              key={p.name} 
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                p.isPopular 
                  ? "border-[2.5px] border-[#4F46E5] bg-white shadow-md scale-[1.02] z-10" 
                  : "border border-slate-205 bg-white hover:border-slate-300 hover:shadow-2xs"
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-[9.5px] font-extrabold px-3.5 py-1 tracking-widest uppercase rounded-full flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>Most Popular</span>
                </div>
              )}

              {/* Upper Section */}
              <div className="space-y-4">
                {/* Plan Badge name */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-sm border border-indigo-100">
                    {p.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">PLAN</span>
                    <h3 className="text-base font-extrabold text-slate-850 leading-none">{p.name}</h3>
                  </div>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                  {p.tagline}
                </p>

                {/* Price tag */}
                <div className="py-2.5 border-y border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      ${finalPostPrice}
                    </span>
                    <span className="text-xs text-slate-455 font-bold">/ month</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5 justify-start">
                    <span>{billingDisplay}</span>
                    {billingCycle === "yearly" && (
                      <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-755 font-black text-[8px] uppercase tracking-wider rounded">
                        Save {p.name === "Basic" ? "$96" : p.name === "Professional" ? "$200" : p.name === "Advanced" ? "$353" : "$1,051"}/yr
                      </span>
                    )}
                  </div>
                </div>

                {/* Action CTA Button */}
                <button
                  type="button"
                  onClick={() => handleSubscribe(p.name, finalPostPrice)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer text-center transition-all ${
                    p.isPopular 
                      ? "bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-xs" 
                      : "bg-white hover:bg-slate-50 text-indigo-650 border border-slate-205 hover:border-indigo-150"
                  }`}
                >
                  Subscribe
                </button>

                {/* Checklist segment header */}
                <div className="pt-2 text-[10.5px] font-black uppercase tracking-wider text-slate-400">
                  What's included
                </div>

                {/* Checklist features loop */}
                <div className="space-y-3 pt-1">
                  {p.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="p-0.5 bg-emerald-50 text-emerald-600 rounded mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`${feat.bold ? "font-extrabold text-slate-850" : "font-semibold text-slate-600/90 leading-relaxed"}`}>
                          {feat.text}
                        </span>
                        {feat.tooltip && (
                          <span title={feat.tooltip} className="text-slate-350 hover:text-indigo-500 cursor-help transition-colors">
                            <Info className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lower Custom Extra profiles expansion panel */}
              {p.extras && p.extras.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3.5 bg-slate-50/25 p-3 rounded-2xl">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-455 uppercase tracking-wide">
                    <span>Add Extra Profiles</span>
                    <span className="text-[9px] text-slate-400 capitalize">Pick any</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {p.extras.map((op) => {
                      const isActive = selectedExtraQty === op.qty;
                      return (
                        <button
                          key={op.qty}
                          type="button"
                          onClick={() => {
                            const activeVal = isActive ? 0 : op.qty;
                            if (p.name === "Basic") setBasicExtra(activeVal);
                            if (p.name === "Professional") setProfExtra(activeVal);
                            if (p.name === "Advanced") setAdvExtra(activeVal);
                            onAddToast(`Configured +${op.qty} extra profile seats for ${p.name} workspace.`);
                          }}
                          className={`p-2 border rounded-xl text-center cursor-pointer transition-all ${
                            isActive 
                              ? "bg-indigo-50 border-indigo-500 text-indigo-705 shadow-3xs text-[10.5px] font-black" 
                              : "bg-white border-slate-200 hover:border-slate-300 text-slate-550 text-[10px] font-bold"
                          }`}
                        >
                          <div>+{op.label}</div>
                          <div className="text-[8.5px] text-slate-400 font-extrabold mt-0.5">
                            +${billingCycle === "yearly" ? Math.floor(op.price/12) : Math.floor(op.price/10)}/mo
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-slate-450 text-center font-bold">
                    {p.upgradeNotice}
                  </p>
                </div>
              )}

              {p.isBusinessTier && (
                <div className="mt-6 pt-5 border-t border-slate-100 p-3 bg-indigo-50/10 rounded-2xl border border-dashed border-indigo-150 text-center">
                  <span className="text-[9px] text-indigo-600 font-black tracking-widest uppercase block mb-1">Scalable Workspace</span>
                  <p className="text-[11px] text-indigo-800 leading-relaxed font-bold">
                    {p.upgradeNotice}
                  </p>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Testimonials Review module */}
      <div className="space-y-6 pt-6 border-t border-slate-150">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-850">
            Highly trusted by global teams
          </h2>
          <p className="text-xs text-slate-400 font-semibold max-w-md mx-auto">
            See why leading developers and digital agencies publish via Omni-Cast.
          </p>
        </div>

        {/* 2 Big Review elements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs space-y-4 relative flex flex-col justify-between">
              <Quote className="absolute top-4 right-4 text-slate-100/90 w-12 h-12 -z-0" />
              <div className="space-y-3 z-10">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, rIdx) => (
                    <Star key={rIdx} className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              {/* Author badge */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-50 border border-indigo-150 rounded-full flex items-center justify-center text-indigo-605 font-black text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-800 text-left">{t.name}</h5>
                    <p className="text-[10.5px] text-slate-400 font-bold text-left">{t.role}</p>
                  </div>
                </div>
                <div className="text-[10px] uppercase font-black text-slate-400 bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg">
                  verified review
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 8 Small Micro Reviews grid matching image 2 bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 max-w-6xl mx-auto">
          {microTestimonials.map((mt, mtIdx) => (
            <div key={mtIdx} className="bg-slate-50/40 border border-slate-150 rounded-2xl p-4 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: mt.rating }).map((_, index) => (
                    <Star key={index} className="w-3 h-3 text-amber-500 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-705 leading-relaxed italic text-left">
                  "{mt.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-150/50">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-indigo-100/60 text-indigo-700 rounded-full text-[9px] font-black flex items-center justify-center">
                    {mt.col}
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-800">{mt.name}</span>
                </div>
                <span className="text-[8.5px] text-slate-400 font-bold">{mt.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible FAQ segment */}
      <div className="bg-white border border-slate-205 rounded-3xl p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[9.5px] font-black text-indigo-650 tracking-widest uppercase">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-850 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold">
            Everything you need to know before subscribing.
          </p>
        </div>

        {/* Accordions */}
        <div className="divide-y divide-slate-150">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-4 font-extrabold text-slate-850 hover:text-indigo-600 text-xs sm:text-sm cursor-pointer py-1 transition-all"
                >
                  <span className="text-left leading-snug">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-600" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="pt-2.5 pb-1 text-xs text-slate-500 leading-relaxed font-semibold pr-4 animate-fade-in text-left">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Still Have Questions Box */}
      <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4">
        <div className="w-11 h-11 bg-indigo-50 border border-indigo-150 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-3xs animate-bounce">
          <Mail className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Still have questions?</h4>
          <p className="text-xs text-slate-450 leading-relaxed font-semibold">
            Send us a message and we'll respond as soon as possible — usually within a few hours.
          </p>
        </div>
        <a
          href="mailto:info@omni-cast.online"
          onClick={(e) => { onAddToast("Opening mail client..."); }}
          className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <Mail className="w-4 h-4" />
          <span>info@omni-cast.online</span>
        </a>
      </div>

    </div>
  );
}
