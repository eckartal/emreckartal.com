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
  
  // Debug information
  console.log('Rendering post header:', post);
  console.log('View counts:', viewCounts);

  return (
    <header className="mb-8">
      <h1 className="font-bold text-3xl mb-2">{post.title}</h1>
      <div className="flex items-center justify-between font-mono text-xs text-gray-500 dark:text-gray-500">
        <div className="flex items-center gap-2">
          <a
            href="https://twitter.com/eckartal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-800 dark:hover:text-gray-400 flex items-center"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="hidden sm:inline ml-1">@eckartal</span>
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