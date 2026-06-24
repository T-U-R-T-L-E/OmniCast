import React, { useState, useEffect } from "react";
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle, 
  HelpCircle, 
  ShieldAlert, 
  Clock, 
  Unlock, 
  Sparkles,
  Database,
  Calendar,
  X
} from "lucide-react";
import { ApiKey } from "../types";
import { safeStorage } from "../lib/safeStorage";

interface ApiKeyManagementProps {
  onAddToast: (msg: string) => void;
  apiKeys?: ApiKey[];
  onSaveKey?: (key: ApiKey) => void;
  onRevokeKey?: (id: string) => void;
}

export function ApiKeyManagement({ 
  onAddToast,
  apiKeys: externalKeys,
  onSaveKey,
  onRevokeKey
}: ApiKeyManagementProps) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load from local storage or external firebase on mount
  useEffect(() => {
    if (externalKeys && externalKeys.length > 0) {
      setKeys(externalKeys);
    } else {
      const saved = safeStorage.getItem("uploadpost_api_keys");
      if (saved) {
        try {
          setKeys(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse API keys", e);
        }
      } else {
        // Leave initially empty or seed one default key for perfect onboarding
        setKeys([]);
      }
    }
  }, [externalKeys]);

  const syncKeys = (updated: ApiKey[]) => {
    setKeys(updated);
    safeStorage.setItem("uploadpost_api_keys", JSON.stringify(updated));
    
    // Update onboarding state if keys exist
    if (updated.length > 0) {
      safeStorage.setItem("onboarding_api_key", updated[0].key);
      safeStorage.setItem("onboarding_api_key_generated", "true");
    } else {
      safeStorage.removeItem("onboarding_api_key");
      safeStorage.removeItem("onboarding_api_key_generated");
    }
  };

  const generateRandomKey = () => {
    const randomHex = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    return `up_live_${randomHex}`;
  };

  const handleCreateKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newKeyName.trim() || `Default Production Token`;
    
    const newKeyStr = generateRandomKey();
    const newKey: ApiKey = {
      id: `key_${Math.random().toString(36).substr(2, 9)}`,
      name,
      key: newKeyStr,
      createdAt: new Date().toLocaleDateString(),
      lastUsed: "Never",
      status: "active"
    };

    const updated = [newKey, ...keys];
    syncKeys(updated);
    if (onSaveKey) onSaveKey(newKey);

    setNewKeyName("");
    setIsCreateModalOpen(false);
    onAddToast(`API Key "${name}" generated successfully!`);
  };

  const handleRevoke = (id: string, name: string) => {
    const updated = keys.filter(k => k.id !== id);
    syncKeys(updated);
    if (onRevokeKey) onRevokeKey(id);
    onAddToast(`API Key "${name}" was securely revoked.`);
  };

  const handleCopy = (id: string, fullKey: string) => {
    navigator.clipboard.writeText(fullKey);
    setCopiedId(id);
    onAddToast("API key copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="api-keys-management-panel" className="max-w-4xl mx-auto space-y-6 py-2 animate-fade-in">
      
      {/* Upper header segment */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          API Key Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
          Generate and manage API keys to authenticate requests against the Omni-Cast API. Keep them secret — anyone with a key can post on your behalf.
        </p>
      </div>

      {/* Main card box widget */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Card header bar */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/25">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Your API keys</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Manage your authentication credentials.</p>
          </div>
          
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Key</span>
          </button>
        </div>

        {/* Card body container with list or empty state */}
        <div className="p-6">
          {keys.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 py-12 flex flex-col items-center justify-center text-center space-y-5 bg-slate-50/25">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-3xs animate-pulse">
                <Key className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 max-w-sm">
                <h4 className="text-sm font-extrabold text-slate-800">No API keys yet</h4>
                <p className="text-xs text-slate-450 leading-relaxed font-medium">
                  Create a key to start integrating with the API.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewKeyName("Master Integration Token");
                  handleCreateKey();
                }}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm active:scale-95"
              >
                Generate first key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Alert notice emphasizing key secrecy */}
              <div className="bg-rose-50 border border-rose-100/90 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-rose-500 fill-rose-50 mr-0.5 mt-0.5 shrink-0" />
                <p className="text-[11px] font-semibold text-rose-800 leading-relaxed">
                  <strong>Security Alert:</strong> Do not share API tokens in client-side widgets, forums, or commit them to public version control. Anyone who obtains these hex keys can programmatic trigger publishing campaigns.
                </p>
              </div>

              {/* Robust Table listing API Keys */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-3xs bg-white">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-4">Key Token</div>
                  <div className="col-span-2">Created</div>
                  <div className="col-span-2">Last Used</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="divide-y divide-slate-150">
                  {keys.map((k) => (
                    <div key={k.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 text-xs">
                      
                      {/* Name segment */}
                      <div className="col-span-1 md:col-span-3 font-extrabold text-slate-800 flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{k.name}</span>
                      </div>

                      {/* Secret token value */}
                      <div className="col-span-1 md:col-span-4 font-mono text-[10.5px] bg-slate-50 border border-slate-100 p-1.5 px-2.5 rounded-lg flex items-center justify-between overflow-hidden">
                        <span className="truncate text-slate-600 mr-2 select-all font-bold">
                          {k.key.substr(0, 10)}••••••••••••{k.key.substr(-4)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(k.id, k.key)}
                          className="p-1 hover:text-indigo-600 hover:bg-white text-slate-400 border border-transparent hover:border-slate-200 rounded transition-all cursor-pointer bg-transparent"
                          title="Copy key"
                        >
                          {copiedId === k.id ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-550" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Created date */}
                      <div className="col-span-1 md:col-span-2 text-slate-500 font-medium flex items-center gap-1">
                        <span className="md:hidden font-bold uppercase text-[9px] text-slate-400 mr-1.5">Created:</span>
                        <span>{k.createdAt}</span>
                      </div>

                      {/* Last used stamp */}
                      <div className="col-span-1 md:col-span-2 text-slate-500 font-medium flex items-center gap-1">
                        <span className="md:hidden font-bold uppercase text-[9px] text-slate-400 mr-1.5">Last Used:</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] rounded text-slate-500 font-semibold">{k.lastUsed}</span>
                      </div>

                      {/* Revocation trigger */}
                      <div className="col-span-1 md:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRevoke(k.id, k.name)}
                          className="p-1 px-2.5 text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-lg cursor-pointer transition-all text-[11px] font-bold inline-flex items-center gap-1"
                          title="Revoke and delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="md:hidden">Revoke</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Pop up create modal overlay */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-3xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Create API Token</span>
              </h4>
              <button 
                type="button" 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Token Label / Description</label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Webhook Server"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-250 rounded-xl focus:outline-hidden focus:border-indigo-500 text-slate-800 placeholder:text-slate-400 font-semibold"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-550 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
