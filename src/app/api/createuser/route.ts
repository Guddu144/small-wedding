import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
// Define expected request body type
interface CreateUserBody {
  emailAddress: string;
  password: string;
  role?: string;
  firstName: string;
  lastName: string;
}

// Check if user is admin
const isAdmin = (user: any): boolean => user?.publicMetadata?.role === "admin";

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth.userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
    const client= await clerkClient()
  const user = await client.users.getUser(auth.userId);
  if (!isAdmin(user)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  let body: CreateUserBody;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

const { emailAddress, password, role, firstName, lastName } = body;

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
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
