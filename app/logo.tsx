"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* eslint-disable @next/next/no-html-link-for-pages */
export function Logo() {
  return (
    <h1 className="font-bold text-2xl mb-0 grow">
      <Link href="/" className="text-black dark:text-white no-underline">
        Emre Can Kartal
      </Link>
    </h1>
  );
}
/* eslint-enable @next/next/no-html-link-for-pages */
