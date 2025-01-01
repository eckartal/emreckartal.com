import postsData from "./posts.json";

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
};

export const getPosts = async () => {
  // Temporarily return posts without views
  const posts = postsData.posts.map((post): Post => {
    return {
      ...post,
      views: 0,
      viewsFormatted: "0",
    };
  });
  return posts;
};