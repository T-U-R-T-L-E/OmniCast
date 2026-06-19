import React, { useState, useRef } from "react";
import { 
  Film, 
  UploadCloud, 
  Trash2, 
  Layers, 
  Play, 
  Check, 
  HelpCircle, 
  Sparkles, 
  Plus, 
  ArrowRight,
  FileVideo,
  FileImage,
  RefreshCw,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ConnectedAccount, MediaLibraryItem } from "../types";

interface MediaLibraryProps {
  accounts: ConnectedAccount[];
  attachments: Record<string, MediaLibraryItem>; // maps platform -> MediaLibraryItem
  onUpdateAttachments: (newAttachments: Record<string, MediaLibraryItem>) => void;
  libraryItems: MediaLibraryItem[];
  onAddLibraryItem: (item: MediaLibraryItem) => void;
  onRemoveLibraryItem: (id: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  accounts,
  attachments,
  onUpdateAttachments,
  libraryItems,
  onAddLibraryItem,
  onRemoveLibraryItem
}) => {
  const [isDraggingLibrary, setIsDraggingLibrary] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [hoveredDropZone, setHoveredDropZone] = useState<string | null>(null); // "youtube_shorts", "tiktok", "instagram", "facebook", "all"
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter only connected accounts
  const activeAccounts = accounts.filter(acc => acc.connected);

  // File drag handlers for adding files into the Media Library
  const handleDragOverLibrary = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLibrary(true);
  };

  const handleDragLeaveLibrary = () => {
    setIsDraggingLibrary(false);
  };

  const handleDropLibrary = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLibrary(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file: any) => {
        registerMediaFile(file);
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: any) => {
        registerMediaFile(file);
      });
    }
  };

  const registerMediaFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isVideo = ['mp4', 'mov', 'mkv', 'avi', 'wmv', 'webm', '3gp'].includes(ext);
    const isImage = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(ext);

    if (!isVideo && !isImage) {
      return;
    }

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch (e) {
      console.warn("URL creation failed", e);
    }

    const randomThumbs = [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=450"
    ];
    const chosenCover = isImage ? objectUrl : randomThumbs[Math.floor(Math.random() * randomThumbs.length)];

    const newItem: MediaLibraryItem = {
      id: `lib-user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: file.name,
      size: sizeStr,
      src: objectUrl,
      thumbnail: chosenCover,
      type: isImage ? 'image' : 'video',
      duration: isVideo ? 30 + Math.floor(Math.random() * 45) : undefined
    };

    onAddLibraryItem(newItem);
  };

  // Drag-and-drop orchestration internally within platform bays
  const handleDragStartItem = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEndItem = () => {
    setDraggedItemId(null);
    setHoveredDropZone(null);
  };

  const handleDragOverPlatformZone = (e: React.DragEvent, platformKey: string) => {
    e.preventDefault();
    setHoveredDropZone(platformKey);
  };

  const handleDragLeavePlatformZone = () => {
    setHoveredDropZone(null);
  };

  const handleDropOnPlatformZone = (e: React.DragEvent, platformKey: string) => {
    e.preventDefault();
    setHoveredDropZone(null);
    const itemId = e.dataTransfer.getData("text/plain") || draggedItemId;
    if (!itemId) return;

    const matchedItem = libraryItems.find(item => item.id === itemId);
    if (!matchedItem) return;

    if (platformKey === "all") {
      const updated = { ...attachments };
      activeAccounts.forEach(acc => {
        updated[acc.platform] = matchedItem;
      });
      onUpdateAttachments(updated);
    } else {
      onUpdateAttachments({
        ...attachments,
        [platformKey]: matchedItem
      });
    }
  };

  // Direct actions for button click triggers
  const handleAssignToPlatform = (itemId: string, platformKey: string) => {
    const matchedItem = libraryItems.find(item => item.id === itemId);
    if (!matchedItem) return;

    onUpdateAttachments({
      ...attachments,
      [platformKey]: matchedItem
    });
  };

  const handleQueueAll = (itemId: string) => {
    const matchedItem = libraryItems.find(item => item.id === itemId);
    if (!matchedItem) return;

    const updated = { ...attachments };
    activeAccounts.forEach(acc => {
      updated[acc.platform] = matchedItem;
    });
    onUpdateAttachments(updated);
  };

  const handleClearPlatformAttachment = (platformKey: string) => {
    const updated = { ...attachments };
    delete updated[platformKey];
    onUpdateAttachments(updated);
  };

  const handleResetAttachments = () => {
    onUpdateAttachments({});
  };

  return (
    <div id="media-library-panel" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs uppercase font-extrabold text-slate-800 tracking-wider">Multi-Clip Media Library</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-zinc-400 font-mono italic">RFC drag-routing active</span>
          {Object.keys(attachments).length > 0 && (
            <button
              onClick={handleResetAttachments}
              className="text-[9px] font-bold text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
            >
              Clear Routing
            </button>
          )}
        </div>
      </div>

      {/* Drag Zone to add files to library */}
      <div
        onDragOver={handleDragOverLibrary}
        onDragLeave={handleDragLeaveLibrary}
        onDrop={handleDropLibrary}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isDraggingLibrary
            ? "border-indigo-500 bg-indigo-50/40"
            : "border-slate-200 bg-slate-50/40 hover:border-slate-350 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <UploadCloud className="w-6 h-6 text-indigo-500 mb-1" />
        <span className="text-[10.5px] font-extrabold text-slate-700">Add videos to Library shelf</span>
        <span className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wider">Drag & drop files or click to upload</span>
      </div>

      {/* Library Shelf section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">Library Shelf ({libraryItems.length} items)</span>
          <span className="text-[8.5px] text-slate-400">Grab handle & drag to platforms below</span>
        </div>

        {libraryItems.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-slate-150 rounded-xl text-center">
            <Film className="w-5 h-5 text-slate-300 mx-auto mb-1.5" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your media library is empty</p>
            <p className="text-[9px] text-slate-500 mt-1">Upload files above to compile your workspace</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {libraryItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  draggable
                  onDragStart={(e) => handleDragStartItem(e, item.id)}
                  onDragEnd={handleDragEndItem}
                  className={`flex items-center justify-between p-2 bg-white border rounded-xl hover:shadow-xs transition-all cursor-grab active:cursor-grabbing select-none ${
                    draggedItemId === item.id 
                      ? "border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20 opacity-70"
                      : "border-slate-200/80 hover:border-slate-350"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-11 bg-slate-100 rounded overflow-hidden shrink-0 relative border border-slate-200 flex items-center justify-center">
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      {item.type === "video" && (
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                          <Play className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-500 font-mono">
                        <span className="uppercase">{item.size}</span>
                        {item.duration && (
                          <>
                            <span>•</span>
                            <span>{item.duration}s</span>
                          </>
                        )}
                        {Object.values(attachments).some((att: any) => att?.id === item.id) && (
                          <span className="text-emerald-600 font-sans font-bold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> ROUTED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-1.5">
                    {/* Quick attach dropdown/menu helper */}
                    <div className="relative group/menu">
                      <button 
                        type="button" 
                        onClick={() => handleQueueAll(item.id)}
                        className="text-[9px] font-extrabold px-1.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded transition-colors uppercase tracking-wider leading-none"
                        title="Route this video to ALL active platforms at once!"
                      >
                        Queue All
                      </button>
                      
                      {/* Hover platform list flyout for quick manual targeting */}
                      <div className="absolute right-0 bottom-full mb-1 leading-none bg-white border border-slate-200 rounded-lg shadow-md p-1.5 hidden group-hover/menu:block z-55 min-w-[125px] text-left">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block px-1.5 py-0.5 mb-1">Pass Option URL</span>
                        {activeAccounts.length === 0 ? (
                          <span className="text-[8px] text-slate-400 block px-1.5">No connected channels</span>
                        ) : (
                          activeAccounts.map(acc => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={() => handleAssignToPlatform(item.id, acc.platform)}
                              className="w-full block text-left text-[9px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 px-1.5 py-1 rounded transition-colors uppercase"
                            >
                              → {acc.platform.replace("_shorts", "")}
                            </button>
                          ))
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveLibraryItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Remove file from session library"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Target Platforms Queue Deck */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">Active Dispatch Bays (Drag Targets)</span>
          <span className="text-[8.5px] text-slate-400">Assigned clips post immediately</span>
        </div>

        {/* Global Multi-bay Queue-All Target Zone */}
        {activeAccounts.length > 1 && (
          <div
            onDragOver={(e) => handleDragOverPlatformZone(e, "all")}
            onDragLeave={handleDragLeavePlatformZone}
            onDrop={(e) => handleDropOnPlatformZone(e, "all")}
            className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all ${
              hoveredDropZone === "all"
                ? "border-emerald-600 bg-emerald-50/50"
                : draggedItemId
                  ? "border-emerald-300 bg-emerald-50/10 animate-pulse"
                  : "border-slate-150 bg-slate-50/20"
            }`}
          >
            <span className={`text-[10px] font-extrabold uppercase transition-colors ${
              hoveredDropZone === "all" ? "text-emerald-800" : draggedItemId ? "text-emerald-600" : "text-slate-400"
            }`}>
              {hoveredDropZone === "all" ? "🔥 DROP TO QUEUE ALL ACTIVE PLATFORMS" : "⚓ Drop here to Queue All Channels"}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {accounts.map((acc) => {
            const hasVideo = attachments[acc.platform];
            const isActive = acc.connected;
            const isHovered = hoveredDropZone === acc.platform;

            return (
              <div
                key={acc.id}
                onDragOver={isActive ? (e) => handleDragOverPlatformZone(e, acc.platform) : undefined}
                onDragLeave={isActive ? handleDragLeavePlatformZone : undefined}
                onDrop={isActive ? (e) => handleDropOnPlatformZone(e, acc.platform) : undefined}
                className={`flex flex-col p-3 rounded-xl border select-none transition-all ${
                  !isActive
                    ? "bg-slate-50/40 border-slate-200 opacity-40"
                    : isHovered
                      ? "bg-indigo-50/80 border-indigo-500 scale-102 ring-2 ring-indigo-200/50"
                      : draggedItemId 
                        ? "bg-indigo-50/10 border-indigo-300 border-dashed animate-pulse"
                        : "bg-white border-slate-200/90 shadow-2xs"
                }`}
              >
                {/* Platform Header */}
                <div className="flex items-center justify-between gap-1.5 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <span className="text-[10px] font-black text-slate-800 uppercase truncate">
                      {acc.platform.replace("_shorts", "")}
                    </span>
                  </div>
                  <span className={`text-[8px] font-mono font-bold leading-normal px-1 py-0.2 rounded-sm ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                    {isActive ? "ACTIVE" : "OFF"}
                  </span>
                </div>

                {/* Queue Body */}
                <div className="mt-2.5 flex-1 flex flex-col justify-center">
                  {!isActive ? (
                    <div className="text-center py-2.5 text-[8.5px] text-slate-400 font-semibold uppercase tracking-wider">
                      Channel Off
                    </div>
                  ) : hasVideo ? (
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-1.5 rounded-lg relative group">
                      <div className="w-6 h-8 bg-slate-200 rounded overflow-hidden shrink-0 relative border border-slate-300">
                        <img src={hasVideo.thumbnail} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold text-slate-700 truncate" title={hasVideo.name}>
                          {hasVideo.name}
                        </p>
                        <p className="text-[8px] text-slate-400 font-mono mt-0.2">{hasVideo.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClearPlatformAttachment(acc.platform)}
                        className="absolute -top-1 -right-1 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 rounded-full p-0.5 text-slate-400 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer"
                        title="Remove custom video mapping"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 hover:border-slate-300 rounded-lg py-2 text-center text-[8.5px] text-slate-400 font-medium">
                      {draggedItemId ? (
                        <span className="text-indigo-600 font-bold tracking-wider animate-bounce block">Drop clip here</span>
                      ) : (
                        "Inherits active file"
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
