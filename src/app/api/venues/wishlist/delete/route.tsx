import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const { venueId, userId, wishlistId } = await request.json();
  console.log(venueId, wishlistId);
  try {
    if (!venueId || !userId || !wishlistId) {
      return NextResponse.json(
        { error: "Missing venueId or userId or wishlistId" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/wishlist/${venueId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          wishlistId:wishlistId,
          venueId: venueId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete venue data: ${response.statusText}`);
    }

    return NextResponse.json({ message: "Venue deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting venue:", error.message);
    return NextResponse.json(
      { error: "Failed to delete venue data" },
      { status: 500 }
    );
  }
}
