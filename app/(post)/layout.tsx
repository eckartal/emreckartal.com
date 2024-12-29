import { format } from 'date-fns';

export default function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { date: string };
}) {
  const date = new Date();
  const formattedDate = format(date, 'd MMMM yyyy');

  return (
    <article className="prose dark:prose-invert">
      <div className="mb-8 text-sm text-gray-500">
        <span>@eckartal</span>
        <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
        <time dateTime={format(date, 'yyyy-MM-dd')}>{formattedDate}</time>
      </div>
      {children}
    </article>
  );
}
