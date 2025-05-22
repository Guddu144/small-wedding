import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    
    // Prepare the body with address mapping
    const body: any = {
      ...jsonData,
    };
    
    // Handle address mapping - convert zip to zip_code
    if (jsonData.address) {
      body.address = {
        country: jsonData.address.country,
        state: jsonData.address.state,
        city: jsonData.address.city,
        street: jsonData.address.street,
        zip_code: jsonData.address.zip, // Map zip to zip_code
      };
    }
    
    // Gallery URLs are already provided from frontend
    body.gallery = jsonData.gallery || [];

    // Validate body structure
    if (typeof body !== 'object' || Array.isArray(body)) {
      throw new Error("Invalid request data format: Expected an object");
    }

    // Prepare request to external API
    const reqOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/venues`,
      reqOptions
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("External API Error:", errorData);
      throw new Error(`Failed to post data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Error posting data:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to post data" },
      { status: 500 }
    );
  }
}