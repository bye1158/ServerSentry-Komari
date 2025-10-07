'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

interface RegionSelectProps {
  regions: string[];
  selectedRegion: string | null;
  onRegionChange: (region: string | null) => void;
}

export const RegionSelect: React.FC<RegionSelectProps> = ({
  regions,
  selectedRegion,
  onRegionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentSelection = selectedRegion || '全部地区';
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (region: string | null) => {
    onRegionChange(region);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md hover:bg-secondary/50 transition-colors min-w-[140px] justify-between"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{currentSelection}</span>
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[180px] bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto animate-scale-in">
          {/* 全部选项 */}
          <button
            onClick={() => handleSelect(null)}
            className="w-full px-3 py-2 text-left hover:bg-secondary/50 flex items-center justify-between group transition-colors duration-150"
          >
            <span className="text-sm">全部地区</span>
            {selectedRegion === null && (
              <Check className="h-4 w-4 text-primary animate-fade-in" />
            )}
          </button>
          
          {/* 分隔线 */}
          {regions.length > 0 && (
            <div className="border-t border-border my-1" />
          )}
          
          {/* 地区选项 */}
          {regions.map((region, index) => (
            <button
              key={region}
              onClick={() => handleSelect(region)}
              className="w-full px-3 py-2 text-left hover:bg-secondary/50 flex items-center justify-between group transition-colors duration-150"
              style={{ animationDelay: `${index * 20}ms` }}
            >
              <span className="text-sm">{region}</span>
              {selectedRegion === region && (
                <Check className="h-4 w-4 text-primary animate-fade-in" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};