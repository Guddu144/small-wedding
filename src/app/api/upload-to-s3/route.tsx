// app/api/upload-to-s3/route.ts (Next.js 13+)
import { NextResponse } from "next/server";
import { uploadFilesToS3 } from "../../../../utils/uploadFilesTos3";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("gallery") as File[];

    const uploaded = await uploadFilesToS3(files);
    const urls = uploaded.map(file => file.url);

    return NextResponse.json({ success: true, urls });
  } catch (err: any) {
    console.error("Upload API error:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
