import type { Metadata } from "next";
import "./globals.css";
import { config } from "@/lib/config";
import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { HeadTitle } from "@/components/head-title";

export const metadata: Metadata = {
  title: config.siteTitle,
  description: config.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        {/* API预连接优化 */}
        <link rel="preconnect" href={config.api.servers} />
        {/* 字体预加载 */}
        <link rel="preload" href="/fonts/HarmonyOS_Sans_SC_Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* 关键CSS内联 - 防止FOUC和CLS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *{box-sizing:border-box}
            body{margin:0;background:#ffffff;color:#0a0a0a;font-family:'HarmonyOS Sans SC',ui-sans-serif,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;overscroll-behavior:none}
            html.dark body{background:#0a0a0a;color:#fafafa}
            /* 字体由 styles/fonts.css 提供（font-display: swap），避免阻塞首屏文本绘制 */
            .min-h-screen{min-height:100vh}
            .bg-background{background-color:var(--background)}
            .text-foreground{color:var(--foreground)}
            .font-sans{font-family:'HarmonyOS Sans SC',ui-sans-serif,system-ui,-apple-system,sans-serif}
            .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            :root{--background:#ffffff;--foreground:#0a0a0a;--card:#ffffff;--border:#e5e5e5;--muted:#f5f5f5}
            .dark{--background:#0a0a0a;--foreground:#fafafa;--card:#0a0a0a;--border:#262626;--muted:#1a1a1a}
            .flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-between{justify-content:space-between}
            .space-x-2>*+*{margin-left:0.5rem}.space-y-6>*+*{margin-top:1.5rem}
            .text-xl{font-size:1.25rem}.text-2xl{font-size:1.5rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.font-bold{font-weight:700}.font-medium{font-weight:500}
            .tracking-tight{letter-spacing:-0.025em}
            .px-4{padding-left:1rem;padding-right:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}
            .w-full{width:100%}.max-w-7xl{max-width:80rem}.h-14{height:3.5rem}.sticky{position:sticky}.top-0{top:0}.z-50{z-index:50}
            /* LCP优化 - 立即显示标题 */
            .dashboard-title{min-height:48px;line-height:1.2;contain:layout;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif}
            .dashboard-title h2{font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:1.875rem;line-height:2.25rem;font-weight:700;letter-spacing:-0.025em;margin:0}
          `
        }} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <HeadTitle />
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
