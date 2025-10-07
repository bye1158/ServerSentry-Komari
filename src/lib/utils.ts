import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化时间戳为字符串 - 使用原生Intl.DateTimeFormat
 * @param timestamp Unix时间戳（秒）
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date).replace(/\//g, '-');
}

/**
 * 将秒数格式化为英文简写时长（y/mo/d/h/m/s），自动省略为 0 的单位
 * 近似换算：1月=30天，1年=365天
 */
export function formatDurationEnShort(totalSeconds: number, maxParts = 3): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return '0s';

  const SEC_PER_MIN = 60;
  const SEC_PER_HOUR = 60 * SEC_PER_MIN;
  const SEC_PER_DAY = 24 * SEC_PER_HOUR;
  const SEC_PER_MONTH = 30 * SEC_PER_DAY;
  const SEC_PER_YEAR = 365 * SEC_PER_DAY;

  let remaining = Math.floor(totalSeconds);
  const years = Math.floor(remaining / SEC_PER_YEAR); remaining -= years * SEC_PER_YEAR;
  const months = Math.floor(remaining / SEC_PER_MONTH); remaining -= months * SEC_PER_MONTH;
  const days = Math.floor(remaining / SEC_PER_DAY); remaining -= days * SEC_PER_DAY;
  const hours = Math.floor(remaining / SEC_PER_HOUR); remaining -= hours * SEC_PER_HOUR;
  const minutes = Math.floor(remaining / SEC_PER_MIN); remaining -= minutes * SEC_PER_MIN;
  const seconds = remaining;

  const parts: string[] = [];
  if (years) parts.push(`${years}y`);
  if (months) parts.push(`${months}mo`);
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  const limited = parts.slice(0, Math.max(1, maxParts));
  return limited.join(' ');
}

/**
 * 格式化流量数据 - 使用原生Intl.NumberFormat
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的流量
 */
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  const formatter = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });

  return `${formatter.format(value)} ${sizes[i]}`;
};

/**
 * 格式化百分比
 * @param value 值
 * @param total 总量
 * @returns 百分比整数（0-100）
 */
export const formatPercent = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * 格式化网络速率数据 - 使用原生Intl.NumberFormat
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的速率
 */
export const formatSpeed = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 B/s';

  const k = 1024;
  const sizes = ['B/s', 'K/s', 'M/s', 'G/s', 'T/s', 'P/s', 'E/s', 'Z/s', 'Y/s'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  const formatter = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });

  return `${formatter.format(value)} ${sizes[i]}`;
};

/**
 * 创建 CPU 格式化函数，默认保留 0-1 位小数
 */
export function createCpuFormatter(locale: string = 'zh-CN', maximumFractionDigits: number = 1) {
  const nf = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
  return (val: number) => nf.format(val);
}

/**
 * 将 KiB 数值格式化为带单位的字符串
 */
export const formatKiB = (kib: number, decimals = 1): string => {
  return formatBytes(kib * 1024, decimals);
};

/**
 * 将 MiB 数值格式化为带单位的字符串
 */
export const formatMiB = (mib: number, decimals = 1): string => {
  return formatBytes(mib * 1024 * 1024, decimals);
};

/**
 * 创建 SWAP 专用格式化函数
 * - 当 totalKiB 为 0 时：valueKiB 为 0 显示 "未配置"，否则按 KiB 正常格式化
 * - 当 totalKiB > 0 时：统一按 KiB 正常格式化
 */
export function createSwapFormatter(totalKiB: number) {
  const hasSwap = totalKiB > 0;
  return (valueKiB: number) => {
    if (!hasSwap) {
      return valueKiB === 0 ? '未配置' : formatKiB(valueKiB);
    }
    return formatKiB(valueKiB);
  };
}