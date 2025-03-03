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

  const PostContent = await import(`../../(post)/${params.year}/${params.slug}.mdx`);

  return <PostContent.default />;
}
