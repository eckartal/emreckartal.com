import { redis } from "@/app/redis";
import postsData from "@/app/posts.json";
import commaNumber from "comma-number";
import { NextResponse, NextRequest } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") ?? null;

    console.log('View API called for ID:', id);

    // Return all views if no ID is provided
    if (id === null) {
      try {
        const views = await redis.hgetall("views");
        console.log('Fetched all views from Redis:', views);
        const parsedViews = Object.entries(views || {}).reduce((acc, [key, value]) => {
          acc[key] = Number(value) || 0;
          return acc;
        }, {} as Record<string, number>);
        return NextResponse.json(parsedViews, {
          headers: {
            'Cache-Control': 'private, max-age=0, no-store'
          }
        });
      } catch (redisError) {
        console.error('Redis error fetching all views:', redisError);
        // Return empty views if Redis fails
        return NextResponse.json({}, {
          headers: {
            'Cache-Control': 'private, max-age=0, no-store'
          }
        });
      }
    }

    const post = postsData.posts.find(post => post.id === id);

    if (!post) {
      console.error('Unknown post ID requested:', id);
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
    let currentViews = 0;
    try {
      currentViews = Number(await redis.hget("views", id)) || 0;
      console.log('Current views for post', id, ':', currentViews);
    } catch (redisError) {
      console.error('Redis error getting view count for', id, ':', redisError);
    }

    if (url.searchParams.get("incr") != null) {
      // Increment the view count
      try {
        const newViews = await redis.hincrby("views", id, 1);
        console.log('Incremented views for post', id, 'to', newViews);
        
        return NextResponse.json({
          ...post,
          views: newViews,
          viewsFormatted: commaNumber(newViews),
        }, {
          headers: {
            'Cache-Control': 'private, max-age=0, no-store'
          }
        });
      } catch (redisError) {
        console.error('Redis error incrementing views for', id, ':', redisError);
        // If Redis fails, just return the current views
        return NextResponse.json({
          ...post,
          views: currentViews,
          viewsFormatted: commaNumber(currentViews),
        }, {
          headers: {
            'Cache-Control': 'private, max-age=0, no-store'
          }
        });
      }
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