import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
  const { venue_id, userId } = await request.json();
    console.log("Hello Data",venue_id, userId)
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    body: JSON.stringify({
          userId: userId,
          venueId: venue_id,
        }),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/wishlist`,
      reqOptions
    );

    if (!response.ok) {
      throw new Error(`Failed to post data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("POST response data:", data);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error posting data:", error.message);

    return NextResponse.json(
      { error: "Failed to post data" },
      { status: 500 }
    );
  }
}
