import React from "react";
import { Users, ArrowLeft, Send, Sparkles } from "lucide-react";

interface TeamManagementProps {
  onAddToast: (msg: string) => void;
  onNavigateToPricing: () => void;
  onBackToProfile?: () => void;
}

export function TeamManagementView({ 
  onAddToast, 
  onNavigateToPricing,
  onBackToProfile 
}: TeamManagementProps) {
  return (
    <div id="team-management-view" className="max-w-6xl mx-auto space-y-6 pt-2 pb-12 animate-fade-in text-left">
      {onBackToProfile && (
        <button 
          onClick={onBackToProfile}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to profile
        </button>
      )}

      {/* Title & Description Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Users className="w-4.5 h-4.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team Management
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
          Collaborate by inviting members to your account or manage accounts shared with you.
        </p>
      </div>

      {/* Main Grid Layout for columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Invite Team Members */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 tracking-wide flex items-center gap-2">
                Invite Team Members
              </h3>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-505 text-[10px] font-mono tracking-wider font-extrabold rounded-md border border-slate-205">
                0 / 0 Used
              </span>
            </div>

            {/* Upgrade banner design */}
            <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] space-y-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-indigo-50 flex items-center justify-center text-indigo-500">
                <Users className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide">
                  Upgrade to Collaborate
                </h4>
                <p className="text-[11px] text-indigo-900/60 leading-relaxed font-semibold">
                  Team collaboration is available on Professional plans and above. Invite colleagues to manage your social media together.
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToPricing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                View Plans & Upgrade
              </button>
            </div>
          </div>

          {/* Current members subheading box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-405 border-b border-slate-50 pb-2">
              Current Members
            </h4>
            <div className="border border-slate-100 bg-slate-50/20 p-6 rounded-xl text-center flex flex-col items-center justify-center space-y-2">
              <Users className="w-5 h-5 text-slate-350" />
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-slate-700">No team members invited yet</h5>
                <p className="text-[10px] text-slate-400 font-semibold">Invitations you send will appear here.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shared With Me */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 min-h-[464px]">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">
              Shared With Me
            </h3>
            <p className="text-xs text-slate-455">
              Accounts you've been invited to manage.
            </p>
          </div>

          <div className="border border-slate-100 bg-slate-50/20 rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] space-y-3">
            <div className="w-11 h-11 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center text-slate-300">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 max-w-sm">
              <h4 className="text-xs font-bold text-slate-800">No shared accounts</h4>
              <p className="text-[11px] text-slate-405 leading-relaxed font-semibold">
                When someone invites you, it will appear here.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
