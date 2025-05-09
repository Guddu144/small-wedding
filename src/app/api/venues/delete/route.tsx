import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const venue_id = url.searchParams.get("venue_id");

    if (!venue_id) {
      return NextResponse.json({ error: "Venue ID missing" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues/${venue_id}`,
      {
        method: "DELETE",
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
