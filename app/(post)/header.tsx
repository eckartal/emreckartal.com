"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import useSWR from "swr";

export type Post = {
  id: string;
  date: string;
  title: string;
  category?: string;
  views: number;
};

function formatPostDate(date: string) {
  try {
    const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
    const dateObj = new Date(year, month - 1, day);
    const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
    return `${monthName} ${day}, ${year}`;
  } catch {
    return date;
  }
}

function formatRelativeTime(dateStr: string) {
  try {
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
    const publishDate = new Date(year, month - 1, day);
    const currentDate = new Date('2025-01-01T17:37:34+08:00');
    
    const diff = currentDate.getTime() - publishDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  } catch {
    return '';
  }
}

export function Header({ posts }: { posts: Post[] }) {
  const segments = useSelectedLayoutSegments();
  const postId = segments?.[segments.length - 1];
  const post = posts.find(post => post.id === postId);

  const { data: viewCounts } = useSWR("/api/view", async () => {
    try {
      const res = await fetch('/api/view', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) throw new Error('Failed to fetch views');
      return res.json();
    } catch (error) {
      console.error('Error fetching views:', error);
      return {};
    }
  }, {
    refreshInterval: 5000,
    dedupingInterval: 2000,
    revalidateOnFocus: false
  });

  if (!post) return null;

  const viewCount = viewCounts?.[post.id] || post.views || 0;
  const formattedViews = new Intl.NumberFormat('en-US').format(viewCount);

  return (
    <header className="mb-8">
      <h1 className="font-bold text-3xl mb-2">{post.title}</h1>
      <div className="flex items-center justify-between font-mono text-xs text-gray-500 dark:text-gray-500">
        <div className="flex items-center gap-2">
          <a
            href="https://twitter.com/eckartal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-400"
          >
            @eckartal
          </a>
          {post.category && (
            <>
              <span>•</span>
              <span className="text-gray-700 dark:text-gray-300">
                {post.category}
              </span>
            </>
          )}
          <span>•</span>
          <time dateTime={post.date} className="tabular-nums">
            {formatPostDate(post.date)}
          </time>
        </div>
        <div className="tabular-nums">{formattedViews} views</div>
      </div>
    </header>
  );
}