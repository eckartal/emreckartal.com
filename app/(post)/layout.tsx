import { getPosts } from '@/app/get-posts';
import { ClientLayout } from './client-layout';

export default async function PostLayout({ children }) {
  const posts = await getPosts();

  return (
    <ClientLayout posts={posts}>
      {children}
    </ClientLayout>
  );
}