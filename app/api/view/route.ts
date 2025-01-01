import { redis } from "@/app/redis";
import postsData from "@/app/posts.json";
import commaNumber from "comma-number";
import { NextResponse, NextRequest } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") ?? null;

    // Return all views if no ID is provided
    if (id === null) {
      const views = await redis.hgetall("views");
      const parsedViews = Object.entries(views || {}).reduce((acc, [key, value]) => {
        acc[key] = Number(value) || 0;
        return acc;
      }, {} as Record<string, number>);
      return NextResponse.json(parsedViews, {
        headers: {
          'Cache-Control': 'private, max-age=0, no-store'
        }
      });
    }

    const post = postsData.posts.find(post => post.id === id);

    if (!post) {
      return NextResponse.json(
        {
          error: {
            message: "Unknown post",
            code: "UNKNOWN_POST",
          },
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'private, max-age=0, no-store'
          }
        }
      );
    }

    // Always get the current view count first
    const currentViews = Number(await redis.hget("views", id)) || 0;

    if (url.searchParams.get("incr") != null) {
      // Increment the view count
      const newViews = await redis.hincrby("views", id, 1);
      
      return NextResponse.json({
        ...post,
        views: newViews,
        viewsFormatted: commaNumber(newViews),
      }, {
        headers: {
          'Cache-Control': 'private, max-age=0, no-store'
        }
      });
    }

    // Return current views without incrementing
    return NextResponse.json({
      ...post,
      views: currentViews,
      viewsFormatted: commaNumber(currentViews),
    }, {
      headers: {
        'Cache-Control': 'private, max-age=0, no-store'
      }
    });

  } catch (error) {
    console.error('Error in view API:', error);
    return NextResponse.json({ 
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'private, max-age=0, no-store'
      }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json(); // Directly parse the JSON body
    if (!id) {
      return NextResponse.json({ 
        error: {
          message: 'ID is required',
          code: 'MISSING_ID'
        }
      }, { 
        status: 400,
        headers: {
          'Cache-Control': 'private, max-age=0, no-store'
        }
      });
    }

    const post = postsData.posts.find(post => post.id === id);

    if (post == null) {
      console.error('Unknown post ID:', id);
      return NextResponse.json({ 
        error: {
          message: "Unknown post",
          code: "UNKNOWN_POST",
        },
      }, { 
        status: 404,
        headers: {
          'Cache-Control': 'private, max-age=0, no-store'
        }
      });
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
        'Cache-Control': 'private, max-age=0, no-store'
      }
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    return NextResponse.json({ 
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'private, max-age=0, no-store'
      }
    });
  }
}