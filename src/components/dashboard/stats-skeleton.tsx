'use client';

import React from 'react';

export const StatsSkeletons: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array(4).fill(null).map((_, i) => (
      <div 
        key={i} 
        className="h-[104px] glass-light rounded-xl skeleton"
        style={{ animationDelay: `${i * 100}ms` }}
      />
    ))}
  </div>
); 