import { A } from "./(post)/components/a";

export function Footer() {
  return (
    <footer className="p-6 pt-3 pb-6 flex text-xs text-center mt-3 dark:text-gray-400 text-gray-500 font-mono">
      <div className="grow text-left">
        Emre Can Kartal (
        <A target="_blank" href="https://twitter.com/eckartal">
          @eckartal
        </A>
        )
      </div>
      <div>
        <A target="_blank" href="https://github.com/rauchg/blog">
          Source
        </A>
      </div>
    </footer>
  );
}
