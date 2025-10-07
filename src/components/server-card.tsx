'use client';

import React from 'react';
import type { Server } from '@/types/server';
import { formatDurationEnShort } from '@/lib/utils';
import { createCpuFormatter, createSwapFormatter, formatKiB, formatMiB } from '@/lib/utils';
import { ServerMetric } from './server-metric';
import { Clock, MapPin, Server as ServerIcon } from 'lucide-react';

// 导入拆分后的组件
import {
  StatusIndicator,
  StatusBadge,
  RealTimeNetworkPanel,
  TotalTrafficPanel,
  IPStatusBadges
} from './server';

interface ServerCardProps {
  server: Server;
}

export const ServerCard: React.FC<ServerCardProps> = React.memo(function ServerCard({ server }) {
  const isOnline = server.online4 || server.online6;

  // CPU 显示格式化，限制最多1位小数（移至 utils）
  const cpuFormatter = React.useMemo(() => createCpuFormatter('zh-CN', 1), []);

  // SWAP特殊处理（移至 utils）
  const swapFormatter = React.useMemo(() => createSwapFormatter(server.swap_total), [server.swap_total]);

  // 缓存格式化函数（移至 utils）
  const memoryFormatter = React.useCallback((val: number) => formatKiB(val), []);
  const diskFormatter = React.useCallback((val: number) => formatMiB(val), []);

  return (
    <div className="h-full server-card card-glass glass-hover rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
      {/* 服务器信息头部 */}
      <ServerCardHeader
        server={server}
        isOnline={isOnline}
      />

      {/* 服务器指标内容 */}
      <div className="p-4 pt-0 space-y-3 flex-grow flex flex-col">
        <ServerMetric
          label="CPU"
          value={server.cpu}
          total={100}
          unit="%"
          formatter={cpuFormatter}
        />

        <ServerMetric
          label="内存"
          value={server.memory_used}
          total={server.memory_total}
          formatter={memoryFormatter}
        />

        <ServerMetric
          label="硬盘"
          value={server.hdd_used}
          total={server.hdd_total}
          formatter={diskFormatter}
        />

        <ServerMetric
          label="SWAP"
          value={server.swap_used}
          total={server.swap_total || 1}
          formatter={swapFormatter}
        />

        {/* 网络面板 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 mt-auto">
          <RealTimeNetworkPanel
            downloadSpeed={server.network_rx}
            uploadSpeed={server.network_tx}
          />

          <TotalTrafficPanel
            totalDownload={server.network_in}
            totalUpload={server.network_out}
          />
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 仅比较会影响 UI 的字段，避免昂贵的 JSON.stringify
  const a = prevProps.server;
  const b = nextProps.server;

  return (
    a.alias === b.alias &&
    a.name === b.name &&
    a.type === b.type &&
    a.location === b.location &&
    a.uptime === b.uptime &&
    a.online4 === b.online4 &&
    a.online6 === b.online6 &&
    a.cpu === b.cpu &&
    a.memory_total === b.memory_total &&
    a.memory_used === b.memory_used &&
    a.swap_total === b.swap_total &&
    a.swap_used === b.swap_used &&
    a.hdd_total === b.hdd_total &&
    a.hdd_used === b.hdd_used &&
    a.network_rx === b.network_rx &&
    a.network_tx === b.network_tx &&
    a.network_in === b.network_in &&
    a.network_out === b.network_out
  );
});
ServerCard.displayName = 'ServerCard';

// 服务器卡片头部组件 - 独立记忆化
interface ServerCardHeaderProps {
  server: Server;
  isOnline: boolean;
}

const ServerCardHeader: React.FC<ServerCardHeaderProps> = React.memo(function ServerCardHeader({
  server,
  isOnline
}) {
  return (
    <div className="p-4 pb-2 space-y-2">
      {/* 名称和状态行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0 max-w-[70%]">
          <StatusIndicator isOnline={isOnline} />
          <span className="text-xl truncate" suppressHydrationWarning>
            {server.alias || server.name}
          </span>
        </div>
        <StatusBadge isOnline={isOnline} />
      </div>

      {/* 运行时间和标签行 */}
      <div className="flex items-center justify-between">
        <UptimeDisplay uptime={server.uptime} />

        <div className="flex items-center gap-0.5 overflow-hidden">
          <IPStatusBadges
            ipv4Online={server.online4}
            ipv6Online={server.online6}
          />
          {server.type && <ServerTypeTag label={server.type} />}
          {server.location && <LocationTag label={server.location} />}
        </div>
      </div>
    </div>
  );
});

// 运行时间显示组件
const UptimeDisplay: React.FC<{ uptime: string }> = React.memo(function UptimeDisplay({ uptime }) {
  // uptime 传入为 "{seconds}s" 或空字符串
  const human = React.useMemo(() => {
    if (!uptime) return '';
    const match = uptime.match(/^(\d+)s$/);
    if (!match) return uptime;
    const seconds = parseInt(match[1], 10);
    return formatDurationEnShort(seconds, 3);
  }, [uptime]);
  return (
    <span className="inline-flex items-center text-muted-foreground text-xs whitespace-nowrap" title={human}>
      <Clock className="h-3.5 w-3.5 mr-1" />
      <span suppressHydrationWarning>{human || '—'}</span>
    </span>
  );
});
UptimeDisplay.displayName = 'UptimeDisplay';

// 服务器类型标签
const ServerTypeTag: React.FC<{ label: string }> = React.memo(function ServerTypeTag({ label }) {
  return (
    <span className="inline-flex items-center h-5 px-1 rounded-full text-[10px] font-medium bg-secondary/40 text-foreground/80 whitespace-nowrap">
      <ServerIcon className="h-3 w-3 mr-0.5 text-muted-foreground" />
      <span className="truncate max-w-[6rem]" suppressHydrationWarning>{label}</span>
    </span>
  );
});
ServerTypeTag.displayName = 'ServerTypeTag';

// 位置标签
const LocationTag: React.FC<{ label: string }> = React.memo(function LocationTag({ label }) {
  return (
    <span className="inline-flex items-center h-5 px-1 rounded-full text-[10px] font-medium bg-secondary/40 text-foreground/80 whitespace-nowrap">
      <MapPin className="h-3 w-3 mr-0.5 text-muted-foreground" />
      <span className="truncate max-w-[8rem]" suppressHydrationWarning>{label}</span>
    </span>
  );
});
LocationTag.displayName = 'LocationTag';