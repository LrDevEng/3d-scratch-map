'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import BackwardsButton from './BackwardsButton';
import ForwardsButton from './ForwardsButton';
import MaxMinButton from './MaxMinButton';

type Props = {
  imageUrls: string[];
  enableFullScreen?: boolean;
  height?: string;
};

export default function ImageCarousel({
  imageUrls,
  enableFullScreen = true,
  height = 'h-[300px]',
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

  useEffect(() => {
    setCurrentImgIdx(0);
  }, [imageUrls]);

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
        {imageUrls[currentImgIdx] && (
          <Image
            src={imageUrls[currentImgIdx]}
            className="rounded-2xl object-contain"
            fill={true}
            sizes="(max-width: 80vw)"
            alt={`Diary image ${currentImgIdx}`}
          />
        )}
      </div>
      <div className="flex w-14 justify-center">
        <div className={`w-fit ${fullScreenClassesButton}`}>
          {currentImgIdx < imageUrls.length - 1 && (
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
