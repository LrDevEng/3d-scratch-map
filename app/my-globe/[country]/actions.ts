'use server';

import type { UploadApiResponse, UploadStream } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Image upload to cloudinary

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(imgToUpload: File) {
  let url = null;
  try {
    const arrayBuffer = await imgToUpload.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const uploadResult: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
          (error: Error | null, result: UploadApiResponse | undefined) => {
            if (error) {
              return reject(error);
            }
            if (result) {
              return resolve(result);
            } else {
              return reject(
                new Error('Cloudinary img upload failed. Internal error.'),
              );
            }
          },
        );
        uploadStream.end(buffer);
      },
    );

    console.log('Cloudinary img upload result: ', uploadResult);
    url = cloudinary.url(uploadResult.secure_url, {
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });
    console.log('Cloudinary img upload url: ', url);
  } catch (error) {
    console.log('Cloudinary img upload error: ', error);
  }
  return url;
}
