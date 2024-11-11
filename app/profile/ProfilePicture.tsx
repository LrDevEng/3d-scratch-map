'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EditButton from '../components/EditButton';
import { uploadImage } from './actions';

type Props = {
  profileImgSrc: string;
};

export default function ProfilePicture({ profileImgSrc }: Props) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [imgToUpload, setImgToUpload] = useState<File | undefined>(undefined);

  if (edit) {
    return (
      <div className="flex h-[200px] items-center">
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            // Try to upload profile picture to cloudinary
            let currentImgUrl = null;
            if (imgToUpload) {
              currentImgUrl = await uploadImage(imgToUpload);
            }

            // Update database after successful image upload
            if (currentImgUrl) {
              const response = await fetch(`/api/users`, {
                method: 'PUT',
                body: JSON.stringify({
                  imageUrl: currentImgUrl,
                }),
              });

              const responseBody = await response.json();

              if ('error' in responseBody) {
                console.log('Error updating user: ', responseBody.error);
              } else if ('user' in responseBody) {
                console.log('User sucessfully updated: ', responseBody.user);
              }
            }

            // Close edit form and refresh
            setEdit(false);
            router.refresh();
          }}
        >
          <input
            type="file"
            accept=".jpg, .jpeg, .png, .gif, .webp"
            className="file-input file-input-primary"
            placeholder="choose title image"
            onChange={(event) => {
              const file = event.target.files
                ? event.target.files[0]
                : undefined;
              if (file) {
                setImgToUpload(file);
              } else {
                setImgToUpload(undefined);
              }
            }}
          />
          <div className="card-actions mt-8 w-full justify-end">
            <button className="btn btn-primary w-full">save</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="duration-250 relative h-[200px] w-[200px] rounded-full border-2 border-white">
        <Image
          className="rounded-full object-contain"
          src={profileImgSrc}
          alt="logo"
          fill={true}
          sizes="(max-width: 200px)"
        />
      </div>
      <div className="ml-4">
        <EditButton onClick={() => setEdit(true)} />
      </div>
    </div>
  );
}
