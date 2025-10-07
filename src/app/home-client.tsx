'use client';

import { useState, Suspense, lazy } from 'react';
import { DashboardStats } from '@/components/dashboard-stats';
import { useRegionData } from '@/hooks/use-region-data';

// 懒加载大的组件
const ServerList = lazy(() => import('@/components/server-list').then(module => ({ default: module.ServerList })));
const RegionSelect = lazy(() => import('@/components/region-filter').then(module => ({ default: module.RegionSelect })));
const RegionGroupView = lazy(() => import('@/components/region-group-view').then(module => ({ default: module.RegionGroupView })));

// 加载中组件
const LoadingServerList = () => (
  <div className="server-grid-container">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 server-grid">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="server-card loading-placeholder skeleton"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  </div>
);

export default function HomeClient() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { regions, regionGroups, isLoading } = useRegionData(selectedRegion);

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-10 content-container">
      <DashboardStats />

      <div className="space-y-6 min-h-[600px]">
        <div className="flex items-center gap-4 min-h-[40px]">
          <h2 className="text-2xl font-bold tracking-tight" suppressHydrationWarning>
            服务器列表
          </h2>

          {/* 地区选择下拉菜单 - 懒加载 */}
          <div className="min-w-[140px]">
            {!isLoading && regions.length > 0 && (
              <Suspense fallback={<div className="h-9 w-[140px] bg-muted/20 rounded-md animate-pulse"></div>}>
                <RegionSelect
                  regions={regions}
                  selectedRegion={selectedRegion}
                  onRegionChange={setSelectedRegion}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* 服务器列表 - 懒加载 */}
        {!isLoading && (
          <div className="animate-fade-in server-grid-container">
            <Suspense fallback={<LoadingServerList />}>
              {selectedRegion ? (
                // 选择了特定地区时，只显示该地区的服务器，不显示地区标题
                <RegionGroupView
                  regionGroups={regionGroups}
                  showRegionHeaders={false}
                />
              ) : (
                // 默认状态：显示所有服务器，使用原有ServerList组件
                <ServerList />
              )}
            </Suspense>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && <LoadingServerList />}
      </div>
    </div>
  );
}


