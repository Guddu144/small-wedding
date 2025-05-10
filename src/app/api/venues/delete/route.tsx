import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
      const { venue_id, user_role } = await request.json();
  try {


    if (!venue_id || !user_role) {
      return NextResponse.json(
        { error: "Missing venue_id or user_role" },
        { status: 400 }
      );
    }

    // Optional: Authorization logic
    if (user_role !== "admin" && user_role !== "venueowner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues/${venue_id}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_role: user_role,
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
      { error: "Failed to delete venue data",UserRole:user_role, venID:venue_id },
      { status: 500 }
    );
  }
}
