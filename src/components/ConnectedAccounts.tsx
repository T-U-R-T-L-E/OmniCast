import React, { useState } from "react";
import { ConnectedAccount } from "../types";
import { Link2, Link2Off, RefreshCw, CheckCircle2, AlertCircle, Plus, ExternalLink, Info } from "lucide-react";
import { PlatformLinkModal } from "./PlatformLinkModal";

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
  onToggleConnect: (platformId: string) => void;
  onUpdateUsername: (platformId: string, username: string) => void;
  onRevokeOAuth?: (platform: string, platformId: string) => Promise<void>;
  onCompleteAccountLink?: (platformId: string, username: string, token?: string, avatarUrl?: string) => void;
}

export const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({
  accounts,
  onToggleConnect,
  onUpdateUsername,
  onRevokeOAuth,
  onCompleteAccountLink,
}) => {
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState("");
  const [revokingPlatforms, setRevokingPlatforms] = useState<Record<string, boolean>>({});
  const [linkingPlatform, setLinkingPlatform] = useState<ConnectedAccount | null>(null);

  const handleRevokeClick = async (platform: string, id: string) => {
    setRevokingPlatforms((prev) => ({ ...prev, [id]: true }));
    try {
      if (onRevokeOAuth) {
        await onRevokeOAuth(platform, id);
      } else {
        await new Promise((r) => setTimeout(r, 805));
        onToggleConnect(id);
      }
    } catch (err) {
      console.error("Revoke error:", err);
    } finally {
      setRevokingPlatforms((prev) => ({ ...prev, [id]: false }));
    }
  };

  const getPlatformColors = (platform: string) => {
    switch (platform) {
      case "tiktok":
        return {
          bg: "border-slate-800 bg-black/60",
          accent: "text-rose-500",
          badge: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
          brandColor: "bg-gradient-to-r from-teal-400 via-rose-500 to-black",
          text: "TikTok Reels",
        };
      case "instagram":
        return {
          bg: "border-slate-800 bg-slate-950/60",
          accent: "text-purple-500",
          badge: "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20",
          brandColor: "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400",
          text: "Instagram Reels",
        };
      case "facebook":
        return {
          bg: "border-slate-800 bg-slate-950/60",
          accent: "text-blue-500",
          badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
          brandColor: "bg-blue-600",
          text: "Facebook Reels",
        };
      case "youtube_shorts":
        return {
          bg: "border-slate-800 bg-slate-950/60",
          accent: "text-red-500",
          badge: "bg-red-500/10 text-red-400 border border-red-500/20",
          brandColor: "bg-red-600",
          text: "YouTube Shorts",
        };
      default:
        return {
          bg: "border-slate-800 bg-slate-950/60",
          accent: "text-slate-500",
          badge: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
          brandColor: "bg-slate-600",
          text: "Platform",
        };
    }
  };

  const startEdit = (id: string, initialUsername: string) => {
    setEditingPlatform(id);
    setTempUsername(initialUsername);
  };

  const saveUsername = (id: string) => {
    onUpdateUsername(id, tempUsername.trim() || "@user");
    setEditingPlatform(null);
  };

  return (
    <div id="accounts-connector" className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-600" />
            Social Platform Manager
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Toggle connections and edit credentials</p>
        </div>
        <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-full">
          API Integration Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accounts.map((acc) => {
          const config = getPlatformColors(acc.platform);
          return (
            <div
              key={acc.id}
              id={`account-card-${acc.platform}`}
              className={`p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                acc.connected
                  ? "border-slate-200 bg-white shadow-xs"
                  : "border-slate-100 bg-slate-50/50 opacity-70"
              }`}
            >
              {/* Top brand accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${config.brandColor}`} />

              <div className="flex items-start justify-between mt-1">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {acc.avatarUrl ? (
                      <img
                        src={acc.avatarUrl}
                        alt={acc.username || acc.platform}
                        className={`w-10 h-10 rounded-full object-cover border-2 p-0.5 ${
                          acc.connected ? "border-emerald-500" : "border-slate-250"
                        }`}
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs border-2 uppercase bg-slate-100 text-slate-600 ${
                        acc.connected ? "border-emerald-500" : "border-slate-250"
                      }`}>
                        {acc.platform.substring(0, 2)}
                      </div>
                    )}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        acc.connected ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-slate-800">{config.text}</p>
                      {acc.connected ? (
                        <span className="text-[9px] font-sans px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                          Active
                        </span>
                      ) : (
                        <span className="text-[9px] font-sans px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-500">
                          Linked Off
                        </span>
                      )}
                    </div>

                    {editingPlatform === acc.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="text"
                          value={tempUsername}
                          onChange={(e) => setTempUsername(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-xs px-1.5 py-0.5 rounded text-slate-800 font-mono w-28 focus:outline-none focus:border-blue-500"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && saveUsername(acc.id)}
                        />
                        <button
                          onClick={() => saveUsername(acc.id)}
                          className="px-1 text-[10px] uppercase font-bold text-blue-600 hover:text-blue-800"
                        >
                          Ok
                        </button>
                      </div>
                    ) : (
                      <p
                        onClick={() => acc.connected && startEdit(acc.id, acc.username)}
                        className={`text-xs ml-0.5 font-mono cursor-pointer hover:underline mt-0.5 ${
                          acc.connected ? "text-slate-500 hover:text-slate-800" : "text-slate-400"
                        }`}
                        title="Click to edit handle"
                      >
                        {acc.username}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 items-end">
                  {acc.connected ? (
                    revokingPlatforms[acc.id] ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] text-rose-600 font-bold bg-rose-50/50 border border-rose-200 rounded-lg">
                        <RefreshCw className="w-3/12 max-w-[12px] h-3 animate-spin text-rose-500" />
                        <span>Revoking Token...</span>
                      </div>
                    ) : (
                      <button
                        id={`connect-toggle-${acc.id}`}
                        type="button"
                        onClick={() => handleRevokeClick(acc.platform, acc.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-extrabold tracking-wider bg-rose-50 hover:bg-rose-600 border border-rose-200 text-rose-600 hover:text-white rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer leading-none font-sans"
                        title="Disconnect connection and securely revoke OAuth access tokens"
                      >
                        <Link2Off className="w-3 h-3" />
                        <span>Disconnect</span>
                      </button>
                    )
                  ) : (
                    <button
                      id={`connect-toggle-${acc.id}`}
                      type="button"
                      onClick={() => setLinkingPlatform(acc)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-extrabold tracking-wider bg-blue-50 hover:bg-blue-600 border border-blue-200 text-blue-600 hover:text-white rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer leading-none font-sans"
                      title="Link and authorize account via OAuth protocol"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Link Account</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Developer Platform Integration Helper Section */}
      <div className="bg-slate-50/80 rounded-xl border border-slate-200/60 p-4 space-y-4">
        <div className="flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-indigo-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Developer Registration Directory & Next Steps</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Register an application on each developer portal to obtain the required client secrets and access tokens. Follow these direct links:
            </p>
          </div>
        </div>

        {/* Directory Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <a
            href="https://developers.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg text-slate-850 font-medium transition-all group"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Meta (FB & IG)
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
          </a>

          <a
            href="https://console.cloud.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-red-500 hover:bg-red-50/20 rounded-lg text-slate-850 font-medium transition-all group"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Google Cloud / YouTube
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
          </a>

          <a
            href="https://developers.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-slate-800 hover:bg-slate-50 rounded-lg text-slate-850 font-medium transition-all group"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              TikTok Developers
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800" />
          </a>
        </div>

        {/* Facebook & Instagram Specific Feedback */}
        <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase py-0.5 px-2 rounded bg-emerald-50 text-emerald-700 border border-emerald-250">
              Meta Use Cases Approved
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Facebook & Instagram Link</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            🎓 <strong>Meta Use Cases Verification:</strong> Your selection of **"Manage messaging & content on Instagram"** (Instagram Graph API) and **"Manage everything on your Page"** (Pages API) is **exactly correct** for cross-posting!
          </p>
          <div className="space-y-1.5 pt-1.5 border-t border-slate-100 text-[11px]">
            <p className="font-bold text-slate-800">To finalize Meta Dev configuration:</p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-500">
              <li>
                In your Meta developer portal, go to <strong>App Settings</strong> → <strong>Basic</strong>.
              </li>
              <li>
                Fill in the <strong>Privacy Policy URL</strong> and <strong>Terms of Service URL</strong> with your newly created live URLs:
                <div className="mt-1 flex flex-col gap-1 font-mono text-[10px] bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-slate-700">ToS: <a href="/terms" target="_blank" className="text-indigo-600 hover:underline">/terms</a></span>
                  <span className="text-slate-700">Privacy: <a href="/privacy" target="_blank" className="text-indigo-600 hover:underline">/privacy</a></span>
                </div>
              </li>
              <li>
                Toggle your Meta app status from **"In Development"** to **"Live"** at the top of the portal.
              </li>
              <li>
                Use the Meta <strong>Graph API Explorer</strong> or OAuth callback to gather long-lived tokens with <code>instagram_basic</code>, <code>instagram_content_publish</code>, <code>pages_manage_posts</code> and <code>pages_read_engagement</code> scopes.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {linkingPlatform && (
        <PlatformLinkModal
          isOpen={!!linkingPlatform}
          onClose={() => setLinkingPlatform(null)}
          platformId={linkingPlatform.id}
          platformName={linkingPlatform.platform}
          onCompleteLink={(id, username, token, avatarUrl) => {
            if (onCompleteAccountLink) {
              onCompleteAccountLink(id, username, token, avatarUrl);
            } else {
              onUpdateUsername(id, username);
              onToggleConnect(id);
            }
          }}
        />
      )}
    </div>
  );
};
