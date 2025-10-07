'use client';

import React from 'react';
import { RegionGroup } from '@/lib/api';
import { ServerCard } from './server-card';
import { MapPin, Server } from 'lucide-react';

interface RegionGroupViewProps {
  regionGroups: RegionGroup[];
  showRegionHeaders?: boolean;
}

export const RegionGroupView: React.FC<RegionGroupViewProps> = ({
  regionGroups,
  showRegionHeaders = true,
}) => {
  return (
    <div className="space-y-8">
      {regionGroups.map(({ region, servers }, groupIndex) => (
        <div key={region} className="space-y-4 animate-slide-up" style={{ animationDelay: `${groupIndex * 100}ms` }}>
          {showRegionHeaders && (
            <div className="flex items-center gap-2 border-b pb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">{region}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Server className="h-4 w-4" />
                <span>{servers.length} 台服务器</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 server-grid">
            {servers.map((server, serverIndex) => (
              <div 
                key={server.name}
                className="animate-fade-in transform-gpu"
                style={{ animationDelay: `${(groupIndex * 100) + (serverIndex * 30)}ms` }}
              >
                <ServerCard server={server} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};