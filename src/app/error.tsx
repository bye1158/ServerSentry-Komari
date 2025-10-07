'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">出错了</h2>
      <p className="text-muted-foreground">抱歉，加载过程中出现了错误。</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        重试
      </button>
    </div>
  );
} 