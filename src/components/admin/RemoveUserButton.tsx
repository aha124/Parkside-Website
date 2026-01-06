'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface RemoveUserButtonProps {
  email: string;
}

export default function RemoveUserButton({ email }: RemoveUserButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove user");
      }

      router.refresh();
    } catch (error) {
      console.error("Remove error:", error);
      alert("Failed to remove user. Please try again.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Remove Admin
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to remove <strong>{email}</strong> from the
            admin list? They will no longer be able to access the admin
            dashboard.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>{loading ? "Removing..." : "Remove"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Remove admin"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
