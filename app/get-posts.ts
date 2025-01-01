import postsData from "./posts.json";

type PostData = {
  id: string;
  date: string;
  title: string;
  category: string;
};

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
  category?: string;
};

export const getPosts = async () => {
  // Return posts without views during build time
  return (postsData.posts as PostData[]).map((post): Post => ({
    ...post,
    views: 0,
    viewsFormatted: '0',
    category: post.category
  }));
};