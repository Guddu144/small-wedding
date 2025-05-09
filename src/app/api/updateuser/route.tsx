import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    const body = await request.json();
    const { firstName, lastName, role, password } = body;

    // Debugging: Log the incoming data
    console.log("Incoming data:", { firstName, lastName, role, password });

    // Check if the role exists before trying to update
    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const client = await clerkClient();

    // Debugging: Check if user exists
    const user = await client.users.getUser(user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare the payload, ensuring the password is only included if set
    const updateData: any = {
      firstName,
      lastName,
      unsafeMetadata: {
        role,
      },
    };

    if (password) {
      updateData.password = password;
    }

    await client.users.updateUser(user_id, updateData);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
