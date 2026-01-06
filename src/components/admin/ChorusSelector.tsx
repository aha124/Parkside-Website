"use client";

import { ChorusTag } from "@/types/admin";

interface ChorusSelectorProps {
  value: ChorusTag;
  onChange: (value: ChorusTag) => void;
  label?: string;
  required?: boolean;
}

export default function ChorusSelector({
  value,
  onChange,
  label = "Chorus",
  required = true,
}: ChorusSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="chorus"
            value="harmony"
            checked={value === "harmony"}
            onChange={() => onChange("harmony")}
            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Parkside Harmony</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="chorus"
            value="melody"
            checked={value === "melody"}
            onChange={() => onChange("melody")}
            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Parkside Melody</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="chorus"
            value="voices"
            checked={value === "voices"}
            onChange={() => onChange("voices")}
            className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">Parkside Voices (Both)</span>
        </label>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Select which chorus this content belongs to. &quot;Parkside Voices&quot; will show for all visitors.
      </p>
    </div>
  );
}
