import type { Server } from '@/types/server';

// Server 类型迁移至 src/types/server.ts

// 定义API响应类型
export interface StatsResponse {
  updated: number;
  servers: Server[];
}

// 旧版 REST 获取函数已移除：请在 hook 内部或 API 路由使用 fetch/RPC2


/**
 * 地区分组类型
 */
export interface RegionGroup {
  region: string;
  servers: Server[];
}

/**
 * 根据服务器location字段按地区分组
 * @param servers 服务器列表
 * @returns 按地区分组的服务器
 */
export const groupServersByRegion = (servers: Server[]): RegionGroup[] => {
  const groups = new Map<string, Server[]>();

  servers.forEach((server) => {
    const region = server.location || '未知地区';
    if (!groups.has(region)) {
      groups.set(region, []);
    }
    groups.get(region)!.push(server);
  });

  // 转换为数组并按地区名排序
  return Array.from(groups.entries())
    .map(([region, servers]) => ({ region, servers }))
    .sort((a, b) => {
      // 将"未知地区"排到最后
      if (a.region === '未知地区') return 1;
      if (b.region === '未知地区') return -1;
      return a.region.localeCompare(b.region, 'zh-CN');
    });
};

/**
 * 获取所有唯一的地区列表
 * @param servers 服务器列表
 * @returns 地区列表
 */
export const getUniqueRegions = (servers: Server[]): string[] => {
  const regions = new Set(servers.map(server => server.location || '未知地区'));
  return Array.from(regions).sort((a, b) => {
    if (a === '未知地区') return 1;
    if (b === '未知地区') return -1;
    return a.localeCompare(b, 'zh-CN');
  });
};