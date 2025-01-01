import postsData from "./posts.json";

export type Post = {
  id: string;
  date: string;
  title: string;
  views: number;
  viewsFormatted: string;
};

export const getPosts = async () => {
  try {
    // Get view counts for all posts
    const viewsRes = await fetch('/api/view', { next: { revalidate: 60 } });
    const views = await viewsRes.json();

    const posts = postsData.posts.map((post): Post => {
      const viewCount = views[post.id] || 0;
      return {
        ...post,
        views: viewCount,
        viewsFormatted: new Intl.NumberFormat('en-US').format(viewCount),
      };
    });
    return posts;
  } catch (error) {
    // Return posts without views if API call fails
    return postsData.posts.map((post): Post => ({
      ...post,
      views: 0,
      viewsFormatted: '0',
    }));
  }
};