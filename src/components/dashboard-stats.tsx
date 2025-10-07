'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useServers } from '@/hooks/use-servers';
import { Cpu, Server, Wifi, Activity } from 'lucide-react';
import { formatDateTime, formatSpeed } from '@/lib/utils';

import {
  StatCard,
  StatsSkeletons,
  LastUpdated,
  TrafficDisplay
} from './dashboard';

export const DashboardStats: React.FC = () => {
  const { data } = useServers();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!data?.servers) {
      return {
        totalServers: 0,
        onlineServers: 0,
        avgCpuUsage: 0,
        totalNetworkRx: 0,
        totalNetworkTx: 0,
        totalDownload: 0,
        totalUpload: 0,
      };
    }

    const onlineServers = data.servers.filter((server) => server.online).length;
    const totalServers = data.servers.length;

    let totalCpu = 0;
    let totalNetworkRx = 0;
    let totalNetworkTx = 0;
    let totalDownload = 0;
    let totalUpload = 0;

    data.servers.forEach((server) => {
      if (server.online) {
        totalCpu += server.cpu || 0;
        totalNetworkRx += server.network_rx || 0;
        totalNetworkTx += server.network_tx || 0;
        totalDownload += server.network_in || 0;
        totalUpload += server.network_out || 0;
      }
    });

    const avgCpuUsage = onlineServers ? Math.round(totalCpu / onlineServers) : 0;

    return {
      totalServers,
      onlineServers,
      avgCpuUsage,
      totalNetworkRx,
      totalNetworkTx,
      totalDownload,
      totalUpload,
    };
  }, [data?.servers]);

  const lastUpdated = useMemo(() => {
    if (!data?.updated) return '未知';
    return formatDateTime(data.updated);
  }, [data?.updated]);

  // 加载中状态
  if (!mounted) {
    return (
      <div className="stats-container">
        <div className="flex justify-between items-center dashboard-title">
          <h2 className="text-3xl font-bold tracking-tight dashboard-main-title" suppressHydrationWarning>监控概览</h2>
          <div className="text-sm text-muted-foreground flex items-center">
            <Wifi className="h-4 w-4 mr-1" />
            <span suppressHydrationWarning>最后更新: 加载中...</span>
          </div>
        </div>

        <div className="stats-grid">
          <StatsSkeletons />
        </div>
      </div>
    );
  }

  // 已加载状态
  return (
    <div className="stats-container">
      <div className="flex justify-between items-center dashboard-title">
        <h2
          className="text-3xl font-bold tracking-tight dashboard-main-title"
          suppressHydrationWarning
        >
          监控概览
        </h2>

        <LastUpdated timestamp={lastUpdated} />
      </div>

      <div className="stats-grid">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="服务器"
            value={
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{stats.onlineServers}</span>
                <span className="text-xs opacity-70 mx-1.5">/</span>
                <span className="text-xl font-bold opacity-80">{stats.totalServers}</span>
              </div>
            }
            icon={<Server className="h-6 w-6" />}
          />
          <StatCard
            title="平均CPU使用率"
            value={
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{stats.avgCpuUsage}</span>
                <span className="text-xs opacity-70 ml-1">%</span>
              </div>
            }
            icon={<Cpu className="h-6 w-6" />}
          />
          <StatCard
            title="实时网络速率"
            value={
              <div className="flex items-baseline space-x-2 min-w-0">
                <div className="flex items-baseline whitespace-nowrap">
                  <span className="text-sm font-medium opacity-70 flex-shrink-0">↓</span>
                  <span className="text-lg font-bold ml-1 font-mono">{formatSpeed(stats.totalNetworkRx, 1)}</span>
                </div>
                <div className="flex items-baseline whitespace-nowrap">
                  <span className="text-sm font-medium opacity-70 flex-shrink-0">↑</span>
                  <span className="text-lg font-bold ml-1 font-mono">{formatSpeed(stats.totalNetworkTx, 1)}</span>
                </div>
              </div>
            }
            icon={<Activity className="h-6 w-6" />}
          />
          <StatCard
            title="总流量"
            value={
              <TrafficDisplay
                download={stats.totalDownload}
                upload={stats.totalUpload}
              />
            }
            icon={<Wifi className="h-6 w-6" />}
          />
        </div>
      </div>
    </div>
  );
};