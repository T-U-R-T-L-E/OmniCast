import React from "react";
import { FileText, ArrowLeft, ExternalLink, Receipt } from "lucide-react";

interface BillingInvoicesProps {
  onAddToast: (msg: string) => void;
  onBackToProfile?: () => void;
}

export function BillingInvoicesView({ onAddToast, onBackToProfile }: BillingInvoicesProps) {
  const handleStripePortal = () => {
    onAddToast("Redirecting to the secure Stripe billing & payment management portal...");
  };

  return (
    <div id="billing-invoices-view" className="max-w-4xl mx-auto space-y-6 pt-2 pb-12 animate-fade-in text-left">
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Invoices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
          Legally valid invoices issued for your <span className="font-extrabold text-slate-700">Upload-Post</span> subscription. Click <span className="font-extrabold text-slate-705">View</span> to open the invoice or <span className="font-extrabold text-slate-705">Download</span> for the PDF.
        </p>
      </div>

      {/* Main Empty State Invoices Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-sm font-black text-slate-800 tracking-wide">
            No invoices yet
          </h3>
          <p className="text-xs text-slate-455 font-semibold leading-relaxed">
            Invoices appear here after your first paid subscription cycle. If you just subscribed, it can take a few minutes to show up.
          </p>
        </div>
      </div>

      {/* Subtext info panel */}
      <p className="text-xs text-slate-405 leading-relaxed font-semibold">
        These are the legally valid invoices issued by our billing system. For payment method, billing address or subscription changes, use the{" "}
        <button 
          onClick={handleStripePortal} 
          className="text-blue-600 font-bold underline hover:text-blue-805"
        >
          payment management portal
        </button>{" "}
        on your profile.
      </p>
    </div>
  );
}
