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

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string };
}) {
  const posts = await getPosts();
  const post = posts.find(
    (p) => p.id === params.slug && p.date.startsWith(params.year)
  );

  if (!post) {
    notFound();
  }

  // Dynamic import of the MDX file
  const PostContent = await import(`../../(post)/${params.year}/${params.slug}.mdx`);

  return <PostContent.default />;
}
