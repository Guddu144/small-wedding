import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const venue_id = url.searchParams.get("venue_id");

    if (!venue_id) {
      return NextResponse.json(
        { error: "Missing venue_id in query parameters" },
        { status: 400 }
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues/${venue_id}`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text(); // capture backend error message
      console.log("PATCH Error:", errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("PATCH Error:", error.message);
    return NextResponse.json({ error: "Failed to update venue" }, { status: 500 });
  }
}
