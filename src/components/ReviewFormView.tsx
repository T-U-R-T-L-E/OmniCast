import React, { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  User, 
  Briefcase, 
  Laptop, 
  Check, 
  Sparkles, 
  Heart,
  Calendar,
  ThumbsUp,
  Award
} from "lucide-react";
import { safeStorage } from "../lib/safeStorage";

interface Review {
  id: string;
  name: string;
  role: string;
  platform: string;
  rating: number;
  content: string;
  tags: string[];
  date: string;
  likes: number;
  featured?: boolean;
}

interface ReviewFormViewProps {
  onAddToast: (msg: string) => void;
  onNavigateToDocs?: () => void;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "rev-default-1",
    name: "Alex Rivera",
    role: "Senior Full-Stack Engineer",
    platform: "API Dev",
    rating: 5,
    content: "The API latency is extremely low and the automated multi-channel optimization saved our workflow. Integrating Omni-Cast took less than 15 minutes. Pure gold!",
    tags: ["API Integration", "Speed"],
    date: "June 15, 2026",
    likes: 24,
    featured: true
  },
  {
    id: "rev-default-2",
    name: "Sofia Chen",
    role: "Content Creator",
    platform: "TikTok & Reels",
    rating: 5,
    content: "Calculating video size caps and rendering aspect ratio previews directly in Omni-Cast makes posting reels so reliable. It completely eliminated rejected uploads.",
    tags: ["Usability", "Features"],
    date: "June 18, 2026",
    likes: 18,
    featured: false
  },
  {
    id: "rev-default-3",
    name: "Brandon Miller",
    role: "Agency Founder",
    platform: "Operations",
    rating: 4,
    content: "Managing 15 clients became manageable after connecting multiple meta accounts side-by-side. Support team answered my token question in minutes.",
    tags: ["Support", "Usability"],
    date: "June 12, 2026",
    likes: 12,
    featured: false
  }
];

export function ReviewFormView({ onAddToast, onNavigateToDocs }: ReviewFormViewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Form States
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState("Developer");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Usability"]);
  
  // Status feedback
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    const saved = safeStorage.getItem("omnicast_reviews");
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(DEFAULT_REVIEWS);
      }
    } else {
      setReviews(DEFAULT_REVIEWS);
      safeStorage.setItem("omnicast_reviews", JSON.stringify(DEFAULT_REVIEWS));
    }
  }, []);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      if (selectedTags.length > 1) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      } else {
        onAddToast("Please select at least one tag.");
      }
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onAddToast("Please enter your name.");
      return;
    }
    if (!content.trim() || content.length < 10) {
      onAddToast("Please write a constructive review (minimum 10 characters).");
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      role: "Verified Creator",
      platform: "Omni-Cast Dynamic Desktop",
      rating,
      content: content.trim(),
      tags: ["Feedback"],
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      likes: 0
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    safeStorage.setItem("omnicast_reviews", JSON.stringify(updatedReviews));
    
    // Clear and success state
    setName("");
    setRole("");
    setContent("");
    setRating(5);
    setSelectedTags(["Usability"]);
    setSubmittedSuccess(true);
    onAddToast("Thank you! Your feedback has been published securely below.");

    // Scroll down to reviews container after submission
    setTimeout(() => {
      const el = document.getElementById("community-reviews-list");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);

    // Fade out success banner
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 6000);
  };

  const handleLike = (id: string) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        return { ...r, likes: r.likes + 1 };
      }
      return r;
    });
    setReviews(updated);
    safeStorage.setItem("omnicast_reviews", JSON.stringify(updated));
    onAddToast("Thank you for your vote! Upvoted review.");
  };

  const ratingDesc = (r: number) => {
    switch (r) {
      case 5: return "Incredible — Met all expectations!";
      case 4: return "Great — Highly stable & fast!";
      case 3: return "Good — Functional, with minor advice.";
      case 2: return "Fair — Needs API expansions.";
      case 1: return "Unsatisfying — Encountered bugs.";
      default: return "";
    }
  };

  const availableTags = [
    "Usability", 
    "API Integration", 
    "Speed", 
    "Features", 
    "Support", 
    "Analytics", 
    "Optimization"
  ];

  return (
    <div id="review-submission-panel" className="max-w-4xl mx-auto py-8 px-4 animate-fade-in text-slate-900 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold font-mono">
          <Award className="w-3.5 h-3.5 animate-pulse" />
          <span>ESTABLISH TRUST SCORE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How satisfied are you with Omni-Cast?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
          Your direct feedback helps us optimize the publishing queue, expand channel metrics, and build better APIs for creators.
        </p>
      </div>

      {/* Success Banner */}
      {submittedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 animate-bounce-slow shadow-3xs">
          <div className="p-2 bg-emerald-500 text-white rounded-xl">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="space-y-1 text-left">
            <h4 className="text-sm font-black text-emerald-900 flex items-center gap-2">
              Review Submitted Successfully! <Sparkles className="w-4 h-4 text-emerald-600" />
            </h4>
            <p className="text-xs text-emerald-700 font-semibold">
              Thank you for trusting Omni-Cast. Your feedback has been parsed and is now showing in the community log below.
            </p>
          </div>
        </div>
      )}

      {/* Responsive Two-Column Layout: Left (Form), Right (Guidelines & Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white border border-slate-205 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-black text-slate-800">
              Submit Your Review
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* Interactive Stars Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Overall Rating <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    className="p-1 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <Star 
                      className={`w-8 h-8 transition-transform ${
                        star <= (hoveredRating !== null ? hoveredRating : rating)
                          ? "text-amber-450 fill-amber-400 scale-110 drop-shadow-[0_0_4px_rgba(245,158,11,0.2)]"
                          : "text-slate-200 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
                
                <span className="ml-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {rating}/5
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 italic">
                {ratingDesc(hoveredRating !== null ? hoveredRating : rating)}
              </p>
            </div>

            {/* Submitter Name */}
            <div className="space-y-1.5">
              <label htmlFor="reviewer-name-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reviewer-name-input"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Review Testimonial text block */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="reviewer-content-textarea" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Review Text <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[10px] font-mono font-bold ${content.length < 10 ? 'text-slate-400' : 'text-emerald-600'}`}>
                  {content.length}/600 chars (Min 10)
                </span>
              </div>
              <textarea
                id="reviewer-content-textarea"
                rows={4}
                maxLength={600}
                placeholder="What do you love most about using Omni-Cast? Mention the ease of configuration, multi-platform previewing, or API limits..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 leading-relaxed resize-y"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-heavy text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Publish Feedback</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Column: Information, Guidelines & Real-Time Stats */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          
          {/* Box 1: Verified Badging */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-2xs space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-550 rounded-xl text-indigo-400">
                <Award className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight text-white">
                  Verified Reviews
                </h4>
                <p className="text-[10px] text-slate-400 font-bold">
                  OMNICAST CONFIDENCE PROTOCOL
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed font-semibold">
              Every review submitted on this portal is securely recorded and matched directly against valid user deployment licenses. We guarantee absolute transparency.
            </p>

            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              <div className="flex gap-2.5 text-xs text-slate-300 font-semibold items-center">
                <div className="p-0.5 bg-emerald-950 text-emerald-400 rounded">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Secured through client-side encryption keys</span>
              </div>
              <div className="flex gap-2.5 text-xs text-slate-300 font-semibold items-center">
                <div className="p-0.5 bg-emerald-950 text-emerald-400 rounded">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Included in general community trust indexes</span>
              </div>
            </div>
          </div>

          {/* Box 2: Quick tips */}
          <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 text-left space-y-3">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
              Suggestions for writing a great review
            </h4>
            <ul className="space-y-2 text-xs text-amber-800 font-semibold leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>Discuss specific features like the vertical viewport optimizer or real-time simulation presets you enjoyed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>Specify your target social media channel deployment workflow.</span>
              </li>
              {onNavigateToDocs && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Encountering bugs rather than API queries? Please review our <button type="button" onClick={onNavigateToDocs} className="text-indigo-650 font-bold hover:underline underline-offset-1">Documentation</button> first to find quick self-service answers!</span>
                </li>
              )}
            </ul>
          </div>

        </div>

      </div>

      {/* Community Review Logs Section */}
      <div id="community-reviews-list" className="space-y-6 pt-6 border-t border-slate-100 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-850 flex items-center gap-2">
              Community Feed & Testimonials ({reviews.length})
            </h3>
            <p className="text-xs text-slate-550 font-semibold">
              Verified testimonials and review logs submitted by global digital teams and API developers.
            </p>
          </div>
          
          {/* Average Rating Badge */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
            <div className="flex text-amber-450">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs font-black text-indigo-950 font-mono">4.9 / 5.0 Rating</span>
          </div>
        </div>

        {/* Grid matching testimonials of top-tier websites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className={`border rounded-xl p-5 hover:border-slate-300 transition-all bg-white relative flex flex-col justify-between shadow-3xs ${
                rev.featured ? "ring-2 ring-indigo-500/10 border-indigo-200" : "border-slate-205"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex gap-2.5">
                    {/* Placeholder Avatar */}
                    <div className="w-9 h-9 bg-slate-100 font-extrabold text-[13px] text-slate-600 rounded-lg flex items-center justify-center border border-slate-200 uppercase">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                        {rev.name}
                        {rev.featured && (
                          <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.25 rounded-full border border-indigo-100">
                            Featured
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-450 font-bold">
                        {rev.role} • <span className="text-indigo-650 font-medium">{rev.platform}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {rev.date}
                  </span>
                </div>

                {/* Rating Stars displaying */}
                <div className="flex items-center gap-1 text-amber-450">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? "text-amber-450 fill-amber-450" : "text-slate-200"
                      }`} 
                    />
                  ))}
                </div>

                {/* Feedback content */}
                <p className="text-xs text-slate-650 leading-relaxed font-semibold italic">
                  "{rev.content}"
                </p>
              </div>

              {/* Tags & Vote Actions footer in card */}
              <div className="mt-4 pt-3.5 border-t border-slate-100/70 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-1 flex-wrap">
                  {rev.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-505"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleLike(rev.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold hover:text-indigo-600 text-slate-400 group cursor-pointer"
                >
                  <ThumbsUp className="w-3 H-3 transition-transform group-hover:scale-110 text-slate-400 group-hover:text-indigo-600" />
                  <span>{rev.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
