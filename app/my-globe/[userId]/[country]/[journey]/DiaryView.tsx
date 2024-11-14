'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import type { Diary } from '../../../../../migrations/00003-createTableDiaries';
import type { DiaryImage } from '../../../../../migrations/00004-createTableDiaryImages';
import { type Like } from '../../../../../migrations/00006-createTableDiaryImageLikes';
import type { LikeResponseBodyCud } from '../../../../api/likes/[diaryImageId]/route';
import EditButton from '../../../../components/EditButton';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import ImageCarousel from '../../../../components/ImageCarousel';

type Props = {
  journeyUserId: number;
  currentUserId: number;
  diary: Diary;
  diaryImages: DiaryImage[];
  diaryImageLikes: Like[];
  personalGlobe: boolean;
  onEdit?: () => void;
};

export default function DiaryView({
  journeyUserId,
  currentUserId,
  diary,
  diaryImages,
  diaryImageLikes,
  personalGlobe,
  onEdit = () => {},
}: Props) {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
        <div className="card-body flex-row p-4">
          <div className="mr-8 w-3/4">
            <ImageCarousel
              diaryImages={diaryImages}
              previewUrls={undefined}
              diaryImageLikes={diaryImageLikes}
              onLikeClick={async (diaryImageId) => {
                if (
                  diaryImageId &&
                  diaryImageLikes.some(
                    (diaryImageLike) =>
                      diaryImageLike.diaryImageId === diaryImageId &&
                      diaryImageLike.userId === currentUserId,
                  )
                ) {
                  // Delete like
                  const response = await fetch(`/api/likes/${diaryImageId}`, {
                    method: 'DELETE',
                    body: JSON.stringify({
                      journeyUserId: journeyUserId,
                    }),
                  });

                  const responseBody: LikeResponseBodyCud =
                    await response.json();

                  if ('error' in responseBody) {
                    toast.error('Error: Could not delete like.');
                  } else if ('like' in responseBody) {
                    // console.log('Success: Like deleted.');
                  }
                } else {
                  // Create new like
                  const response = await fetch(`/api/likes/${diaryImageId}`, {
                    method: 'POST',
                    body: JSON.stringify({
                      journeyUserId: journeyUserId,
                    }),
                  });

                  const responseBody: LikeResponseBodyCud =
                    await response.json();

                  if ('error' in responseBody) {
                    toast.error('Error: Could not like this image.');
                  } else if ('like' in responseBody) {
                    // console.log('Success: Liked image.');
                  }
                }
                router.refresh();
              }}
            />
          </div>
          <div className="mr-8 w-1/4">
            <h3>{diary.title}</h3>

            <div>Date: {diary.dateStart.toDateString()}</div>

            <HorizontalDivider />
            <div className="mt-4 text-justify">{diary.thoughts}</div>
          </div>

          {personalGlobe && (
            <EditButton className="self-center" onClick={onEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
