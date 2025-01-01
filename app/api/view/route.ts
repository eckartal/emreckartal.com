export const runtime = 'edge';
export const revalidate = 60;

import { redis } from "@/app/redis";
import postsData from "@/app/posts.json";
import commaNumber from "comma-number";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") ?? null;

    // Return all views if no ID is provided
    if (id === null) {
      const views = await redis.hgetall("views");
      console.log('Fetched all views:', views);
      // Convert string values to numbers
      const parsedViews = Object.entries(views || {}).reduce((acc, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {} as Record<string, number>);
      return NextResponse.json(parsedViews, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      });
    }

    const post = postsData.posts.find(post => post.id === id);

    if (post == null) {
      console.error('Unknown post ID:', id);
      return NextResponse.json(
        {
          error: {
            message: "Unknown post",
            code: "UNKNOWN_POST",
          },
        },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store'
          }
        }
      );
    }

    if (url.searchParams.get("incr") != null) {
      console.log('Incrementing views for post:', id);
      const views = await redis.hincrby("views", id, 1);
      console.log('New view count:', views);
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      }, {
        headers: {
          'Cache-Control': 'no-store'
        }
      });
    } else {
      const views = Number(await redis.hget("views", id)) || 0;
      console.log('Fetched views for post:', id, 'Count:', views);
      return NextResponse.json({
        ...post,
        views,
        viewsFormatted: commaNumber(views),
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      });
    }
  } catch (error) {
    console.error('Error in view API:', error);
    // Log Redis connection details (without sensitive info)
    console.log('Redis URL configured:', !!process.env.UPSTASH_REDIS_REST_URL);
    console.log('Redis token configured:', !!process.env.UPSTASH_REDIS_REST_TOKEN);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json(); // Directly parse the JSON body
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const post = postsData.posts.find(post => post.id === id);

    if (post == null) {
      console.error('Unknown post ID:', id);
      return NextResponse.json(
        {
          error: {
            message: "Unknown post",
            code: "UNKNOWN_POST",
          },
        },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store'
          }
        }
      );
    }

    console.log('Incrementing views for post:', id);
    const views = await redis.hincrby("views", id, 1);
    console.log('New view count:', views);
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  }
}