import { redis } from "@/app/redis";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  try {
    // Get all upvotes from Redis
    const upvotes = await redis.hgetall("upcoming_upvotes") || {};

    const topics = [
      { id: "typescript-5", title: "TypeScript 5.0 Features", upvotes: parseInt(upvotes["typescript-5"] || "0") },
      { id: "react-server", title: "React Server Components", upvotes: parseInt(upvotes["react-server"] || "0") },
      { id: "nextjs-14", title: "Next.js 14", upvotes: parseInt(upvotes["nextjs-14"] || "0") },
      { id: "ai-tools", title: "AI Tools in Development", upvotes: parseInt(upvotes["ai-tools"] || "0") },
    ];

    return NextResponse.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
