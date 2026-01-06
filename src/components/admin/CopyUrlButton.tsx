'use client';

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyUrlButtonProps {
  url: string;
}

export default function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      title={copied ? "Copied!" : "Copy URL"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}
