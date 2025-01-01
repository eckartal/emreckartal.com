"use client";

import { MDXProvider } from '@mdx-js/react';
import { Header } from './header';
import type { Post } from "@/app/get-posts";
import { useEffect } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';

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
  const segments = useSelectedLayoutSegments();
  const postId = segments?.[segments.length - 1];

  useEffect(() => {
    if (postId) {
      // Increment view count
      fetch(`/api/view?id=${postId}&incr=1`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      }).catch(console.error);
    }
  }, [postId]);

  return (
    <MDXProvider components={components}>
      <div className="max-w-4xl mx-auto px-4 pb-28 pt-1 sm:px-6 md:px-8">
        <Header posts={posts} />
        {children}
      </div>
    </MDXProvider>
  );
}