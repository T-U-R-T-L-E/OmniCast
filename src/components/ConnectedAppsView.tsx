import React, { useState } from "react";
import { Plug, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

interface ConnectedAppsProps {
  onAddToast: (msg: string) => void;
  onBackToProfile?: () => void;
  onBackToApiKeys?: () => void;
}

interface ExternalApp {
  id: string;
  name: string;
  connectedAt: string;
  scopes: string[];
}

export function ConnectedAppsView({ onAddToast, onBackToProfile, onBackToApiKeys }: ConnectedAppsProps) {
  const [apps, setApps] = useState<ExternalApp[]>([]);

  const handleSimulateConnection = () => {
    const newApp: ExternalApp = {
      id: String(Date.now()),
      name: "Claude.ai Custom Connector",
      connectedAt: new Date().toLocaleDateString(),
      scopes: ["Read Campaigns", "Generate API Keys"]
    };
    setApps([newApp]);
    onAddToast("Simulated Claude.ai MCP Custom Connector authorization successful!");
  };

  const handleRevoke = (id: string, name: string) => {
    setApps(apps.filter(app => app.id !== id));
    onAddToast(`Revoked connection for ${name}. Access terminated.`);
  };

  return (
    <div id="connected-apps-view" className="max-w-4xl mx-auto space-y-6 pt-2 pb-12 animate-fade-in text-left">
      <div className="flex items-center justify-between">
        {onBackToProfile ? (
          <button 
            onClick={onBackToProfile}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </button>
        ) : onBackToApiKeys ? (
          <button 
            onClick={onBackToApiKeys}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to API Keys
          </button>
        ) : null}

        <button
          onClick={handleSimulateConnection}
          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Connect Mock MCP Agent
        </button>
      </div>

      {/* Title & Description Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Connected Apps
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-3xl">
          External apps connected to your <span className="font-semibold text-slate-800">Upload-Post</span> account via OAuth (claude.ai Custom Connectors, ChatGPT, etc.). Revoke any to immediately cut off access — they'll need re-authorization to come back.
        </p>
      </div>

      {apps.length === 0 ? (
        /* Empty State Card */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-500">
            <Plug className="w-6 h-6 rotate-90" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-black text-slate-800 tracking-wide">
              No connected apps yet
            </h3>
            <p className="text-xs text-slate-455 font-semibold leading-relaxed">
              Add Upload-Post as a Custom Connector inside <span className="text-indigo-600 font-extrabold">claude.ai</span> or another MCP-compatible AI agent — you'll see it listed here once authorized.
            </p>
          </div>
        </div>
      ) : (
        /* Connected App List */
        <div className="space-y-3">
          {apps.map(app => (
            <div key={app.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                    <Plug className="w-4 h-4 rotate-45" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-850">{app.name}</h3>
                    <p className="text-[10px] text-slate-400">Authorized on {app.connectedAt}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {app.scopes.map(scope => (
                    <span key={scope} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleRevoke(app.id, app.name)}
                className="w-full sm:w-auto px-4 py-2 bg-rose-55 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Revoke Access
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
