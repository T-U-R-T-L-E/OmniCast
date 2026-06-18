import { useState, useEffect, useRef } from "react";

export interface DraftState {
  title: string;
  description: string;
  hashtags: string;
}

/**
 * Custom React hook that automatically saves the current draft input fields
 * (title, description, hashtags) to localStorage every 5 seconds.
 * 
 * If a previously cached draft is found on mount, it will be automatically 
 * restored via the `onRestore` callback.
 */
export function useAutoSaveDraft(
  title: string,
  description: string,
  hashtags: string,
  onRestore: (draft: DraftState) => void
) {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Use a ref to hold current form states. This avoids registering title/description/hashtags
  // as raw hook dependencies for the interval effect, which would recreate the timer constantly.
  const draftRef = useRef<DraftState>({ title, description, hashtags });
  draftRef.current = { title, description, hashtags };

  // One-time automatic restore from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("omnicast_draft_v1");
      if (saved) {
        const parsed = JSON.parse(saved) as DraftState;
        if (parsed && (parsed.title !== undefined || parsed.description !== undefined || parsed.hashtags !== undefined)) {
          onRestore(parsed);
          const now = new Date();
          setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (e) {
      console.warn("[Omni-Cast AutoSave]: Stored draft restoration bypassed:", e);
    }
  }, [onRestore]);

  // Interval timer executing every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const current = draftRef.current;
        // Do not auto-save if all fields are empty placeholders
        if (!current.title.trim() && !current.description.trim() && !current.hashtags.trim()) {
          return;
        }

        const stored = localStorage.getItem("omnicast_draft_v1");
        const parsedStored = stored ? JSON.parse(stored) as DraftState : null;

        // Perform standard deep check so we do not spam disk writes unless changes are present
        const hasChanges = !parsedStored || 
          parsedStored.title !== current.title || 
          parsedStored.description !== current.description || 
          parsedStored.hashtags !== current.hashtags;

        if (hasChanges) {
          localStorage.setItem("omnicast_draft_v1", JSON.stringify(current));
          const now = new Date();
          setLastSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          console.debug("[Omni-Cast AutoSave]: Progress auto-saved locally at", now.toLocaleTimeString());
        }
      } catch (err) {
        console.warn("[Omni-Cast AutoSave]: Write failed:", err);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const saveDraft = (): string | null => {
    try {
      const current = draftRef.current;
      localStorage.setItem("omnicast_draft_v1", JSON.stringify(current));
      const now = new Date();
      const savedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSaved(savedTime);
      console.debug("[Omni-Cast AutoSave]: Progress saved manually locally at", savedTime);
      return savedTime;
    } catch (err) {
      console.warn("[Omni-Cast AutoSave]: Manual write failed:", err);
      return null;
    }
  };

  return { lastSaved, saveDraft };
}
