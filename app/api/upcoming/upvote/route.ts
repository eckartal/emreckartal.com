import { redis } from "@/app/redis";
import { NextResponse, NextRequest } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Increment the upvote count
    const newCount = await redis.hincrby("upcoming_upvotes", id, 1);

    return NextResponse.json({ success: true, newCount });
  } catch (error) {
    console.error('Error upvoting topic:', error);
    return NextResponse.json(
      { error: 'Failed to upvote' },
      { status: 500 }
    );
  }
}
