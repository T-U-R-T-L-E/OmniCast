import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Bell, 
  Send, 
  Webhook, 
  Check, 
  Loader2, 
  Save, 
  AlertCircle,
  Play,
  Terminal,
  Clock
} from "lucide-react";

interface NotificationsPageProps {
  onBack: () => void;
  onSave?: () => void;
}

export function NotificationsPage({ onBack, onSave }: NotificationsPageProps) {
  // Load preferences from localStorage for immediate offline persistence
  const [telegramEnabled, setTelegramEnabled] = useState<boolean>(() => {
    return localStorage.getItem("omnicast_notif_telegram") === "true";
  });
  const [webhookEnabled, setWebhookEnabled] = useState<boolean>(() => {
    return localStorage.getItem("omnicast_notif_webhook") === "true";
  });
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem("omnicast_notif_webhook_url") || "https://api.myplatform.com/webhooks/omnicast";
  });
  const [telegramUsername, setTelegramUsername] = useState<string>(() => {
    return localStorage.getItem("omnicast_notif_telegram_user") || "";
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showTestPayload, setShowTestPayload] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<any | null>(null);

  // Auto-clear success state after a few seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate slight API buffer for tactile premium responsiveness
    setTimeout(() => {
      localStorage.setItem("omnicast_notif_telegram", telegramEnabled ? "true" : "false");
      localStorage.setItem("omnicast_notif_webhook", webhookEnabled ? "true" : "false");
      localStorage.setItem("omnicast_notif_webhook_url", webhookUrl);
      localStorage.setItem("omnicast_notif_telegram_user", telegramUsername);
      setIsSaving(false);
      setSaveSuccess(true);
      if (onSave) onSave();
    }, 700);
  };

  const handleSendTestPayload = () => {
    setIsTesting(true);
    setTestResponse(null);
    setShowTestPayload(true);

    // Simulate sending actual structured web hook alert webhook
    setTimeout(() => {
      setIsTesting(false);
      setTestResponse({
        status: 200,
        statusText: "OK",
        timestamp: new Date().toISOString(),
        payload_delivered: {
          event: "clip.published_successfully",
          provider: "OmniCast Central Dispatch",
          user: "lewisiraki1@gmail.com",
          channels_broadcasted: ["TikTok", "Instagram Reels", "YouTube Shorts"],
          metadata: {
            title: "Exploring Vector Databases with Gemini 1.5 Pro",
            duration_seconds: 45,
            video_resolution: "1080x1920",
            total_file_size_bytes: 8431055,
            analytics_tracking_id: "analytics_tr_83109a"
          }
        }
      });
    }, 900);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header breadcrumb bar */}
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-time dispatch system active</span>
        </div>
      </div>

      {/* Main Page Title Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
          Configure where to receive alerts after each upload, account event, or webhook trigger. Test your setup before going live.
        </p>
      </div>

      {/* Delivery Channels Core Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-6 shadow-xs relative overflow-hidden">
        <div>
          <h3 className="text-base font-bold text-slate-900">Delivery channels</h3>
          <p className="text-xs text-slate-400 mt-1">Pick the destinations that should receive your notifications.</p>
        </div>

        {/* Channels Grid Options matching high-fidelity UI exactly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Channel 1: Telegram */}
          <div className={`border rounded-xl p-4 flex items-start gap-3.5 transition-all bg-slate-50/20 ${telegramEnabled ? "border-indigo-200 ring-2 ring-indigo-50/30" : "border-slate-200 hover:border-slate-305"}`}>
            {/* Toggle switch on left (exact match to screenshot description layout) */}
            <div className="pt-1 shrink-0">
              <button
                type="button"
                onClick={() => setTelegramEnabled(!telegramEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${telegramEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                title="Toggle Telegram Alerts"
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${telegramEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Icon + Label Description Details */}
            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 fill-[#0369A1] stroke-[1]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-sans leading-none">Telegram</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Receive a chat message after each upload.</p>
                </div>
              </div>

              {/* Collapsible details for Telegram channel */}
              {telegramEnabled && (
                <div className="pt-2 animate-scale-up">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Telegram Bot Username / Chat ID</label>
                  <input
                    type="text"
                    placeholder="@omnicast_dispatch_bot or enter chat identifier"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-400 rounded-lg text-[11px] font-semibold text-slate-800 transition-all focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-[#0369A1] font-semibold">
                    <AlertCircle className="w-3 h-3 text-[#0284C7]" />
                    <span>Send /start to the official OmniCast Telegram Bot first to pair.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Channel 2: Webhooks */}
          <div className={`border rounded-xl p-4 flex items-start gap-3.5 transition-all bg-slate-50/20 ${webhookEnabled ? "border-indigo-200 ring-2 ring-indigo-50/30" : "border-slate-200 hover:border-slate-305"}`}>
            {/* Toggle switch on left (exact match to screenshot description layout) */}
            <div className="pt-1 shrink-0">
              <button
                type="button"
                onClick={() => setWebhookEnabled(!webhookEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${webhookEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                title="Toggle Webhook Alerts"
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${webhookEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Icon + Label Description Details */}
            <div className="flex-1 space-y-2.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Webhook className="w-4 h-4 text-[#4F46E5] stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 font-sans leading-none">Webhook</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">POST event payloads to your own endpoint.</p>
                </div>
              </div>

              {/* Collapsible details for Webhook custom target */}
              {webhookEnabled && (
                <div className="pt-2 space-y-2 animate-scale-up">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Webhook Handler URL</label>
                    <input
                      type="url"
                      placeholder="https://api.domain.com/callbacks/omnicast"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-400 rounded-lg text-[11px] font-mono text-slate-800 transition-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Save preferences block container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-left">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-850">Save your preferences</h3>
          <p className="text-xs text-slate-404">Save first to test with your latest changes.</p>
        </div>

        <div className="flex items-center gap-3 justify-end">
          {/* Send test payload triggers live log sandbox */}
          <button
            type="button"
            onClick={handleSendTestPayload}
            disabled={!telegramEnabled && !webhookEnabled}
            className="px-4 py-2 text-xs font-bold border border-slate-200 hover:border-indigo-100 hover:text-indigo-600 hover:bg-indigo-50/25 rounded-xl transition-all text-slate-600 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span>Send test</span>
          </button>

          {/* Solid Save Preference trigger */}
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save preferences</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test delivery live stream terminal simulation (premium addition) */}
      {showTestPayload && (
        <div className="bg-slate-900 text-slate-100 border border-slate-850 rounded-2xl p-5 space-y-3 shadow-md animate-scale-up">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4 animate-pulse text-indigo-400" />
              <span>Simulated Payload Transmitter console</span>
            </div>
            <button
              type="button"
              onClick={() => setShowTestPayload(false)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

          {isTesting ? (
            <div className="p-8 text-center text-xs text-slate-400 font-mono space-y-2.5">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
              <p>Resolving host target, dispatching JSON telemetry payload...</p>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded font-bold">HTTP {testResponse?.status} {testResponse?.statusText}</span>
                <span className="text-slate-400">Target: {webhookEnabled ? webhookUrl : "Internal Telemetry Stream"}</span>
                {telegramEnabled && <span className="text-sky-300">✓ Sent message to Telegram {telegramUsername}</span>}
              </div>

              <div className="bg-slate-950/75 p-4 rounded-xl border border-slate-850 overflow-x-auto text-left max-h-72">
                <pre className="text-[11px] text-green-300 leading-normal font-sans">
                  {JSON.stringify(testResponse?.payload_delivered, null, 2)}
                </pre>
              </div>

              <div className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                This mock test verifies endpoint routing and JSON serializations. When live, our production engine delivers payloads using signed headers containing cryptographically secure webhook tokens checkable inside your API Keys dashboard.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
