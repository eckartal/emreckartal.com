import { notFound } from 'next/navigation';
import { getPosts } from '../../get-posts';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    year: post.date.split('-')[0],
    slug: post.id,
  }));
}

export default async function PostPage(props: {
  params: Promise<{ year: string; slug: string }>;
}) {
  const params = await props.params;
  const posts = await getPosts();
  const post = posts.find(
    (p) => p.id === params.slug && p.date.startsWith(params.year)
  );

  if (!post) {
    notFound();
  }

  // Try first with the page.mdx structure
  let PostContent;
  try {
    PostContent = await import(`../../(post)/${params.year}/${params.slug}/page.mdx`);
  } catch (error) {
    // If that fails, try with direct .mdx file
    try {
      PostContent = await import(`../../(post)/${params.year}/${params.slug}.mdx`);
    } catch (err) {
      console.error('Failed to import post content:', err);
      notFound();
    }
  }

  return <PostContent.default />;
}
