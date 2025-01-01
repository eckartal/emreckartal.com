import postsData from "./posts.json";

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
};

export const getPosts = async () => {
  // Return posts without views during build time
  return postsData.posts.map((post): Post => ({
    ...post,
    views: 0,
    viewsFormatted: '0',
  }));
};