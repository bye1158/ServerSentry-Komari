'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-medium">页面未找到</h2>
          <p className="text-muted-foreground">
            您请求的页面不存在或已被移除
          </p>
          <div className="pt-4">
            <Link 
              href="/"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              返回首页
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
