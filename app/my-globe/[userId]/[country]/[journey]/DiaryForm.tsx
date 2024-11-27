'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { Diary } from '../../../../../migrations/00003-createTableDiaries';
import DeleteButton from '../../../../components/DeleteButton';
import ImageCarousel from '../../../../components/ImageCarousel';
import LoadingRing from '../../../../components/LoadingRing';
import { uploadImage } from './actions';
import { createOrUpdateDiary, deleteDiary } from './diaryApiCalls';
import { createDiaryImage } from './diaryImageApiCalls';

type Props = {
  journeyId: number;
  diary: Diary | undefined;
  diaryImageUrls: string[];
  onSubmit?: () => void;
  onDelete?: () => void;
};

export default function DiaryForm({
  journeyId,
  diary,
  diaryImageUrls,
  onSubmit,
  onDelete,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [thoughts, setThoughts] = useState('');
  const [imgUrls, setImgUrls] = useState<string[] | undefined>(undefined);
  const [imgsToUpload, setImgsToUpload] = useState<File[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (diary) {
      setTitle(diary.title);
      setStartDate(diary.dateStart);
      setThoughts(diary.thoughts);
    }
    setImgUrls(diaryImageUrls);
  }, [diary, diaryImageUrls]);

  // Clean up freeing memory
  useEffect(() => {
    return () => {
      if (imgUrls) {
        imgUrls.forEach((imgUrl) => URL.revokeObjectURL(imgUrl));
      }
    };
  }, [imgUrls]);

  if (loading) {
    return (
      <div className="mb-8">
        <LoadingRing />
      </div>
    );
  }

  return (
    <div className="mb-8 flex w-full max-w-[1000px] flex-col items-center">
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          // Set loading state
          setLoading(true);

          const diaryId = diary?.id || undefined;

          const response = await createOrUpdateDiary(
            diaryId,
            journeyId,
            title,
            startDate,
            thoughts,
          );

          if ('error' in response) {
            console.log('Error creating or updating diary: ', response.error);
            toast.error('Error: Failed to create/update diary.');
          } else if ('diary' in response) {
            console.log(
              'Diary sucessfully created or updated: ',
              response.diary,
            );
            toast.success('Success: Diary created/updated.');

            if (imgsToUpload) {
              let success = true;
              for (const imgToUpload of imgsToUpload) {
                const newImgUrl = await uploadImage(imgToUpload);
                if (newImgUrl) {
                  const newDiaryImage = await createDiaryImage(
                    response.diary.id,
                    newImgUrl,
                    null,
                    null,
                  );

                  if (!newDiaryImage) {
                    success = false;
                  }
                } else {
                  success = false;
                }
              }
              if (!success) {
                toast.error('Error: Failed to upload diary image(s).');
              }
            }
          }

          if (onSubmit) {
            onSubmit();
          }
          setLoading(false);
          router.refresh();
        }}
        className="card my-8 w-full min-w-[400px] bg-neutral text-neutral-content"
      >
        <div className="card-body items-center text-center">
          {(!imgUrls || imgUrls.length === 0) && <div>Chose image(s)</div>}
          {imgUrls && imgUrls.length > 0 && (
            <div className="relative h-[150px] w-[450px]">
              <ImageCarousel
                currentUserId={undefined}
                diaryImages={undefined}
                previewUrls={imgUrls}
                diaryImageLikes={undefined}
                enableFullScreen={false}
                height="h-[150px]"
                onLikeClick={() => {}}
              />
            </div>
          )}

          <div className="form-control mt-2 w-full">
            <input
              type="file"
              multiple
              accept=".jpg, .jpeg, .png, .gif, .webp"
              className="file-input file-input-primary"
              placeholder="choose diary image(s)"
              onChange={(event) => {
                const files = event.target.files;
                if (files) {
                  const filesArray = [...files];
                  setImgUrls([
                    ...filesArray.map((file) => URL.createObjectURL(file)),
                    ...diaryImageUrls,
                  ]);
                  setImgsToUpload(filesArray);
                } else {
                  setImgUrls(diaryImageUrls);
                  setImgsToUpload(undefined);
                }
              }}
            />
          </div>

          <div className="form-control mt-2 w-full">
            <input
              data-test-id="diary-form-title"
              placeholder="Diary title"
              className="input input-bordered w-full text-center"
              required
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </div>

          <div className="flex w-full">
            <div className="form-control mt-2 w-full">
              <label className="label flex">
                <div className="label-text mx-4 text-left text-neutral-content">
                  Date
                </div>
                <input
                  data-test-id="diary-form-date"
                  type="date"
                  className="input input-bordered flex-grow"
                  required
                  value={dayjs(startDate).format('YYYY-MM-DD')}
                  onChange={(event) =>
                    setStartDate(new Date(event.currentTarget.value))
                  }
                />
              </label>
            </div>
          </div>

          <div className="relative form-control mt-2 w-full">
            <textarea
              data-test-id="diary-form-thoughts"
              placeholder="Your thoughts"
              className="textarea textarea-bordered min-h-40 w-full"
              required
              value={thoughts}
              onChange={(event) => setThoughts(event.currentTarget.value)}
            />

            <button
              onClick={(event) => {
                event.preventDefault();
                setShowEmojiPicker((prev) => !prev);
              }}
              className="absolute left-[-1rem] top-[-1rem] text-xl"
            >
              🙂
            </button>

            {showEmojiPicker && (
              <div className="absolute left-[0.5rem] top-[-28rem] z-50">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: { native: string }) => {
                    setThoughts((prev) => prev + emoji.native);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="card-actions mt-8 w-full justify-end">
            <button
              className="btn btn-primary w-full"
              data-test-id="diary-form-save-button"
            >
              Save
            </button>
          </div>
        </div>
      </form>
      {diary && (
        <DeleteButton
          data-test-id="diary-form-delete-button"
          onClick={async () => {
            await deleteDiary(diary.id);
            if (onDelete) {
              onDelete();
            }
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
