import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const client = await clerkClient();

    const { data, totalCount } = await client.users.getUserList({
      orderBy: '-created_at',
      limit: 10,
    });

    console.log(data?.length)
    return NextResponse.json({ users: data, totalCount:totalCount });
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
