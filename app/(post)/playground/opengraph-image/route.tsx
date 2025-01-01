export const runtime = 'edge';
export const revalidate = 60;

import { ImageResponse } from "next/og";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '900px',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#000',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              Playground
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#666',
              }}
            >
              By Emre Can Kartal
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OpenGraph image:', error);
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              color: '#000',
            }}
          >
            Emre Can Kartal's Blog
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
