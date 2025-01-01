import { ImageResponse } from "next/og";

export const runtime = 'edge';

// Font files need to be fetched from a URL
const interRegular = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2')
).then(res => res.arrayBuffer());

const interMedium = fetch(
  new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2')
).then(res => res.arrayBuffer());

// Use the correct type for Next.js 15 route handlers
export async function GET(
  _req: Request,
  props: { params: { slug: string } }
) {
  try {
    const { slug } = props.params;

    // Load the fonts
    const [interRegularData, interMediumData] = await Promise.all([
      interRegular,
      interMedium
    ]);

    return new ImageResponse(
      (
        <div
          tw="flex p-10 h-full w-full bg-white flex-col"
          style={{ fontFamily: 'Inter' }}
        >
          <header tw="flex text-[36px] w-full">
            <div tw="font-bold" style={{ fontFamily: 'Inter' }}>
              Your Name
            </div>
            <div tw="grow" />
            <div tw="text-[28px]">your-domain.com</div>
          </header>

          <main tw="flex grow pb-3 flex-col items-center justify-center">
            <div tw="flex">
              <div
                tw="bg-gray-100 p-8 text-7xl font-medium rounded-md text-center"
                style={{ fontFamily: 'Inter' }}
              >
                {slug}
              </div>
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