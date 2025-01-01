"use client";

import { MDXProvider } from '@mdx-js/react';
import { Header } from './header';
import type { Post } from "@/app/get-posts";
import { useEffect } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
import useSWR, { mutate } from 'swr';

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

  // Fetch view count
  const { data: viewCounts } = useSWR<Record<string, number>>('/api/view', async () => {
    const res = await fetch('/api/view', {
      headers: { 'Cache-Control': 'no-store' }
    });
    if (!res.ok) throw new Error('Failed to fetch views');
    return res.json();
  }, {
    refreshInterval: 5000,
    revalidateOnFocus: false
  });

  useEffect(() => {
    const incrementViews = async () => {
      try {
        const res = await fetch(`/api/view?id=${postId}&incr=1`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to increment views');
        }

        // Revalidate the view counts
        mutate('/api/view');
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    if (postId) {
      incrementViews();
    }
  }, [postId]);

  const post = posts.find(p => p.id === postId);

  return (
    <MDXProvider components={components}>
      {post && <Header post={post} viewCounts={viewCounts} />}
      {children}
    </MDXProvider>
  );
}