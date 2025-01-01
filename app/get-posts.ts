import postsData from "./posts.json";
import { redis } from "./redis";
import commaNumber from "comma-number";

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
};

// shape of the HSET in redis
type Views = {
  [key: string]: string;
};

export const getPosts = async () => {
  let allViews: Views = {};
  try {
    allViews = (await redis.hgetall("views")) || {};
  } catch (error) {
    console.error('Failed to fetch views:', error);
    // Continue with zero views rather than crashing
  }

  const posts = postsData.posts.map((post): Post => {
    const views = Number(allViews?.[post.id] ?? 0);
    return {
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    };
  });

  return posts;
};