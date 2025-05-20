import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { venue_id, userId } = await request.json();
    console.log("Hello Data", venue_id, userId);
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

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

    // Clone the response to read it twice if needed
    const responseClone = response.clone();
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Try to get the error details from the API response
      const errorData = await responseClone.json().catch(() => ({
        error: response.statusText || "Unknown error occurred"
      }));
      
      console.error("API Error Response:", errorData);
      
      return NextResponse.json(
        { 
          error: "Failed to post data",
          apiError: errorData,
          status: response.status 
        },
        { status: response.status }
      );
    }

    console.log("POST response data:", data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error posting data:", error.message);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message 
      },
      { status: 500 }
    );
  }
}