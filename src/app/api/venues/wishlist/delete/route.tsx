import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const { venueId, userId } = await request.json();
  try {
    if (!venueId || !userId ) {
      return NextResponse.json(
        { error: "Missing venueId or userId" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/wishlist/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          venueId: venueId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove venue from wishlist: ${response.statusText}`);
    }

    return NextResponse.json({ message: "Venue deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting venue:", error.message);
    return NextResponse.json(
      { error: "Failed to remove venue from wishlist" },
      { status: 500 }
    );
  }
}
