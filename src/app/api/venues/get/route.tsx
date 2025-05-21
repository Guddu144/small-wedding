import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    // Prepare external API URL
    const externalUrl = new URL(`${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues`);

    // Forward all query parameters to the external API
    for (const [key, value] of searchParams.entries()) {
      externalUrl.searchParams.append(key, value);
    }

    const reqOptions = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      next: { revalidate: 0 },
    };

    const response = await fetch(externalUrl.toString(), reqOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch result: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ result: data });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
