
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
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-full px-3 flex gap-1">
          <ArrowDownNarrowWide className="h-3 w-3" />
          <span>{selectedOptionLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuItem 
            key={option.id} 
            onClick={() => onSelectOption(option.id)}
            className={selectedOption === option.id ? "bg-muted" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortSelector;
