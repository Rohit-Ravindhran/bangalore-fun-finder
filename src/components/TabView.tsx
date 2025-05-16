
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewToggleWithLegacyProps as ViewToggle } from '@/components/ViewToggle';
import { SortSelectorWithLegacyProps as SortSelector } from '@/components/SortSelector';
import { Button } from '@/components/ui/button';

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
  defaultTabId: string;
  viewMode: 'card' | 'grid';
  setViewMode: (mode: 'card' | 'grid') => void;
  sortOptions: { id: string; label: string }[];
  sortOption: string;
  handleSortChange: (option: string) => void;
  hideControls?: boolean;
}

const TabView = ({ 
  tabs, 
  defaultTabId, 
  viewMode,
  setViewMode,
  sortOptions,
  sortOption,
  handleSortChange,
  hideControls = false
}: TabViewProps) => {
  const [activeTab, setActiveTab] = useState(defaultTabId);
  
  return (
    <Tabs defaultValue={defaultTabId} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="bg-white border border-gray-200 overflow-x-auto max-w-[100%] w-full flex-nowrap no-scrollbar rounded-lg">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="relative px-3 sm:px-5 py-2 flex-shrink-0 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-amber-50 data-[state=active]:shadow-none data-[state=active]:text-amber-900 font-medium"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {!hideControls && (
        <div className="flex justify-between items-center mb-4">
          <SortSelector 
            options={sortOptions} 
            selectedOption={sortOption} 
            onSelect={handleSortChange} 
          />
          <ViewToggle 
            selectedMode={viewMode} 
            onSelect={setViewMode} 
            disabled={activeTab !== 'all'} 
          />
        </div>
      )}
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-2">
          {tab.content}
          
          {tab.count && tab.count.loaded < tab.count.total && tab.onLoadMore && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={tab.onLoadMore}
                disabled={tab.isLoading}
                className="text-sm"
              >
                {tab.isLoading ? 'Loading...' : `Load More (${tab.count.loaded} of ${tab.count.total})`}
              </Button>
            </div>
          )}
        </TabsContent>
      ))}
      
      {/* Fix the style tag by removing jsx and global props */}
      <style>
        {`
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        `}
      </style>
    </Tabs>
  );
};

export default TabView;
