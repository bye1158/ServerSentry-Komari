'use client';

import React from 'react';
import { formatBytes } from '@/lib/utils';

export interface TrafficArrowProps {
  direction?: 'up' | 'down';
}

export const TrafficArrow: React.FC<TrafficArrowProps> = ({ direction = 'down' }) => (
  <span className="text-sm mr-0.5 text-muted-foreground">
    {direction === 'down' ? '↓' : '↑'}
  </span>
);

export interface TrafficDisplayProps {
  download: number;
  upload: number;
}

export const TrafficDisplay: React.FC<TrafficDisplayProps> = ({ download, upload }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex items-center">
      <TrafficArrow direction="down" />
      <span className="text-base font-bold text-foreground">
        {formatBytes(download).split(' ').join('')}
      </span>
    </div>

    <div className="h-5 w-[1px] mx-2 bg-border" />

    <div className="flex items-center">
      <TrafficArrow direction="up" />
      <span className="text-base font-bold text-foreground">
        {formatBytes(upload).split(' ').join('')}
      </span>
    </div>
  </div>
);