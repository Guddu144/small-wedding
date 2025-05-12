import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'; 
export async function GET(request:Request) {

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    console.log("URL:", url);
    console.log("URL userId:", userId);
    const reqOptions = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      next: { revalidate: 0 }, // Revalidate the cache every 50 seconds
    };

    if (!userId) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/wishlist/user/?userId=${userId}`,
      reqOptions
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch result: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("data", data);
    const result = data;

    return NextResponse.json({ result });
  } catch (error:any) {
    console.error("Error fetching data:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
