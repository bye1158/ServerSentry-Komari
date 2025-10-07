'use client';

import { useMemo } from 'react';
import { useServers } from './use-servers';
import { groupServersByRegion, getUniqueRegions } from '@/lib/api';
import type { Server } from '@/types/server';

export const useRegionData = (selectedRegion?: string | null) => {
  const { data, isLoading, error } = useServers();

  const regionData = useMemo(() => {
    if (!data?.servers) {
      return {
        regions: [],
        regionGroups: [],
        filteredServers: [],
        stats: {
          totalRegions: 0,
          serversInSelectedRegion: 0,
        }
      };
    }

    const regions = getUniqueRegions(data.servers);
    const regionGroups = groupServersByRegion(data.servers);

    // 根据选中地区过滤服务器
    let filteredServers: Server[];
    let filteredRegionGroups = regionGroups;

    if (selectedRegion) {
      filteredServers = data.servers.filter(
        server => (server.location || '未知地区') === selectedRegion
      );
      filteredRegionGroups = regionGroups.filter(group => group.region === selectedRegion);
    } else {
      filteredServers = data.servers;
    }

    return {
      regions,
      regionGroups: filteredRegionGroups,
      filteredServers,
      allRegionGroups: regionGroups,
      stats: {
        totalRegions: regions.length,
        serversInSelectedRegion: filteredServers.length,
      }
    };
  }, [data?.servers, selectedRegion]);

  return {
    ...regionData,
    isLoading,
    error,
  };
};