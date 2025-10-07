import { getKomariConfig } from '@/lib/config';
export interface JsonRpcRequest<TParams = unknown> {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: TParams;
}

export interface JsonRpcSuccess<T = unknown> {
  jsonrpc: '2.0';
  id: string | number | null;
  result: T;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export interface JsonRpcFailure {
  jsonrpc: '2.0';
  id: string | number | null;
  error: JsonRpcError;
}

export type JsonRpcResponse<T = unknown> = JsonRpcSuccess<T> | JsonRpcFailure;

// ===== RPC2 实体类型（依据 rpc.md） =====
export interface Client {
  uuid: string;
  token?: string;
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
  expired_at?: string;
  group?: string;
  tags?: string;
  hidden?: boolean;
  traffic_limit?: number;
  traffic_limit_type?: 'sum' | 'max' | 'min' | 'up' | 'down' | string;
  created_at?: string;
  updated_at?: string;
}

export interface VersionInfo {
  version: string;
  hash: string;
}

export interface PublicInfo {
  allow_cors?: boolean;
  custom_body?: string;
  custom_head?: string;
  description?: string;
  disable_password_login?: boolean;
  oauth_enable?: boolean;
  oauth_provider?: string;
  ping_record_preserve_time?: number;
  private_site?: boolean;
  record_enabled?: boolean;
  record_preserve_time?: number;
  sitename?: string;
  theme?: string;
  theme_settings?: Record<string, unknown>;
}

export interface NodeStatus {
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

// 已裁剪未使用的账户信息类型

export interface StatusRecord {
  client: string;
  time: string;
  cpu?: number;
  gpu?: number;
  ram?: number;
  ram_total?: number;
  swap?: number;
  swap_total?: number;
  load?: number;
  load5?: number;
  load15?: number;
  temp?: number;
  disk?: number;
  disk_total?: number;
  net_in?: number;
  net_out?: number;
  net_total_up?: number;
  net_total_down?: number;
  process?: number;
  connections?: number;
  connections_udp?: number;
}

// 已裁剪未使用的最近状态响应类型

// 已裁剪未使用的记录/Ping 相关类型

/**
 * JSON-RPC2 POST 客户端
 */
export async function callRpc<T = unknown, TParams = unknown>(
  baseUrl: string,
  method: string,
  params?: TParams,
  init?: RequestInit & { apiKey?: string }
): Promise<T> {
  const url = baseUrl.endsWith('/') ? `${baseUrl}api/rpc2` : `${baseUrl}/api/rpc2`;
  const req: JsonRpcRequest<TParams> = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 添加自定义请求头
  if (init?.headers) {
    Object.entries(init.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value;
      }
    });
  }

  // 添加 API Key 鉴权
  if (init?.apiKey) {
    headers['Authorization'] = `Bearer ${init.apiKey}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(req),
    next: (init as RequestInit & { next?: unknown })?.next,
  } as RequestInit);

  if (!res.ok) {
    throw new Error(`RPC2 HTTP ${res.status}`);
  }
  const payload = (await res.json()) as JsonRpcResponse<T>;
  if ('error' in payload) {
    throw new Error(`RPC2 ${method} error ${payload.error.code}: ${payload.error.message}`);
  }
  return (payload as JsonRpcSuccess<T>).result;
}

/**
 * 获取 Komari 基础配置
 */
export { getKomariConfig } from '@/lib/config';

// ===== RPC2 方法封装 =====
// 已裁剪未使用的通用 RPC 方法（rpc.methods / rpc.help / rpc.ping）

export function rpcGetVersion() {
  const { baseUrl, apiKey } = getKomariConfig();
  return callRpc<VersionInfo>(baseUrl, 'common:getVersion', undefined, { apiKey });
}

export function rpcGetPublicInfo() {
  const { baseUrl, apiKey } = getKomariConfig();
  return callRpc<PublicInfo>(baseUrl, 'common:getPublicInfo', undefined, { apiKey });
}

export function rpcGetNodes(uuid?: string) {
  const { baseUrl, apiKey } = getKomariConfig();
  type NodesResp = Client | Record<string, Client>;
  const params = uuid ? { uuid } : undefined;
  return callRpc<NodesResp>(baseUrl, 'common:getNodes', params, { apiKey });
}

export function rpcGetNodesLatestStatus(uuids?: string[]) {
  const { baseUrl, apiKey } = getKomariConfig();
  const params = Array.isArray(uuids) && uuids.length > 0 ? { uuids } : undefined;
  return callRpc<Record<string, NodeStatus>>(baseUrl, 'common:getNodesLatestStatus', params, { apiKey });
}
// 已裁剪未使用的账户/记录相关 RPC 包装方法


