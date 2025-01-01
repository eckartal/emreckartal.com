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
  const { data: viewCounts } = useSWR('/api/view', async () => {
    const res = await fetch('/api/view', {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (!res.ok) throw new Error('Failed to fetch views');
    return res.json();
  }, {
    refreshInterval: 5000,
    dedupingInterval: 2000,
    revalidateOnFocus: false
  });

  useEffect(() => {
    const incrementViews = async () => {
      try {
        const res = await fetch('/api/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug: postId }),
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

  const viewCount = viewCounts?.[postId] || 0;
  const formattedViews = new Intl.NumberFormat('en-US').format(viewCount);

  return (
    <MDXProvider components={components}>
      <div className="max-w-4xl mx-auto px-4 pb-28 pt-1 sm:px-6 md:px-8">
        <Header posts={posts} />
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-500">{formattedViews} views</div>
        </div>
        {children}
      </div>
    </MDXProvider>
  );
}