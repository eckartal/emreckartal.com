import { redis } from "@/app/redis";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  try {
    // Get all upvotes from Redis
    const upvotes = await redis.hgetall("upcoming_upvotes") || {};

    // Convert upvotes to Record<string, string> to fix type error
    const upvotesRecord: Record<string, string> = upvotes as Record<string, string>;

    const topics = [
      { id: 'seo-llm', title: 'SEO for LLMs', upvotes: parseInt(upvotesRecord['seo-llm'] || '0') },
      { id: 'marketing-opensource', title: 'Marketing for open-source projects', upvotes: parseInt(upvotesRecord['marketing-opensource'] || '0') },
      { id: 'anthropologist-guide', title: "A marketer's guide from an anthropologist", upvotes: parseInt(upvotesRecord['anthropologist-guide'] || '0') },
      { id: 'scaling-tools', title: 'Top tools that I scale my effort', upvotes: parseInt(upvotesRecord['scaling-tools'] || '0') },
      { id: 'marketing-anthropology', title: 'Marketers, learn anthropology', upvotes: parseInt(upvotesRecord['marketing-anthropology'] || '0') },
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
