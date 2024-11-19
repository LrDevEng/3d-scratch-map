'use server';

import type { UploadApiResponse, UploadStream } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { deleteSession } from '../../database/sessions';
import { deleteUser } from '../../database/users';

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
          {
            transformation: [{ width: 400, height: 400, crop: 'fill' }],
            folder: 'Profile',
          },
          (error, result) => {
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

export async function deleteAccount(): Promise<boolean> {
  // 1. Get the session token from the cookie
  const cookieStore = await cookies();
  const sessionTokenCookie = cookieStore.get('sessionToken');

  if (sessionTokenCookie) {
    // 2. Delete the user
    const deletedUser = await deleteUser(sessionTokenCookie.value);

    // 3. If the user deletion fails, return an error
    if (!deletedUser) {
      return false;
    } else {
      // 4. Delete the session from the database based on the token
      await deleteSession(sessionTokenCookie.value);

      // 5. Delete the session cookie from the browser
      cookieStore.delete(sessionTokenCookie.name);
    }
  }

  return true;
}
