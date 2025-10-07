import { rpcGetVersion } from '@/lib/rpc2';
import { jsonError, jsonSuccess, CachePolicy } from '@/lib/response';

export async function GET() {
  try {
    const data = await rpcGetVersion();
    return jsonSuccess(data, { cacheControl: CachePolicy.PublicMedium });
  } catch (error) {
    console.error('Proxy /api/version error:', error);
    return jsonError('Failed to fetch version', 500);
  }
}


