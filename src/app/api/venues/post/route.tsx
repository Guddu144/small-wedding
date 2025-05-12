import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import AWS from 'aws-sdk';

// Configure AWS SDK

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,

});

const s3 = new AWS.S3();
import { Buffer } from 'buffer';

export async function uploadFilesToS3(files:any) {
  const bucketName = 'venue-image-bucket';
  const uploadedFiles = [];

  for (const file of files) {
    // Convert Blob/File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: bucketName,
      Key: `${Date.now()}-${file.name}`, // Unique file name
      Body: buffer,
      ContentType: file.type,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      uploadedFiles.push({
        url: uploadResult.Location,
        key: uploadResult.Key,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  }

  return uploadedFiles;
}

export async function deleteFileFromS3(fileKey:any) {
  const bucketName = 'venue-image-bucket';
  const params = {
    Bucket: bucketName,
    Key: fileKey,

  };

  try {

    await s3.deleteObject(params).promise();
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('File deletion failed');

  }

}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log("formData: ", formData);
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

    body.user_role="superadmin"
    console.log("Form data received:", body);

    // Validate the form data to ensure it doesn't contain unexpected numbers
    if (typeof body !== 'object' || Array.isArray(body)) {
      throw new Error("Invalid form data format: Expected an object");
    }

    // Handle file upload to S3
    const galleryFiles = formData.getAll('gallery') as File[];
    const uploadedFiles = await uploadFilesToS3(galleryFiles);
    const galleryUrls = uploadedFiles.map(file => file.url);

    // Add the gallery URLs to the form data
    body.gallery = galleryUrls;

    const reqOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        'Content-Type': 'application/json'
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
    console.log("POST response data:", data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error posting data:", error.message);
    console.error("Traceback:", error.stack);

    return NextResponse.json(
      { error: "Failed to post data" },
      { status: 500 }
    );
  }
}
