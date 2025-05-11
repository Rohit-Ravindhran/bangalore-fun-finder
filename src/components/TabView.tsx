
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ViewToggle from '@/components/ViewToggle';

interface TabViewProps {
  tabs: {
    id: string;
    title: string;
    content: React.ReactNode;
    count?: {
      loaded: number;
      total: number;
    };
    onLoadMore?: () => void;
    isLoading?: boolean;
  }[];
  viewMode:any;
  setViewMode:any;
  defaultTabId?: string;
}

const TabView: React.FC<TabViewProps> = ({ tabs, defaultTabId, viewMode, setViewMode }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.targetTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      const currentTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
      if (diff > 0 && currentTabIndex < tabs.length - 1) {
        setActiveTabId(tabs[currentTabIndex + 1].id); // Swipe left
      } else if (diff < 0 && currentTabIndex > 0) {
        setActiveTabId(tabs[currentTabIndex - 1].id); // Swipe right
      }
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="sticky top-[72px] z-30 bg-w2d-cream pt-2 pb-3 shadow-sm">
        <div className="overflow-x-auto scroll-area-horizontal pb-2">
          <div className="flex space-x-4 border-b px-2 items-center min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "px-4 py-3 text-center whitespace-nowrap font-medium text-base transition-all relative",
                  activeTabId === tab.id 
                    ? "text-w2d-teal border-b-2 border-w2d-teal" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.title}
                {activeTabId === tab.id && (
                  <div className="absolute -bottom-[2px] left-0 right-0 h-0.5 bg-w2d-teal" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div 
        className="mt-6 pb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
     
        {activeTab && (
          <div className="space-y-4">
            <div className="min-h-[300px]">
              {activeTab.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabView;
