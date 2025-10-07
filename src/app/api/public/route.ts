import { rpcGetPublicInfo } from '@/lib/rpc2';
import { jsonError, jsonSuccess, CachePolicy } from '@/lib/response';

export async function GET() {
  try {
    const data = await rpcGetPublicInfo();
    return jsonSuccess(data, { cacheControl: CachePolicy.PublicShort });
  } catch (error) {
    console.error('Proxy /api/public error:', error);
    return jsonError('Failed to fetch public settings', 500);
  }
}


