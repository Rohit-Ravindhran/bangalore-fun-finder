
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  defaultTabId?: string;
}

const TabView: React.FC<TabViewProps> = ({ tabs, defaultTabId }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.targetTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold (50px)
    if (Math.abs(diff) > 50) {
      const currentTabIndex = tabs.findIndex(tab => tab.id === activeTabId);
      if (diff > 0 && currentTabIndex < tabs.length - 1) {
        // Swipe left
        setActiveTabId(tabs[currentTabIndex + 1].id);
      } else if (diff < 0 && currentTabIndex > 0) {
        // Swipe right
        setActiveTabId(tabs[currentTabIndex - 1].id);
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
      <div className="relative">
        <ScrollArea className="pb-2">
          <div className="flex space-x-1 border-b overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={cn(
                  "px-4 py-2 text-center whitespace-nowrap font-medium text-sm transition-colors relative",
                  activeTabId === tab.id 
                    ? "text-w2d-teal border-b-2 border-w2d-teal" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div 
        className="mt-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {activeTab && (
          <div className="space-y-4">
            {activeTab.count && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Showing {activeTab.count.loaded} of {activeTab.count.total} activities</span>
                  {activeTab.count.loaded < activeTab.count.total && activeTab.onLoadMore && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={activeTab.onLoadMore}
                      className="text-w2d-teal p-0 h-auto"
                      disabled={activeTab.isLoading}
                    >
                      {activeTab.isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                  )}
                </div>
                
                <Progress 
                  value={(activeTab.count.loaded / activeTab.count.total) * 100} 
                  className="h-1" 
                />
              </div>
            )}
            
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
