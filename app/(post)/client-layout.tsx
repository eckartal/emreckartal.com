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
  
  // Extract post ID from segments
  let postId;
  
  // Check the posts array to find which post matches the current URL segments
  const currentPost = posts.find(post => {
    const year = post.date.split('-')[0];
    // More robust check - both by ID in the URL or by checking if it's in the segments array
    return segments && (
      segments.includes(post.id) || 
      (segments.includes(year) && segments[segments.indexOf(year) + 1] === post.id)
    );
  });
  
  // Use the post ID from the found post
  postId = currentPost?.id;
  
  console.log('Current URL segments:', segments);
  console.log('Detected post ID:', postId);
  console.log('Current post:', currentPost);

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
        console.log('Incrementing views for post:', postId);
        const res = await fetch(`/api/view?id=${postId}&incr=1`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store'
          }
        });

        if (!res.ok) {
          const error = await res.json();
          console.error('View increment response error:', error);
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