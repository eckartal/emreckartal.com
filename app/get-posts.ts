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
    const viewsRes = await fetch('https://emreckartal.com/api/view', { 
      next: { revalidate: 60 },
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!viewsRes.ok) {
      throw new Error(`Failed to fetch views: ${viewsRes.statusText}`);
    }

    const views = await viewsRes.json();

    // Validate views data
    if (typeof views !== 'object') {
      throw new Error('Invalid views data format');
    }

    const posts = postsData.posts.map((post): Post => {
      const viewCount = typeof views[post.id] === 'number' ? views[post.id] : 0;
      return {
        ...post,
        views: viewCount,
        viewsFormatted: new Intl.NumberFormat('en-US').format(viewCount),
      };
    });
    return posts;
  } catch (error) {
    console.error('Error fetching post views:', error);
    // Return posts without views if API call fails
    return postsData.posts.map((post): Post => ({
      ...post,
      views: 0,
      viewsFormatted: '0',
    }));
  }
};