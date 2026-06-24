import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Global error interceptor to prevent obfuscated cross-origin "Script error." in iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('[Omni-Cast Global Uncaught Error]:', event.error || event.message);
    
    // Check if the app failed to mount or render at all (i.e. root element is empty)
    const rootEl = document.getElementById('root');
    if (rootEl && (!rootEl.innerHTML || rootEl.innerHTML === '' || rootEl.innerHTML.includes('loading'))) {
      rootEl.innerHTML = `
        <div style="min-height: 100vh; background-color: #020617; color: #f1f5f9; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="max-width: 620px; width: 100%; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4);">
            <div style="display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
              <div style="padding: 12px; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; color: #ef4444; flex-shrink: 0; font-size: 20px; line-height: 1;">
                ⚠️
              </div>
              <div>
                <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0;">Bootstrapping Error Detected</h1>
                <p style="font-size: 14px; color: #94a3b8; margin: 0;">Omni-Cast cross-platform workspace failed to initialize properly during startup.</p>
              </div>
            </div>
            <div style="background-color: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-family: monospace; font-size: 12px; color: #fca5a5; overflow: auto; max-height: 250px; line-height: 1.6; border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">${event.error?.name || 'Error'}:</strong> ${event.error?.message || event.message}
              ${event.error?.stack ? `<pre style="white-space: pre-wrap; opacity: 0.8; margin-top: 10px; font-size: 10px; color: #cbd5e1; border-t: 1px solid #1e293b; padding-top: 8px;">${event.error.stack}</pre>` : ''}
            </div>
            <div style="display: flex; gap: 12px;">
              <button onclick="window.location.reload()" style="flex: 1; padding: 11px 16px; background-color: #4f46e5; border: none; border-radius: 12px; color: #ffffff; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;">Reload Application</button>
              <button onclick="try { localStorage.clear(); window.location.reload(); } catch(e) {}" style="flex: 1; padding: 11px 16px; background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; color: #e2e8f0; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;">Reset Cache & Reload</button>
            </div>
          </div>
        </div>
      `;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Omni-Cast Global Unhandled Rejection]:', event.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
