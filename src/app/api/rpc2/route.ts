import { NextRequest } from 'next/server';
import { getKomariConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { baseUrl, apiKey } = getKomariConfig();

    // 解析前端发送的 JSON-RPC2 请求
    const body = await request.json();

    // 验证 JSON-RPC2 格式
    if (!body.jsonrpc || body.jsonrpc !== '2.0' || !body.method) {
      return Response.json(
        {
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request'
          }
        },
        { status: 400 }
      );
    }

    // 构建目标 URL
    const targetUrl = baseUrl.endsWith('/') ? `${baseUrl}api/rpc2` : `${baseUrl}/api/rpc2`;

    // 准备请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 添加 API Key 鉴权
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // 转发请求到 Komari 服务器
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return Response.json(
        {
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32603,
            message: `Upstream error: ${response.status} ${response.statusText}`
          }
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return Response.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('RPC2 proxy error:', error);
    return Response.json(
      {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal error'
        }
      },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
