export const runtime = 'edge';
export const revalidate = 60;

import { ImageResponse } from "next/og";
import { join } from "path";

export async function GET() {
  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={{
          fontFamily: 'Inter',
          fontSize: 60,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div tw="flex flex-col items-center justify-center">
          <div tw="font-bold text-[60px] mb-4">
            Emre Can Kartal
          </div>
          <div tw="text-[32px] text-gray-600">
            Builder, marketer, learner
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}