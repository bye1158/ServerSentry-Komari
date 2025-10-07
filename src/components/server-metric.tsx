'use client';

import React from 'react';
import { formatPercent } from '@/lib/utils';

interface ServerMetricProps {
  label: string;
  value: number;
  total: number;
  unit?: string;
  formatter?: (value: number) => string;
}

const colors = {
  safe: {
    gradient: 'from-emerald-400 via-emerald-500 to-cyan-500',
    glow: 'shadow-emerald-500/30',
    text: 'text-emerald-400 dark:text-[var(--color-green)]'
  },
  warning: {
    gradient: 'from-amber-400 via-amber-500 to-orange-500',
    glow: 'shadow-amber-500/30',
    text: 'text-amber-400 dark:text-[var(--color-amber)]'
  },
  danger: {
    gradient: 'from-rose-400 via-rose-500 to-red-500',
    glow: 'shadow-rose-500/30',
    text: 'text-rose-400 dark:text-[var(--color-red)]'
  },
  disabled: {
    gradient: 'from-slate-400 via-slate-500 to-slate-600',
    glow: 'shadow-slate-500/30',
    text: 'text-slate-400 dark:text-slate-500'
  }
};

export const ServerMetric: React.FC<ServerMetricProps> = React.memo(function ServerMetric({
  label,
  value,
  total,
  unit = '',
  formatter = (val: number) => val.toString(),
}) {
  const percent = formatPercent(value, total);
  const formattedValue = formatter(value);
  const formattedTotal = formatter(total);

  // 检查未配置状态（例如SWAP为0）
  const isUnconfigured = formattedValue === "未配置";

  // 根据百分比确定颜色主题 - 使用 useMemo 缓存计算
  const colorTheme = React.useMemo(() => {
    if (isUnconfigured) {
      return colors.disabled;
    } else if (percent >= 90) {
      return colors.danger;
    } else if (percent >= 70) {
      return colors.warning;
    } else {
      return colors.safe;
    }
  }, [percent, isUnconfigured]);

  // 缓存样式字符串
  const progressStyle = React.useMemo(() => ({
    width: isUnconfigured ? "0%" : `${percent}%`
  }), [percent, isUnconfigured]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          {!isUnconfigured && (
            <span
              className={`text-xs font-semibold ${colorTheme.text}`}
              suppressHydrationWarning
            >
              {percent}%
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground" suppressHydrationWarning>
          {isUnconfigured ? "未配置" : `${formattedValue}${unit} / ${formattedTotal}${unit}`}
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary/40 border border-border/30">
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${colorTheme.gradient} rounded-full transition-all duration-300 ease-out`}
          style={progressStyle}
        >
          <div className="absolute inset-0 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
});
ServerMetric.displayName = 'ServerMetric';