import { rpcGetNodes, rpcGetNodesLatestStatus } from '@/lib/rpc2';
import { getKomariConfig } from '@/lib/config';
import { json, jsonError, CachePolicy } from '@/lib/response';

// RPC2 节点信息类型（基于 common:getNodes 返回结构）
interface RpcNode {
  uuid: string;
  name?: string;
  cpu_name?: string;
  virtualization?: string;
  arch?: string;
  cpu_cores?: number;
  os?: string;
  kernel_version?: string;
  gpu_name?: string;
  ipv4?: string;
  ipv6?: string;
  region?: string;
  remark?: string;
  public_remark?: string;
  mem_total?: number;
  swap_total?: number;
  disk_total?: number;
  version?: string;
  weight?: number;
  price?: number;
  billing_cycle?: number;
  auto_renewal?: boolean;
  currency?: string;
  expired_at?: string | null;
  group?: string;
  tags?: string;
  hidden?: boolean;
  traffic_limit?: number;
  traffic_limit_type?: string;
  created_at?: string;
  updated_at?: string;
}

// 规范化虚拟化/类型展示
function normalizeVirtualizationLabel(virtualization?: string, arch?: string): string {
  const raw = (virtualization && virtualization.trim()) || (arch && arch.trim()) || '';
  if (!raw) return '';
  const lower = raw.toLowerCase();

  // 将常见的“无/未知”同义归一为 Dedicated（物理机）
  const noneSet = new Set(['none', 'null', 'unknown', 'n/a', 'na', '-', 'not applicable', 'n\u002fa']);
  if (noneSet.has(lower)) return 'Dedicated';

  // 常见虚拟化类型标准化展示
  const map: Record<string, string> = {
    'kvm': 'KVM',
    'qemu': 'QEMU',
    'openvz': 'OpenVZ',
    'lxc': 'LXC',
    'xen': 'Xen',
    'vmware': 'VMware',
    'hyper-v': 'Hyper-V',
    'hyperv': 'Hyper-V',
    'docker': 'Docker',
    'baremetal': 'Dedicated',
    'bare-metal': 'Dedicated',
    'dedicated': 'Dedicated',
  };

  return map[lower] || raw;
}

// RPC2 节点状态类型（基于 common:getNodesLatestStatus 返回结构）
interface RpcNodeStatus {
  client: string;
  time: string;
  cpu: number;
  gpu: number;
  ram: number;
  ram_total: number;
  swap: number;
  swap_total: number;
  load: number;
  load5: number;
  load15: number;
  temp: number;
  disk: number;
  disk_total: number;
  net_in: number;
  net_out: number;
  net_total_up: number;
  net_total_down: number;
  process: number;
  connections: number;
  connections_udp: number;
  online: boolean;
}

// 传统 API 响应类型（用于获取 uptime）
interface TraditionalApiResponse {
  status: string;
  message: string;
  data: Array<{
    uptime: number;
    updated_at: string;
  }>;
}

/**
 * 获取指定节点的 uptime 数据（使用传统 API）
 */
async function getNodeUptime(uuid: string): Promise<number | null> {
  try {
    const { baseUrl, apiKey } = getKomariConfig();
    const url = baseUrl.endsWith('/')
      ? `${baseUrl}api/recent/${uuid}`
      : `${baseUrl}/api/recent/${uuid}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      console.warn(`Failed to fetch uptime for ${uuid}: ${response.status}`);
      return null;
    }

    const data = await response.json() as TraditionalApiResponse;

    if (data.status === 'success' && data.data && data.data.length > 0) {
      // 返回最新的 uptime 值（秒）
      return data.data[0].uptime;
    }

    return null;
  } catch (error) {
    console.warn(`Error fetching uptime for ${uuid}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // 1) 使用 RPC2 获取节点与最新状态
    const nodesResp = await rpcGetNodes();
    const nodesArray: RpcNode[] = Array.isArray(nodesResp)
      ? nodesResp
      : Object.values(nodesResp || {});

    const uuids = nodesArray.map(n => n.uuid).filter(Boolean);
    const latestMap = await rpcGetNodesLatestStatus(uuids);

    // 2) 并行获取所有节点的 uptime 数据
    const uptimePromises = uuids.map(async (uuid) => {
      const uptime = await getNodeUptime(uuid);
      return { uuid, uptime };
    });

    const uptimeResults = await Promise.all(uptimePromises);
    const uptimeMap = new Map(
      uptimeResults.map(result => [result.uuid, result.uptime])
    );

    // 3) 映射输出结构
    const enriched = nodesArray.map((node) => {
      const last = latestMap?.[node.uuid] as RpcNodeStatus | undefined;
      const consideredOnline = Boolean(last?.online);

      // 判断 IP 地址存在性（不显示具体地址，只判断是否存在）
      const hasIPv4 = Boolean(node.ipv4 && node.ipv4.trim() !== '');
      const hasIPv6 = Boolean(node.ipv6 && node.ipv6.trim() !== '');

      const memTotalKiB = Math.round((last?.ram_total ?? node.mem_total ?? 0) / 1024);
      const memUsedKiB = Math.round((last?.ram ?? 0) / 1024);
      const swapTotalKiB = Math.round((last?.swap_total ?? node.swap_total ?? 0) / 1024);
      const swapUsedKiB = Math.round((last?.swap ?? 0) / 1024);
      const diskTotalMiB = Math.round((last?.disk_total ?? node.disk_total ?? 0) / (1024 * 1024));
      const diskUsedMiB = Math.round((last?.disk ?? 0) / (1024 * 1024));

      // 规范化类型显示
      const normalizedType = normalizeVirtualizationLabel(node.virtualization, node.arch);

      return {
        name: node.name || node.uuid,
        alias: node.group || '',
        type: normalizedType,
        location: node.region || node.group || '',
        online: consideredOnline,
        online4: consideredOnline && hasIPv4,
        online6: consideredOnline && hasIPv6,
        uptime: uptimeMap.get(node.uuid) ? `${uptimeMap.get(node.uuid)}s` : '',
        load_1: last?.load ?? 0,
        load_5: last?.load5 ?? 0,
        load_15: last?.load15 ?? 0,
        // RPC2 负载记录结构为扁平：net_out/net_in 为速率；net_total_* 为累计
        network_rx: last?.net_in ?? 0,
        network_tx: last?.net_out ?? 0,
        network_in: last?.net_total_down ?? 0,
        network_out: last?.net_total_up ?? 0,
        cpu: last?.cpu ?? 0,
        memory_total: memTotalKiB,
        memory_used: memUsedKiB,
        swap_total: swapTotalKiB,
        swap_used: swapUsedKiB,
        hdd_total: diskTotalMiB,
        hdd_used: diskUsedMiB,
        weight: node.weight ?? 0,
      };
    });

    const resp = {
      updated: Math.floor(Date.now() / 1000),
      servers: enriched,
    };

    return json(resp, { cacheControl: CachePolicy.PublicFast });
  } catch (error) {
    console.error('API proxy error:', error);
    return jsonError('Failed to fetch server status', 500, { cacheControl: CachePolicy.NoCache });
  }
}