'use client';

import dynamic from 'next/dynamic';

const HomeClient = dynamic(() => import('./home-client'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-10 content-container">
      <div className="stats-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[100px] rounded-md bg-muted/30 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-6 min-h-[600px]">
        <div className="flex items-center gap-4 min-h-[40px]">
          <h2 className="text-2xl font-bold tracking-tight">服务器列表</h2>
          <div className="h-9 w-[140px] bg-muted/20 rounded-md" />
        </div>
        <div className="server-grid-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 server-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="server-card loading-placeholder skeleton" />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});

export default HomeClient;


