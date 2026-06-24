class SafeStorage {
  private memCache: Record<string, string> = {};

  private hasLocalStorage(): boolean {
    try {
      return typeof window !== "undefined" && !!window.localStorage;
    } catch (e) {
      return false;
    }
  }

  getItem(key: string): string | null {
    if (!this.hasLocalStorage()) {
      return this.memCache[key] ?? null;
    }
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Failed to read key "${key}" from localStorage:`, e);
      return this.memCache[key] ?? null;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.hasLocalStorage()) {
      this.memCache[key] = value;
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[SafeStorage] Failed to write key "${key}" to localStorage:`, e);
      this.memCache[key] = value;
    }
  }

  removeItem(key: string): void {
    if (!this.hasLocalStorage()) {
      delete this.memCache[key];
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[SafeStorage] Failed to remove key "${key}" from localStorage:`, e);
      delete this.memCache[key];
    }
  }

  clear(): void {
    if (!this.hasLocalStorage()) {
      this.memCache = {};
      return;
    }
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(`[SafeStorage] Failed to clear localStorage:`, e);
      this.memCache = {};
    }
  }
}

export const safeStorage = new SafeStorage();
