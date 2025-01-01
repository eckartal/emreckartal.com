"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import type { Post } from "@/app/get-posts";

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

export function Header({ 
  post,
  viewCounts
}: { 
  post: Post;
  viewCounts?: Record<string, number>;
}) {
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