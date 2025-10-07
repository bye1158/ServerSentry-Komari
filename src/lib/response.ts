// 统一的 API 响应辅助，避免各路由重复设置响应头

interface JsonOptions {
  status?: number;
  headers?: HeadersInit;
  // 允许在各路由自定义缓存策略
  cacheControl?: string | null; // 传 null 可移除默认缓存头
}

const DEFAULT_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 缓存策略的快捷预设
export const CachePolicy = {
  PublicShort: 'public, s-maxage=5, stale-while-revalidate=10',
  PublicMedium: 'public, s-maxage=60, stale-while-revalidate=300',
  PublicFast: 'public, s-maxage=1, stale-while-revalidate=2',
  NoCache: 'no-cache',
} as const;

function buildHeaders(overrides?: HeadersInit, cacheControl?: string | null): HeadersInit {
  const headers = new Headers(DEFAULT_HEADERS);
  if (cacheControl !== null && cacheControl !== undefined) {
    headers.set('Cache-Control', cacheControl);
  }
  if (overrides) {
    const o = new Headers(overrides);
    o.forEach((value, key) => headers.set(key, value));
  }
  return headers;
}

export function json<T>(body: T, options: JsonOptions = {}): Response {
  const { status, headers, cacheControl } = options;
  return Response.json(body, {
    status,
    headers: buildHeaders(headers, cacheControl),
  });
}

export function jsonSuccess<T = unknown>(data: T, options: JsonOptions = {}): Response {
  const payload = { status: 'success', message: '', data } as const;
  return json(payload, options);
}

export function jsonError(message: string, status = 500, options: Omit<JsonOptions, 'status'> = {}): Response {
  const { headers, cacheControl } = options;
  return json({ error: message }, { status, headers, cacheControl });
}


