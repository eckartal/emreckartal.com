"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

type UpcomingTopic = {
  id: string;
  title: string;
  upvotes: number;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const DEFAULT_TOPICS: UpcomingTopic[] = [
  { id: 'seo-llm', title: 'SEO for LLMs', upvotes: 0 },
  { id: 'marketing-opensource', title: 'Marketing for open-source projects', upvotes: 0 },
  { id: 'anthropologist-guide', title: "A marketer's guide from an anthropologist", upvotes: 0 },
  { id: 'scaling-tools', title: 'Top tools that I scale my effort', upvotes: 0 },
  { id: 'marketing-anthropology', title: 'Marketers, learn anthropology', upvotes: 0 },
];

export function UpcomingTopics() {
  const [votedTopics, setVotedTopics] = useState<Set<string>>(new Set());

  // Load voted topics from localStorage on mount
  useEffect(() => {
    const voted = localStorage.getItem('votedTopics');
    if (voted) {
      setVotedTopics(new Set(JSON.parse(voted)));
    }
  }, []);

  const { data: topics = DEFAULT_TOPICS, mutate } = useSWR<UpcomingTopic[]>("/api/upcoming", fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false,
  });

  const handleUpvote = async (id: string) => {
    if (votedTopics.has(id)) return;

    try {
      const res = await fetch('/api/upcoming/upvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to upvote');
      
      // Update voted topics in localStorage
      const newVotedTopics = new Set(votedTopics).add(id);
      localStorage.setItem('votedTopics', JSON.stringify([...newVotedTopics]));
      setVotedTopics(newVotedTopics);
      
      // Refresh the data
      mutate();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  // Ensure topics is treated as an array and handle potential undefined
  const topicsArray = Array.isArray(topics) ? topics : DEFAULT_TOPICS;
  const sortedTopics = [...topicsArray].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <section className="max-w-2xl font-mono m-auto mb-10">
      <h2 className="text-xl font-bold mb-4">Upcoming Topics</h2>
      <div className="space-y-2">
        {sortedTopics.map((topic) => (
          <div key={topic.id} className="flex items-center group">
            <div className="flex items-center mr-2">
              <button
                onClick={() => handleUpvote(topic.id)}
                disabled={votedTopics.has(topic.id)}
                className={`flex items-center text-xs ${
                  votedTopics.has(topic.id)
                    ? 'text-green-500'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-400'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={votedTopics.has(topic.id) ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5M12 5l7 7M12 5l-7 7" />
                </svg>
              </button>
              <span className="tabular-nums text-[10px] ml-0.5 w-4 text-center">{topic.upvotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs">{topic.title}</span>
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                upcoming
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
