import React, { useState, useEffect } from "react";
import { 
  User, 
  CreditCard, 
  Calendar, 
  ShieldAlert, 
  Star, 
  LogOut, 
  Check, 
  Mail, 
  ChevronDown, 
  ExternalLink,
  Receipt,
  Sparkles,
  RefreshCw,
  Trash2,
  Lock
} from "lucide-react";

interface ProfileViewProps {
  userEmail: string;
  onLogout: () => void;
  onAddToast: (msg: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export function ProfileView({
  userEmail,
  onLogout,
  onAddToast,
  onNavigateToTab
}: ProfileViewProps) {
  // Calendar preference state (persisted)
  const [weekStart, setWeekStart] = useState<"Monday" | "Sunday">("Monday");
  
  // Custom states for interactive actions
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(userEmail);
  const [currentEmail, setCurrentEmail] = useState(userEmail);
  const [currentPlan, setCurrentPlan] = useState("Default");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Load week preference on mount
  useEffect(() => {
    const savedWeek = localStorage.getItem("omnicast_week_start");
    if (savedWeek === "Sunday" || savedWeek === "Monday") {
      setWeekStart(savedWeek);
    }
  }, []);

  const handleWeekStartChange = (val: "Monday" | "Sunday") => {
    setWeekStart(val);
    localStorage.setItem("omnicast_week_start", val);
    onAddToast(`Calendar week preference updated: Starts on ${val}`);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed || !trimmed.includes("@")) {
      onAddToast("Error: Please specify a valid email address.");
      return;
    }
    setCurrentEmail(trimmed);
    setIsChangingEmail(false);
    onAddToast(`Account email updated to ${trimmed}`);
  };

  const handleStripeAction = (actionName: string) => {
    onAddToast(`Initiating secure Stripe session for ${actionName}...`);
  };

  const handleDeleteAccount = () => {
    onAddToast("Account successfully scheduled for permanent deletion.");
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  return (
    <div id="my-profile-view" className="max-w-4xl mx-auto space-y-6 pt-2 pb-12 animate-fade-in text-left">
      
      {/* Title & Description Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Manage your account details, subscription, and billing — all in one place.
        </p>
      </div>

      {/* 1. Main Welcome/User Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <div className="w-16 h-16 rounded-full bg-indigo-650 text-white flex items-center justify-center font-black text-2xl shadow-md uppercase ring-4 ring-indigo-50 shrink-0">
          {currentEmail.charAt(0)}
        </div>
        <div className="space-y-3 flex-1">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-slate-800 tracking-tight mb-0.5">{currentEmail}</h2>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] uppercase tracking-widest font-extrabold rounded-md">
                User
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Welcome to your profile page on <strong className="text-slate-800">upload-post</strong>. View your account details and manage your subscription. We use <span className="text-indigo-600 font-bold">Stripe</span>, the global leader in online payments, for secure subscription and payment management.
          </p>
        </div>
      </div>

      {/* 2. Invoices & Billing Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">Invoices & Billing</h3>
            <p className="text-xs text-slate-450">
              View your legally valid invoices, or update your payment method through Stripe.
            </p>
            <button 
              type="button"
              onClick={() => handleStripeAction("Manage Payment Method")}
              className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-750 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Manage payment method
            </button>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab("invoices")}
          className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider cursor-pointer"
        >
          View Invoices
        </button>
      </div>

      {/* 3. Calendar Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 shrink-0 border border-sky-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">Calendar Preferences</h3>
            <p className="text-xs text-slate-450">
              Choose which day your calendar week starts on.
            </p>
          </div>
        </div>
        <div className="relative w-full md:w-48">
          <select
            value={weekStart}
            onChange={(e) => handleWeekStartChange(e.target.value as "Monday" | "Sunday")}
            className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 4. Account Details */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-650 border border-indigo-100 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-800 tracking-wide">Account Details</h3>
        </div>
        
        <p className="text-xs text-slate-400 font-medium">Your email and current plan information.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Email change column */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-405">Email address</span>
            {isChangingEmail ? (
              <form onSubmit={handleSaveEmail} className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-indigo-300 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white text-slate-850"
                  required
                />
                <button
                  type="submit"
                  className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingEmail(false)}
                  className="px-3 bg-slate-105 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between px-3.5 py-3 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-700 font-semibold">
                <span className="truncate">{currentEmail}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmailInput(currentEmail);
                    setIsChangingEmail(true);
                  }}
                  className="text-xs font-extrabold text-blue-600 hover:text-blue-850 cursor-pointer ml-2 shrink-0"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Current plan column */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-405">Current plan</span>
            <div className="flex items-center justify-between px-3.5 py-[11px] bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-705 font-bold">
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-mono uppercase tracking-wider rounded font-extrabold">
                {currentPlan}
              </span>
              <button
                type="button"
                onClick={() => onNavigateToTab("pricing")}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-805 cursor-pointer"
              >
                View plans
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subscription Control Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-650 border border-indigo-100 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-800 tracking-wide">Subscription</h3>
        </div>
        
        <p className="text-xs text-slate-450 leading-relaxed">
          Manage your subscription, add extra profiles, or cancel anytime.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => handleStripeAction("Manage Subscription")}
            className="px-4 py-2.5 bg-indigo-630 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Manage Subscription
          </button>
          
          <button
            onClick={() => onNavigateToTab("pricing")}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Change Plan
          </button>

          <button
            onClick={() => onNavigateToTab("users")}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            Manage Extra Profiles
          </button>

          <button
            onClick={() => {
              onAddToast("Subscription cancel wizard scheduled. Loading status...");
              handleStripeAction("Cancel Subscription");
            }}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-650 text-xs font-extrabold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-stone-400 hover:text-rose-500" />
            Cancel Subscription
          </button>
        </div>

        <p className="text-[11px] text-slate-450 pt-1">
          Want to unlock more features? Check out our{" "}
          <button onClick={() => onNavigateToTab("pricing")} className="text-indigo-600 font-bold hover:underline">
            pricing plans
          </button>.
        </p>
      </div>

      {/* 6. Leave a review */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
            <Star className="w-5 h-5 fill-amber-400 text-amber-405" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">Leave a review</h3>
            <p className="text-xs text-slate-450">
              Share your experience and help us improve upload-post.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            onAddToast("Interactive review form prompted! Slide down on Docs to review.");
            onNavigateToTab("docs");
          }}
          className="w-full md:w-auto px-5 py-2.5 bg-indigo-630 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          Leave a review
        </button>
      </div>

      {/* 7. Sign out */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0 border border-rose-100">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">Sign out</h3>
            <p className="text-xs text-slate-450">
              End your session on this device.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            onLogout();
          }}
          className="w-full md:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 hover:border-rose-300 text-xs font-black rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:scale-103 shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>

      {/* 8. Danger zone */}
      <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-850">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-black uppercase tracking-wide font-mono">Danger zone</h3>
        </div>
        <p className="text-xs text-slate-500 font-semibold">Irreversible actions affecting your entire account.</p>

        <div className="bg-white border border-rose-100 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase">Delete my account</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Your data will be kept for 30 days in case you change your mind. After that, personal information is permanently removed. You will also be unsubscribed from all our emails.
            </p>
          </div>
          {showDeleteConfirm ? (
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-[10px] text-rose-700 font-bold block text-center">Are you absolutely sure?</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Yes, Delete!
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  No,Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full md:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition-colors uppercase tracking-wider cursor-pointer"
            >
              Delete account
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
