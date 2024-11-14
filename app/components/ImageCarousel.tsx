'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { DiaryImage } from '../../migrations/00004-createTableDiaryImages';
import type { Like } from '../../migrations/00006-createTableDiaryImageLikes';
import BackwardsButton from './BackwardsButton';
import ForwardsButton from './ForwardsButton';
import LikeButton from './LikeButton';
import MaxMinButton from './MaxMinButton';

type Props = {
  diaryImages: DiaryImage[] | undefined;
  previewUrls: string[] | undefined;
  diaryImageLikes: Like[] | undefined;
  enableFullScreen?: boolean;
  height?: string;
  onLikeClick: (diaryImageId: DiaryImage['id'] | undefined) => void;
};

export default function ImageCarousel({
  diaryImages,
  previewUrls,
  diaryImageLikes,
  enableFullScreen = true,
  height = 'h-[300px]',
  onLikeClick,
}: Props) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const fullScreenClassesMain = fullScreen
    ? 'fixed left-0 bottom-0 z-50 h-[calc(100vh-5rem)] py-8'
    : '';
  const fullScreenClassesImg = fullScreen ? 'h-full' : height;
  const fullScreenClassesButton = fullScreen
    ? 'bg-black rounded-full border-2 border-white'
    : '';
  const imgUrls = diaryImages
    ? diaryImages.map((diaryImage) => diaryImage.imageUrl)
    : previewUrls;

  useEffect(() => {
    if (previewUrls) {
      setCurrentImgIdx(0);
    }
  }, [previewUrls]);

  return (
    <div className={`flex w-full items-center ${fullScreenClassesMain}`}>
      <div className="flex w-14 justify-center">
        <div className={`w-fit ${fullScreenClassesButton}`}>
          {currentImgIdx > 0 && (
            <BackwardsButton
              type="button"
              onClick={() => setCurrentImgIdx((prev) => prev - 1)}
            />
          )}
        </div>
      </div>
      <div
        className={`relative flex-grow rounded-2xl border-2 border-white bg-black px-2 ${fullScreenClassesImg}`}
      >
        {enableFullScreen && (
          <div className="absolute left-0 top-0 z-10">
            <MaxMinButton
              maximized={fullScreen}
              onClick={() => setFullScreen((prev) => !prev)}
            />
          </div>
        )}
        {enableFullScreen && diaryImages && diaryImageLikes && (
          <div className="absolute right-0 top-0 z-10">
            <div className="flex items-center">
              <div className="text-xl font-bold">
                {diaryImageLikes.reduce((total, like) => {
                  if (like.diaryImageId === diaryImages[currentImgIdx]?.id) {
                    return total + 1;
                  } else {
                    return total;
                  }
                }, 0)}
              </div>
              <LikeButton
                liked={false}
                onClick={() => {
                  onLikeClick(diaryImages[currentImgIdx]?.id);
                }}
              />
            </div>
          </div>
        )}
        {imgUrls && (
          <Image
            src={
              imgUrls[currentImgIdx]
                ? imgUrls[currentImgIdx]
                : '/images/logo-terra-scratch-4.png'
            }
            className="rounded-2xl object-contain"
            fill={true}
            sizes="(max-width: 80vw)"
            alt={`Diary image ${currentImgIdx}`}
          />
        )}
      </div>
      <div className="flex w-14 justify-center">
        <div className={`w-fit ${fullScreenClassesButton}`}>
          {((diaryImages && currentImgIdx < diaryImages.length - 1) ||
            (previewUrls && currentImgIdx < previewUrls.length - 1)) && (
            <ForwardsButton
              type="button"
              onClick={() => setCurrentImgIdx((prev) => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
