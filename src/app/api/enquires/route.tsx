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
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/enquiries`,
      reqOptions
    );
    console.log(response)
    if (!response.ok) {
      throw new Error(`Failed to fetch enquiries: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data;

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Error fetching enquiries:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}