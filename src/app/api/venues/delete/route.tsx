import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const client = await clerkClient();

 
    await client.users.deleteUser(user_id)

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
