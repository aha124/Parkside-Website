"use client";

import { useState } from "react";
import { RefreshCw, Loader2, CheckCircle, AlertCircle } from "lucide-react";

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

export default function SyncNewsButton() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/news/sync", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, ...data });
        // Refresh the page to show new news
        if (data.stats?.addedCount > 0) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        setResult({ success: false, error: data.error || "Sync failed" });
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Sync failed",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {result && (
        <div
          className={`flex items-center gap-2 text-sm ${result.success ? "text-green-600" : "text-red-600"}`}
        >
          {result.success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>
                {result.stats?.addedCount === 0
                  ? "No new articles found"
                  : `Added ${result.stats?.addedCount} new articles`}
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
        title="Import news from parksideharmony.org"
      >
        {syncing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
        <span>{syncing ? "Syncing..." : "Sync News"}</span>
      </button>
    </div>
  );
}
