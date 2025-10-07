'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  className
}) => {
  return (
    <Card 
      className={cn(`
        relative overflow-hidden border shadow-sm bg-card
      `, className)}
    >
      <div className="relative z-10">
        <CardContent className="flex items-center p-6">
          <div className="p-3 rounded-xl bg-secondary mr-4">
            <div className="relative z-10 text-foreground">
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}; 