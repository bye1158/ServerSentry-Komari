'use client';

import React from 'react';

interface StatusIndicatorProps {
  isOnline: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ isOnline }) => (
  <div className={`relative h-5 w-5 rounded-full flex items-center justify-center ${
    isOnline ? 'bg-green-500/20' : 'bg-gray-400/20'
  }`}>
    <div 
      className={`h-2 w-2 rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      }`}
    />
  </div>
); 