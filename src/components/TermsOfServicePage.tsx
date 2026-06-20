import React from "react";
import { ArrowLeft, BookOpen, AlertCircle, ShieldAlert, CheckSquare } from "lucide-react";

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm max-w-4xl mx-auto text-left animate-scale-up">
      {/* Brand Back header */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-205 text-slate-700 text-xs font-bold rounded-xl transition-all mb-8 cursor-pointer active:scale-95 select-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Application</span>
      </button>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-650 rounded-2xl border border-indigo-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight font-sans">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400 font-bold font-mono uppercase tracking-wider mt-0.5">
              Effective Date: June 19, 2026
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          These Terms of Service outline the legal rules and proper parameters governing your use of the OmniCast cross-posting desk dashboard. Read each section prior to deploying API connections.
        </p>

        <hr className="border-slate-100" />

        <div className="space-y-5">
          {/* Article 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-600 text-[10px]">ARTICLE I //</span> Account Integrity & Verification Safeguards
            </h3>
            <p className="text-xs text-slate-555 leading-relaxed font-semibold pl-5">
              Creator accounts on OmniCast must correspond to genuine emails or social identity handles. Maintaining active credential safety, safeguard secrets blocks, and preventing split or duplicate account fraud rests purely on your administration.
            </p>
          </div>

          {/* Article 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-600 text-[10px]">ARTICLE II //</span> Dispatch Volume Guidelines & Anti-Abuse
            </h3>
            <p className="text-xs text-slate-555 leading-relaxed font-semibold pl-5">
              Our automated cross-platform APIs are subject to system rate-limits. Flooding social channels with repetitive, duplicated, copyrighted, or malicious sequences is strictly forbidden. OmniCast holds absolute power to instantly terminate tokens in violation.
            </p>
          </div>

          {/* Article 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-600 text-[10px]">ARTICLE III //</span> Third-Party Social Network Compliance
            </h3>
            <p className="text-xs text-slate-555 leading-relaxed font-semibold pl-15">
              By distributing videos, you swear full alignment with <em>Official Developer Guidelines</em> for Google YouTube Shorts, ByteDance TikTok API, and Meta Instagram/Facebook services platforms. If a social channel revokes access due to account misconduct, OmniCast is not liable.
            </p>
          </div>

          {/* Special Disclaimer banner */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-xs font-semibold text-slate-700">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-slate-800">API Limitations and Warranties</p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium leading-relaxed">
                OmniCast tools are provided "as-is" without hidden guarantees regarding platform distribution success rates. Social systems constantly update: we adjust handshakes proactively, but do not warrant complete uptime for unannounced endpoint suspensions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
