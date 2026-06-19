import React from "react";
import { 
  MessageSquare, 
  Mail, 
  FileText, 
  Check, 
  Sparkles, 
  Clock, 
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface HelpCenterViewProps {
  onAddToast: (msg: string) => void;
  onNavigateToDocs: () => void;
}

export function HelpCenterView({ onAddToast, onNavigateToDocs }: HelpCenterViewProps) {
  return (
    <div id="help-center-panel" className="max-w-3xl mx-auto py-8 px-4 animate-fade-in text-slate-900 space-y-8">
      
      {/* Support Header section matching image */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-sans">
          Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How can we help?
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-semibold">
          We're here to help you with any questions or issues. Chat with our AI assistant, reach out via email, or check our docs.
        </p>
      </div>

      {/* Main Blocks Column */}
      <div className="space-y-6">
        
        {/* Block 1: Chat with our AI assistant */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all space-y-4">
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0 self-start">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-850">
                Chat with our AI assistant
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Get instant answers about the API, integrations, and features. Available 24/7 in our docs.
              </p>
            </div>
          </div>

          <div className="pl-0 sm:pl-14">
            <button
              type="button"
              onClick={() => {
                onAddToast("Opening AI chat client...");
                onNavigateToDocs();
              }}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-heavy text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all shadow-3xs active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Open AI chat at docs.omni-cast.online</span>
            </button>

            <div className="flex items-center gap-2 mt-3.5 text-[11px] font-bold text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-505" />
              <span>Instant answers, no waiting</span>
            </div>
          </div>
        </div>

        {/* Block 2: Contact us by email */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all space-y-4">
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0 self-start">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-850">
                Contact us by email
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                For more complex issues, drop us a line and we'll get back to you.
              </p>
            </div>
          </div>

          <div className="pl-0 sm:pl-14">
            <a
              href="mailto:info@omni-cast.online"
              onClick={() => onAddToast("Initializing mail composer...")}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-heavy text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all shadow-3xs active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>info@omni-cast.online</span>
            </a>

            <div className="flex items-center gap-2 mt-3.5 text-[11px] font-bold text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>We typically respond within 24–48 hours</span>
            </div>
          </div>
        </div>

        {/* Block 3: Before contacting us */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-all space-y-5">
          <div className="flex gap-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0 self-start">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-850">
                Before contacting us
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                A few quick checks that often resolve issues faster than waiting for a reply.
              </p>
            </div>
          </div>

          {/* Checklist with Green Checks */}
          <div className="pl-0 sm:pl-14 space-y-3 pt-1">
            <div className="flex items-start gap-3 text-xs text-slate-700 font-semibold">
              <div className="p-0.5 bg-emerald-50 text-emerald-605 rounded shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </div>
              <span>
                Check our <button type="button" onClick={onNavigateToDocs} className="text-indigo-600 font-bold hover:underline">documentation</button> for guides and API reference
              </span>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700 font-semibold">
              <div className="p-0.5 bg-emerald-50 text-emerald-650 rounded shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </div>
              <span>Include relevant details about your issue (steps, expected vs actual)</span>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700 font-semibold">
              <div className="p-0.5 bg-emerald-50 text-emerald-650 rounded shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </div>
              <span>Attach screenshots or logs if applicable</span>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-700 font-semibold">
              <div className="p-0.5 bg-emerald-50 text-emerald-650 rounded shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3.5]" />
              </div>
              <span>Include your account email address</span>
            </div>

            {/* Divider Line */}
            <div className="pt-2 border-t border-slate-100"></div>

            {/* Bottom Button */}
            <button
              type="button"
              onClick={onNavigateToDocs}
              className="px-4 py-2 border border-slate-205 hover:border-indigo-150 bg-white hover:bg-slate-50 text-indigo-650 font-extrabold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all shadow-3xs"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-505" />
              <span>Visit documentation</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
