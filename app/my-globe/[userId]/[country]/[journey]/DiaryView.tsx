'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Diary } from '../../../../../migrations/00003-createTableDiaries';
import type { DiaryImage } from '../../../../../migrations/00004-createTableDiaryImages';
import { type Like } from '../../../../../migrations/00006-createTableDiaryImageLikes';
import type { UserComment } from '../../../../../migrations/00007-createTableComments';
import type { LikeResponseBodyCud } from '../../../../api/likes/[diaryImageId]/route';
import EditButton from '../../../../components/EditButton';
import ImageCarousel from '../../../../components/ImageCarousel';
import CommentsView from './CommentsView';

type Props = {
  journeyUserId: number;
  currentUserId: number;
  diary: Diary;
  diaryImages: DiaryImage[];
  diaryComments: UserComment[];
  diaryImageLikes: Like[];
  personalGlobe: boolean;
  onEdit?: () => void;
};

export default function DiaryView({
  journeyUserId,
  currentUserId,
  diary,
  diaryImages,
  diaryComments,
  diaryImageLikes,
  personalGlobe,
  onEdit = () => {},
}: Props) {
  const router = useRouter();
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="w-full">
      <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
        <div className="relative p-4">
          <div className="float-right mr-8 w-2/3">
            <ImageCarousel
              currentUserId={currentUserId}
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
          <div className="mr-8">
            <h3 data-test-id={`diary-view-title-${diary.title}`}>
              {diary.title}
            </h3>
            <div>Date: {diary.dateStart.toDateString()}</div>
            <hr className="border-2 border-white" />
            <div className="mt-4 text-justify">{diary.thoughts}</div>
          </div>

          {personalGlobe && (
            <div className="absolute right-0 top-0 p-4">
              <EditButton
                className="self-center"
                onClick={onEdit}
                data-test-id="diary-view-edit-button"
              />
            </div>
          )}
        </div>
        <button
          className="group hover:text-[#66b14e]"
          onClick={() => setShowComments((prev) => !prev)}
        >
          {showComments ? (
            <div className="flex justify-center">
              <svg
                className="group-hover:stroke-[#66b14e]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
              <div className="ml-2 mb-4">hide comments</div>
            </div>
          ) : (
            <div className="flex justify-center">
              <svg
                className="group-hover:stroke-[#66b14e]"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
              <div className="ml-2 mb-4">show comments</div>
            </div>
          )}
        </button>
        {showComments && <CommentsView diaryComments={diaryComments} />}
      </div>
    </div>
  );
}
