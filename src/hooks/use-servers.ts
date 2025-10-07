import { useQuery } from '@tanstack/react-query';
import { config } from '@/lib/config';

export interface StatsResponse {
  updated: number;
  servers: import('@/types/server').Server[];
}

/**
 * 获取服务器状态数据的Hook，优化性能以减少内存占用
 */
export const useServers = () => {
  return useQuery<StatsResponse>({
    queryKey: config.queryKeys.serversStatus,
    queryFn: async () => {
      const res = await fetch(config.api.servers, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 1 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    refetchInterval: config.refresh.serversMs,
    refetchOnWindowFocus: false,
  });
};