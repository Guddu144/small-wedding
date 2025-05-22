import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    
    const reqOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`, // Removed NEXT_PUBLIC_ prefix
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_VENUE_URL}/contact`, 
      reqOptions
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("External API Error:", {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Failed to create enquiry: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      data,
      message: "Enquiry submitted successfully" 
    });

  } catch (error: any) {
    console.error("Error creating enquiry:", {
      message: error.message,
      stack: error.stack,
      inputData: await request.json().catch(() => "Could not parse request")
    });

    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Failed to create enquiry",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}