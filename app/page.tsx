import { getPosts } from './get-posts';
import { Posts } from './posts';
import { UpcomingTopics } from './components/upcoming-topics';

export const revalidate = 60;

export default async function Page() {
  const posts = await getPosts();

  return (
    <main>
      <Posts posts={posts} />
      <UpcomingTopics />
    </main>
  );
}