'use client';

import { useState } from 'react';
import { RefreshCw, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncResult {
  success: boolean;
  message?: string;
  error?: string;
  stats?: {
    sourceCount: number;
    existingCount: number;
    addedCount: number;
    totalCount: number;
  };
}

export default function SyncEventsButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

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
        // Refresh the page after a short delay to show new events
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
        <div className={`flex items-center gap-2 text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
          {result.success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>
                {result.stats?.addedCount === 0
                  ? 'No new events found'
                  : `Added ${result.stats?.addedCount} new events`}
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>{result.error}</span>
            </>
          )}
        </div>
      )}
      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Sync events from parksideharmony.org"
      >
        {syncing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
        <span>{syncing ? 'Syncing...' : 'Sync Events'}</span>
      </button>
    </div>
  );
}
