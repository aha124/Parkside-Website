"use client";

import { useState } from "react";
import { Download, RefreshCw, Check } from "lucide-react";

export default function SeedImagesButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ added: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/images/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to import images");
      }

      setResult(data.data);

      // Refresh the page to show new images
      if (data.data.added > 0) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <RefreshCw className="w-5 h-5 animate-spin" />
        ) : result ? (
          <Check className="w-5 h-5" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        <span>
          {loading
            ? "Importing..."
            : result
            ? `Added ${result.added} images`
            : "Import Existing Images"}
        </span>
      </button>
      {error && <span className="text-red-600 text-sm">{error}</span>}
      {result && result.skipped > 0 && (
        <span className="text-gray-500 text-sm">
          ({result.skipped} already existed)
        </span>
      )}
    </div>
  );
}
