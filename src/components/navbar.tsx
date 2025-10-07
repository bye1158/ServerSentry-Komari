'use client';

import React from 'react';
import { config } from '@/lib/config';
import { useTheme } from 'next-themes';

// === 内联 SVG 图标 ===
const MoonIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MonitorIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const Navbar: React.FC = React.memo(function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [siteTitle, setSiteTitle] = React.useState<string>(config.siteTitle);
  const [openMenu, setOpenMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    const controller = new AbortController();
    fetch('/api/public', { signal: controller.signal })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        const title = json?.data?.sitename;
        if (typeof title === 'string' && title.trim()) setSiteTitle(title);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // 点击外部关闭菜单
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    if (openMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const getIcon = () => theme === 'system' ? <MonitorIcon /> : resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 navbar-glass">
        <div className="flex h-14 items-center justify-center">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold">
              <span className="text-xl">{siteTitle}</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 navbar-glass backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex h-14 items-center justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* 左侧标题 */}
          <div className="flex items-center space-x-2 font-bold">
            <span className="text-xl select-none">{siteTitle}</span>
          </div>

          {/* 右侧主题切换菜单 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              {getIcon()}
              {/* 移除文字部分 */}
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50">
                <div
                  onClick={() => { setTheme('light'); setOpenMenu(false); }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  浅色模式
                </div>
                <div
                  onClick={() => { setTheme('dark'); setOpenMenu(false); }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  深色模式
                </div>
                <div
                  onClick={() => { setTheme('system'); setOpenMenu(false); }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  跟随系统
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});
