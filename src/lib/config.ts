/**
 * 全局配置文件
 */

export const config = {
  /**
   * API 路径（本地代理）
   */
  api: {
    servers: '/api/servers',
    public: '/api/public',
  },

  /**
   * React Query/SWR 的查询键，避免魔法字符串
   */
  queryKeys: {
    serversStatus: ['servers-status'] as const,
    publicInfo: ['komari-public'] as const,
  },

  /**
   * 刷新/缓存时间设置（毫秒）
   */
  refresh: {
    serversMs: 6000,
    publicStaleMs: 10_000,
  },

  /**
   * 网站标题
   */
  siteTitle: 'Server Status',

  /**
   * 网站描述
   */
  siteDescription: 'Komari Monitor',
};

/**
 * 统一导出：后端 Komari 服务的基础配置
 * 仅在服务端（API 路由、server 代码）执行此函数
 */
export function getKomariConfig() {
  const baseUrl = process.env.KOMARI_BASE_URL;
  const apiKey = process.env.KOMARI_API_KEY;

  if (!baseUrl) {
    throw new Error('KOMARI_BASE_URL not configured');
  }

  return { baseUrl, apiKey } as { baseUrl: string; apiKey?: string };
}
