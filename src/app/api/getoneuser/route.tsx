import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    const client = await clerkClient();

 const user = await client.users.getUser(user_id)

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error fetching user:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
