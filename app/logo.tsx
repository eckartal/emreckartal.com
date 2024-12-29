"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Logo() {
  return (
    <h1 className="font-bold text-2xl mb-0 grow">
      <span className="text-black dark:text-white no-underline">
        <Link href="/">
          Emre Can Kartal
        </Link>
      </span>
    </h1>
  );
}
