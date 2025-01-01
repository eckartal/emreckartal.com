import { ImageResponse } from "next/og";
import { getPosts } from "@/app/get-posts";
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Font files need to be fetched from a URL
const interRegular = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2')
).then(res => res.arrayBuffer());

const interMedium = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2')
).then(res => res.arrayBuffer());

const robotoMono = fetch(
  new URL('https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2')
).then(res => res.arrayBuffer());

type Props = {
  params: { id: string }
}

export async function GET(
  _request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = params;

    const posts = await getPosts();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      return new Response("Not found", { status: 404 });
    }

    // Load the fonts
    const [interRegularData, interMediumData, robotoMonoData] = await Promise.all([
      interRegular,
      interMedium,
      robotoMono
    ]);

    return new ImageResponse(
      (
        <div
          tw="flex p-10 h-full w-full bg-white flex-col"
          style={{ fontFamily: 'Inter' }}
        >
          <header tw="flex text-[36px] w-full">
            <div tw="font-bold" style={{ fontFamily: 'Inter' }}>
              Emre C. Kartal
            </div>
            <div tw="grow" />
            <div tw="text-[28px]">emreckartal.com</div>
          </header>

          <main tw="flex grow pb-3 flex-col items-center justify-center">
            <div tw="flex">
              <div
                tw="bg-gray-100 p-8 text-7xl font-medium rounded-md text-center"
                style={{ fontFamily: 'Inter' }}
              >
                {post.title}
              </div>
            </div>

            <div
              tw="mt-5 flex text-3xl text-gray-500"
              style={{ fontFamily: 'Roboto Mono' }}
            >
              {post.date} – {post.viewsFormatted} views
            </div>
          </main>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interRegularData,
            weight: 400,
          },
          {
            name: 'Inter',
            data: interMediumData,
            weight: 500,
          },
          {
            name: 'Roboto Mono',
            data: robotoMonoData,
            weight: 400,
          }
        ],
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate image`, {
      status: 500
    });
  }
}