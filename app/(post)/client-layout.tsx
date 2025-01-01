"use client";

import { MDXProvider } from '@mdx-js/react';
import { Header } from './header';
import type { Post } from "@/app/get-posts";

const components = {
  // Your custom components here
};

export function ClientLayout({ 
  children, 
  posts 
}: { 
  children: React.ReactNode;
  posts: Post[];
}) {
  return (
    <MDXProvider components={components}>
      <div className="max-w-4xl mx-auto px-4 pb-28 pt-24 sm:px-6 md:px-8">
        <Header posts={posts} />
        {children}
      </div>
    </MDXProvider>
  );
} 