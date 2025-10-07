import { NextRequest } from 'next/server';
import { getKomariConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const { baseUrl, apiKey } = getKomariConfig();

    // 构建 WebSocket URL（https -> wss, http -> ws）
    const urlObj = new URL(baseUrl);
    const wsProtocol = urlObj.protocol === 'https:' ? 'wss:' : 'ws:';
    urlObj.protocol = wsProtocol;
    const wsOrigin = urlObj.toString().replace(/\/$/, '');
    const targetWsUrl = `${wsOrigin}/api/rpc2/ws`;

    // 获取查询参数
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // 构建目标 WebSocket URL 和查询参数
    const targetUrl = new URL(targetWsUrl);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    // 如果有 API Key，添加到查询参数中
    if (apiKey) {
      targetUrl.searchParams.set('token', apiKey);
    }

    // 返回重定向到 WebSocket 连接
    return Response.json({
      ws_url: targetUrl.toString(),
      message: 'WebSocket proxy endpoint. Connect to the ws_url for WebSocket RPC2 communication.'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('WebSocket proxy error:', error);
    return Response.json(
      { error: 'Failed to setup WebSocket proxy' },
      { status: 500 }
    );
  }
}

// 处理 CORS 预检请求
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
