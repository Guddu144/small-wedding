import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const reqOptions = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      next: { revalidate: 0 },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues/pending`,
      reqOptions
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch pending venues: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data;

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error fetching pending venues:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch pending venues" },
      { status: 500 }
    );
  }
}
