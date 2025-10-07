'use client';

import React from 'react';

interface StatusBadgeProps {
  isOnline: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ isOnline }) => (
  <span 
    className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
      isOnline 
        ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
        : 'bg-gray-400/10 text-gray-600 dark:text-gray-400'
    }`}
    suppressHydrationWarning
  >
    {isOnline ? '在线' : '离线'}
  </span>
); 