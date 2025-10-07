import { useQuery } from '@tanstack/react-query';
import { config } from '@/lib/config';

interface PublicResponse {
  status: string;
  message: string;
  data?: {
    sitename?: string;
    description?: string;
    theme?: string;
    theme_settings?: Record<string, unknown> | null;
  };
}

export const usePublic = () => {
  return useQuery<PublicResponse>({
    queryKey: config.queryKeys.publicInfo,
    queryFn: async () => {
      const res = await fetch(config.api.public, { next: { revalidate: 5 } });
      if (!res.ok) throw new Error('Failed to load public settings');
      return res.json();
    },
    staleTime: config.refresh.publicStaleMs,
    refetchOnWindowFocus: false,
  });
};


