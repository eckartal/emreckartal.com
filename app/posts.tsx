"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import useSWR from "swr";
import type { Post } from "@/app/get-posts";

type SortSetting = ["date" | "views", "desc" | "asc"];
const CATEGORIES = ["all", "life", "product", "personal"] as const;
type Category = typeof CATEGORIES[number];

export function Posts({ posts: initialPosts }: { posts: Post[] }) {
  const [sort, setSort] = useState<SortSetting>(["date", "desc"]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const { data: viewCounts } = useSWR<Record<string, number>>("/api/view", async () => {
    const res = await fetch('/api/view', {
      headers: { 'Cache-Control': 'no-store' }
    });
    if (!res.ok) throw new Error('Failed to fetch views');
    return res.json();
  }, {
    refreshInterval: 5000,
    revalidateOnFocus: false
  });

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...initialPosts];
    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (viewCounts) {
      filtered = filtered.map(post => ({
        ...post,
        views: viewCounts[post.id] || post.views || 0,
        viewsFormatted: new Intl.NumberFormat('en-US').format(viewCounts[post.id] || post.views || 0)
      }));
    }

    return filtered.sort((a, b) => {
      if (sort[0] === "date") {
        return sort[1] === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sort[1] === "desc" ? b.views - a.views : a.views - b.views;
      }
    });
  }, [initialPosts, sort, selectedCategory, viewCounts]);

  function sortDate() {
    setSort(sort => [
      "date",
      sort[0] !== "date" || sort[1] === "asc" ? "desc" : "asc",
    ]);
  }

  function sortViews() {
    setSort(sort => [
      sort[0] === "views" && sort[1] === "asc" ? "date" : "views",
      sort[0] !== "views" ? "desc" : sort[1] === "asc" ? "desc" : "asc",
    ]);
  }

  return (
    <Suspense fallback={null}>
      <main className="max-w-2xl font-mono m-auto mb-10 text-sm">
        <div className="mb-4 flex gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                selectedCategory === category
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="border-b border-gray-200 dark:border-[#313131]">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-600 h-9">
            <div className="w-14">
              <button
                onClick={sortDate}
                className={`text-left ${
                  sort[0] === "date" && sort[1] !== "desc"
                    ? "text-gray-700 dark:text-gray-400"
                    : ""
                }`}
              >
                date
                {sort[0] === "date" && sort[1] === "asc" && "↑"}
              </button>
            </div>
            <div className="w-16 ml-4">category</div>
            <div className="grow ml-4">title</div>
            <div className="w-12 text-right">
              <button
                onClick={sortViews}
                className={sort[0] === "views" ? "text-gray-700 dark:text-gray-400" : ""}
              >
                views
                {sort[0] === "views" ? (sort[1] === "asc" ? "↑" : "↓") : ""}
              </button>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-gray-200 dark:divide-[#313131]">
          {filteredAndSortedPosts.map(post => (
            <li key={post.id} className="group hover:bg-gray-100 dark:hover:bg-[#242424]">
              <div className="flex items-center py-3">
                <div className="w-14 text-gray-500">
                  {post.date.split('-')[0]}
                </div>
                <div className="w-16 ml-4 text-gray-500">
                  <button
                    onClick={() => setSelectedCategory(post.category as Category)}
                    className="hover:text-gray-800 dark:hover:text-gray-400"
                  >
                    {post.category}
                  </button>
                </div>
                <Link
                  href={`/2024/${post.id}`}
                  className="grow ml-4 text-gray-800 dark:text-gray-300 hover:underline"
                >
                  {post.title}
                </Link>
                <div className="w-12 text-right text-gray-500 tabular-nums ml-4">
                  {post.viewsFormatted}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </Suspense>
  );
}