import { Posts } from "./posts";
import { getPosts } from "./get-posts";

export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();
  return (
    <div>
      <p className="text-gray-700 dark:text-gray-300 text-base mb-6">
        Builder, marketer, learner.
      </p>
      <Posts posts={posts} />
    </div>
  );
}