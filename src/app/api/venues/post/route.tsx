import { NextResponse } from "next/server";
import { uploadFilesToS3 } from "../../../../../utils/uploadFilesTos3";
export const dynamic = "force-dynamic";



export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body: any = {};

    formData.forEach((value, key) => {
      if (["country", "state", "city", "street", "zip_code"].includes(key)) {
        body.address = {
          ...body.address,
          [key]: value,
        };
      } else {
        body[key] = value;
      }
    });

    body.user_role = "superadmin";

    if (typeof body !== 'object' || Array.isArray(body)) {
      throw new Error("Invalid form data format: Expected an object");
    }

    const galleryFiles = formData.getAll('gallery') as File[];
    const uploadedFiles = await uploadFilesToS3(galleryFiles);
    const galleryUrls = uploadedFiles.map(file => file.url);
    body.gallery = galleryUrls;

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
      throw new Error(`Failed to post data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Error posting data:", error.message);
    return NextResponse.json(
      { error: "Failed to post data" },
      { status: 500 }
    );
  }
}
