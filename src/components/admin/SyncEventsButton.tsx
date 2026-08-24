'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
}

// Each click queues a real workflow run, so ignore impatient repeat clicks.
const COOLDOWN_SECONDS = 30;

export default function SyncEventsButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/events/sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({ success: false, error: data.error || 'Sync failed' });
      } else {
        setResult(data);
        setCooldown(COOLDOWN_SECONDS);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {result && (
        <div className={`flex items-start gap-2 text-sm max-w-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? (
            <>
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{result.message || 'Sync started.'}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </>
          )}
        </div>
      )}
      <button
        onClick={handleSync}
        disabled={syncing || cooldown > 0}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        title="Sync events from parksideharmony.org"
      >
        {syncing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
        <span>
          {syncing
            ? 'Starting...'
            : cooldown > 0
            ? `Syncing (${cooldown}s)`
            : 'Sync Events'}
        </span>
      </button>
    </div>
  );
}
