import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const date = searchParams.get('date');
    const views = searchParams.get('views') || '0';

    if (!title) {
      return new Response('Missing title parameter', { status: 400 });
    }

    // Load fonts
    const interRegular = fetch(
      new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2')
    ).then(res => res.arrayBuffer());

    const interMedium = fetch(
      new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2')
    ).then(res => res.arrayBuffer());

    const robotoMono = fetch(
      new URL('https://fonts.gstatic.com/s/robotomono/v22/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW4.woff2')
    ).then(res => res.arrayBuffer());

    const [interRegularData, interMediumData, robotoMonoData] = await Promise.all([
      interRegular,
      interMedium,
      robotoMono,
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
                {title}
              </div>
            </div>

            <div
              tw="mt-5 flex text-3xl text-gray-500"
              style={{ fontFamily: 'Roboto Mono' }}
            >
              {date} – {views} views
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
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
