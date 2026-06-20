import React from "react";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle } from "lucide-react";

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight font-sans">
              Privacy Policy & Disclosures
            </h1>
            <p className="text-xs text-slate-400 font-bold font-mono uppercase tracking-wider mt-0.5">
              Effective Date: June 19, 2026
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          At OmniCast, we construct modern software solutions ensuring that your privacy profile is guarded with complete integrity. This policy clarifies exactly what records are used, stored, or transited during standard dispatch activity.
        </p>

        <hr className="border-slate-100" />

        <div className="space-y-5">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-600 text-[10px]">01 //</span> Information Collection & Authorization Handshakes
            </h3>
            <p className="text-xs text-slate-550 leading-relaxed font-semibold pl-5">
              For account administration, your email addresses and password credentials are securely managed and persisted by standard <strong>Google Firebase Services</strong>. During cross-posting set steps, OAuth tokens issued directly by target platforms (TikTok, YouTube, Instagram, Facebook) are securely cached in client-side memory blocks.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-600 text-[10px]">02 //</span> Asset Security & Media Records Transit Routing
            </h3>
            <p className="text-xs text-slate-555 leading-relaxed font-semibold pl-5">
              Media files (such as MP4 video sequences) uploaded by creators are utilized solely for formatting and routing to client-authorized API channels. OmniCast maintains a strict zero-retention strategy: once files successfully reach your destination profiles, they are purged from temporary transit lines.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-600 text-[10px]">03 //</span> Analytical Telemetry & Third-Party Auditing
            </h3>
            <p className="text-xs text-slate-555 leading-relaxed font-semibold pl-5">
              We collect anonymous system metadata (e.g., aggregate dispatch success rates, API error rates) to calibrate server capacity rules. We strictly forbid selling, licensing, or leasing your workspace configurations or personal uploads to third-party ad brokers.
            </p>
          </div>

          {/* Core Guarantees Box */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              OmniCast Trusted Shield Parameters
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="flex gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-580 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-800">Double SSL Handshake</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">All transit pathways are cryptographically safe</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs font-semibold text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-580 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-800">Zero Retention Policy</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Temporary assets are fully purged from buffer streams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
