"use client";

import { ReactNode } from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminTabs({ tabs, activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-16 z-30">
      <nav className="-mb-px flex overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                ${isActive
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
