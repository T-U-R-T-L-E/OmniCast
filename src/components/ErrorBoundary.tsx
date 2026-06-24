import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw, Trash2 } from "lucide-react";
import { safeStorage } from "../lib/safeStorage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[Omni-Cast Runtime Error]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetAndReload = () => {
    try {
      safeStorage.clear();
      // Clear standard localStorage too just in case
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            {/* Background ambient light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-start gap-4 mb-6 relative">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0">
                <AlertOctagon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Application Exception Detected
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Omni-Cast cross-platform workspace encountered a rendering error. You can recover by reloading or resetting your local workspace state.
                </p>
              </div>
            </div>

            {/* Error Message Panel */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-6 font-mono text-xs text-red-300 overflow-auto max-h-48 leading-relaxed">
              <div className="font-bold mb-1 text-red-400">
                {this.state.error?.name || "Error"}: {this.state.error?.message || "Unknown error"}
              </div>
              {this.state.error?.stack && (
                <pre className="whitespace-pre-wrap opacity-80 mt-2 text-[10px]">
                  {this.state.error.stack}
                </pre>
              )}
              {this.state.errorInfo?.componentStack && (
                <pre className="whitespace-pre-wrap opacity-60 mt-2 text-[10px] border-t border-slate-800/50 pt-2">
                  Component Stack:
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 relative">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Application
              </button>
              
              <button
                type="button"
                onClick={this.handleResetAndReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700/80 active:bg-slate-800/50 text-slate-200 hover:text-white border border-slate-700/50 font-medium text-sm rounded-xl transition-all cursor-pointer"
                title="Clears saved drafts and temporary local states to fix launch crashes"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                Clear Cache & Reset
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Omni-Cast Recovery Console
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
