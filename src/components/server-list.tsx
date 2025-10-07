'use client';

import React from 'react';
import { useServers } from '@/hooks/use-servers';
import { ServerCard } from './server-card';

import type { Server } from '@/types/server';

export const ServerList: React.FC = React.memo(function ServerList() {
  const { data } = useServers();

  const sortedServers = React.useMemo(() => {
    if (!data?.servers) return [];

    return [...data.servers].sort((a, b) => {
      // 首先按照权重排序（正序）
      if (a.weight !== b.weight) {
        return a.weight - b.weight;
      }

      // 然后按照在线状态排序（在线优先）
      const aOnline = a.online4 || a.online6;
      const bOnline = b.online4 || b.online6;
      if (aOnline !== bOnline) {
        return bOnline ? 1 : -1;
      }

      // 最后按照别名排序（字母顺序）
      return (a.alias || a.name).localeCompare(b.alias || b.name);
    });
  }, [data?.servers]);

  if (!data?.servers) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 server-grid">
        {Array(8).fill(null).map((_, i) => (
          <div
            key={i}
            className="h-[300px] bg-muted/10 rounded-lg animate-pulse animate-slide-up"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 server-grid">
      {sortedServers.map((server, index) => (
        <ServerCardItem
          key={server.name}
          server={server}
          index={index}
        />
      ))}
    </div>
  );
});
ServerList.displayName = 'ServerList';

// ServerCardItem 组件，避免重复渲染
const ServerCardItem: React.FC<{ server: Server; index: number }> = React.memo(function ServerCardItem({ server, index }) {
  return (
    <div
      className="h-full animate-fade-in transform-gpu"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <ServerCard server={server} />
    </div>
  );
});
ServerCardItem.displayName = 'ServerCardItem';