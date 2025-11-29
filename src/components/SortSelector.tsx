
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDownNarrowWide } from 'lucide-react';

export interface SortOption {
  id: string;
  label: string;
}

interface SortSelectorProps {
  options: SortOption[];
  selectedOption: string;
  onSelectOption: (optionId: string) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ 
  options,
  selectedOption,
  onSelectOption
}) => {
  const selectedOptionLabel = options.find(option => option.id === selectedOption)?.label || 'Sort by';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="glass-button h-9 text-sm px-4 flex gap-2 font-semibold text-gray-700 border-white/30 hover:scale-105 transition-all duration-300">
          <ArrowDownNarrowWide className="h-4 w-4" />
          <span>{selectedOptionLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong w-48 border-white/30">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuItem 
            key={option.id} 
            onClick={() => onSelectOption(option.id)}
            className={selectedOption === option.id ? "bg-amber-500/20 text-amber-700 font-semibold" : "hover:bg-white/30"}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Add these named exports for backward compatibility
export const SortSelectorWithLegacyProps: React.FC<{
  options: SortOption[];
  selectedOption: string;
  onSelect: (optionId: string) => void;
}> = ({ options, selectedOption, onSelect }) => {
  return <SortSelector options={options} selectedOption={selectedOption} onSelectOption={onSelect} />;
};

export default SortSelector;
