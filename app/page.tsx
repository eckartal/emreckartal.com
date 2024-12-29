import { Posts } from "./posts";
import { getPosts } from "./get-posts";

export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <div className="mb-8 -mt-6">
        <p className="text-gray-600 dark:text-gray-400 mb-1 text-lg">
          Builder, marketer, learner.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-mono">Location:</span>
          <span className="flex items-center gap-1 whitespace-nowrap overflow-x-auto pb-1">
            <span title="Taiwan">🇹🇼 Taiwan</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">←</span>
            <span className="opacity-50" title="Thailand">🇹🇭 Thai</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">←</span>
            <span className="opacity-50" title="Singapore">🇸🇬 SG</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">←</span>
            <span className="opacity-50" title="Turkiye">🇹🇷 TR</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">←</span>
            <span className="opacity-50" title="Japan">🇯🇵 JP</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">←</span>
            <span className="opacity-50" title="Vietnam">🇻🇳 VN</span>
            <span className="text-gray-300 dark:text-gray-600 mx-1">←</span>
            <span className="opacity-50" title="Sri Lanka">🇱🇰 LK</span>
          </span>
        </div>
      </div>
      <Posts posts={posts} />
    </>
  );
}
