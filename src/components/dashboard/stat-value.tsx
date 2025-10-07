'use client';

import React from 'react';

export interface StatValueProps {
  children: React.ReactNode;
  accentColor?: string;
}

export const StatValue: React.FC<StatValueProps> = ({ children, accentColor }) => (
  <div 
    className="text-2xl font-bold" 
    suppressHydrationWarning
    style={{ color: accentColor }}
  >
    {children}
  </div>
); 