import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Define the correct type for the props parameter
interface Props {
  params: {
    slug: string;
  };
}

// fonts
const fontsDir = join(process.cwd(), "fonts");

const inter300 = readFileSync(
  join(fontsDir, "inter-latin-300-normal.woff")
);

const inter500 = readFileSync(
  join(fontsDir, "inter-latin-500-normal.woff")
);

const inter600 = readFileSync(
  join(fontsDir, "inter-latin-600-normal.woff")
);

const robotoMono400 = readFileSync(
  join(fontsDir, "roboto-mono-latin-400-normal.woff")
);

export async function GET(
  request: Request,
  { params }: Props
) {
  const { slug } = params;

  return new ImageResponse(
    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={{ fontFamily: "Inter 300" }}
      >
        <header tw="flex text-[36px] w-full">
          <div tw="font-bold" style={{ fontFamily: "Inter 600" }}>
            Your Name
          </div>
          <div tw="grow" />
          <div tw="text-[28px]">your-domain.com</div>
        </header>

        <main tw="flex grow pb-3 flex-col items-center justify-center">
          <div tw="flex">
            <div
              tw="bg-gray-100 p-8 text-7xl font-medium rounded-md text-center"
              style={{ fontFamily: "Inter 500" }}
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
          name: "Inter 300",
          data: inter300,
        },
        {
          name: "Inter 500",
          data: inter500,
        },
        {
          name: "Inter 600",
          data: inter600,
        },
        {
          name: "Roboto Mono 400",
          data: robotoMono400,
        },
      ],
    }
  );
} 