'use client';

import React from 'react';
import { Wifi, HardDrive } from 'lucide-react';
import { formatBytes, formatSpeed } from '@/lib/utils';

interface NetworkArrowProps {
  direction: 'up' | 'down';
}

const NetworkArrow: React.FC<NetworkArrowProps> = ({ direction }) => (
  <span className="text-sm flex-shrink-0 text-muted-foreground transition-all duration-150 hover:text-foreground hover:scale-110">
    {direction === 'down' ? '↓' : '↑'}
  </span>
);

// 实时网络面板
interface RealTimeNetworkPanelProps {
  downloadSpeed: number;
  uploadSpeed: number;
}

export const RealTimeNetworkPanel: React.FC<RealTimeNetworkPanelProps> = React.memo(function RealTimeNetworkPanel({
  downloadSpeed,
  uploadSpeed
}) {
  // 缓存格式化结果
  const formattedDownload = React.useMemo(() => formatSpeed(downloadSpeed, 1), [downloadSpeed]);
  const formattedUpload = React.useMemo(() => formatSpeed(uploadSpeed, 1), [uploadSpeed]);

  return (
    <div className="p-2.5 rounded-xl bg-secondary h-full transition-all duration-200 hover:bg-secondary/80 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center space-x-1.5 mb-1.5">
        <Wifi className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 hover:text-foreground" />
        <span className="text-xs font-medium">实时网络</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center min-h-[18px] text-xs">
          <NetworkArrow direction="down" />
          <span className="font-medium ml-1 w-6 flex-shrink-0">下载</span>
          <span className="font-medium text-muted-foreground font-mono whitespace-nowrap ml-auto transition-colors duration-150 hover:text-foreground" suppressHydrationWarning>
            {formattedDownload}
          </span>
        </div>

        <div className="flex items-center min-h-[18px] text-xs">
          <NetworkArrow direction="up" />
          <span className="font-medium ml-1 w-6 flex-shrink-0">上传</span>
          <span className="font-medium text-muted-foreground font-mono whitespace-nowrap ml-auto transition-colors duration-150 hover:text-foreground" suppressHydrationWarning>
            {formattedUpload}
          </span>
        </div>
      </div>
    </div>
  );
});

// 总流量面板
interface TotalTrafficPanelProps {
  totalDownload: number;
  totalUpload: number;
}

export const TotalTrafficPanel: React.FC<TotalTrafficPanelProps> = React.memo(function TotalTrafficPanel({
  totalDownload,
  totalUpload
}) {
  // 缓存格式化结果
  const formattedDownload = React.useMemo(() => formatBytes(totalDownload, 1), [totalDownload]);
  const formattedUpload = React.useMemo(() => formatBytes(totalUpload, 1), [totalUpload]);

  return (
    <div className="p-2.5 rounded-xl bg-secondary h-full transition-all duration-200 hover:bg-secondary/80 hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center space-x-1.5 mb-1.5">
        <HardDrive className="h-3.5 w-3.5 text-muted-foreground transition-colors duration-150 hover:text-foreground" />
        <span className="text-xs font-medium">总流量</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center min-h-[18px] text-xs">
          <span className="text-sm flex-shrink-0 text-muted-foreground transition-colors duration-150 hover:text-foreground">↓</span>
          <span className="font-medium ml-1 w-6 flex-shrink-0">接收</span>
          <span className="font-medium text-muted-foreground font-mono whitespace-nowrap ml-auto transition-colors duration-150 hover:text-foreground" suppressHydrationWarning>
            {formattedDownload}
          </span>
        </div>

        <div className="flex items-center min-h-[18px] text-xs">
          <span className="text-sm flex-shrink-0 text-muted-foreground transition-colors duration-150 hover:text-foreground">↑</span>
          <span className="font-medium ml-1 w-6 flex-shrink-0">发送</span>
          <span className="font-medium text-muted-foreground font-mono whitespace-nowrap ml-auto transition-colors duration-150 hover:text-foreground" suppressHydrationWarning>
            {formattedUpload}
          </span>
        </div>
      </div>
    </div>
  );
});