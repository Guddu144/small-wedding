import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const s3 = new AWS.S3();

export async function uploadFilesToS3(files: File[]) {
  const bucketName = 'venue-image-bucket';
  const uploadedFiles = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: bucketName,
      Key: `${Date.now()}-${file.name}`,
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

export async function deleteFileFromS3(fileKey: string) {
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
