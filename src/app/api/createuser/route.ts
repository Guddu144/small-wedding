import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

interface CreateUserBody {
  emailAddress: string;
  password: string;
  role?: string;
  firstName: string;
  lastName: string;
}

// Helper to check if the current user is an admin
const isAdmin = (user: any): boolean => user?.publicMetadata?.role === "admin";

export async function POST(req: NextRequest) {
  const auth = getAuth(req);

  // Check if the request is authenticated
  if (!auth.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

   const client= await clerkClient()

  // Get the current user
  let user;
  try {
    user = await client.users.getUser(auth.userId);
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }

  // Check if the user is an admin
  if (!isAdmin(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // Parse the request body
  let body: CreateUserBody;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { emailAddress, password, role, firstName, lastName } = body;

  // Create the new user
  try {
    const newUser = await client.users.createUser({
      emailAddress: [emailAddress],
      password,
      firstName,
      lastName,
      publicMetadata: {
        role: role || "user",
      },
    });

    return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("User creation error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
