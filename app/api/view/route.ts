import { redis } from "@/app/redis";
import postsData from "@/app/posts.json";
import commaNumber from "comma-number";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") ?? null;

    // Return all views if no ID is provided
    if (id === null) {
      const views = await redis.hgetall("views");
      // Convert string values to numbers
      const parsedViews = Object.entries(views || {}).reduce((acc, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {} as Record<string, number>);
      return NextResponse.json(parsedViews);
    }

    const post = postsData.posts.find(post => post.id === id);

    if (post == null) {
      return NextResponse.json(
        {
          error: {
            message: "Unknown post",
            code: "UNKNOWN_POST",
          },
        },
        { status: 400 }
      );
    }

    if (url.searchParams.get("incr") != null) {
      const views = await redis.hincrby("views", id, 1);
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      });
    } else {
      const views = Number(await redis.hget("views", id)) || 0;
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      });
    }
  } catch (error) {
    console.error('Error in view API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
