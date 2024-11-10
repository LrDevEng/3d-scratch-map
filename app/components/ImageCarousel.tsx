'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import MaxMinButton from './MaxMinButton';

type Props = {
  diaryId: number;
  imageUrls: string[];
};

export default function ImageCarousel({ diaryId, imageUrls }: Props) {
  const [fullScreen, setFullScreen] = useState(false);
  const fullScreenClassesMain = fullScreen
    ? 'fixed left-0 bottom-0 z-50 h-[calc(100vh-5rem)] py-8'
    : '';
  const fullScreenClassesImg = fullScreen ? 'h-full' : 'h-[300px]';
  const fullScreenClassesButton = fullScreen ? 'btn-primary' : 'btn-ghost';

  return (
    <div className={`carousel w-full ${fullScreenClassesMain}`}>
      {imageUrls.map((imageUrl, index) => {
        return (
          <div
            key={`diary-image-${diaryId}-${imageUrl}`}
            id={`image-${index}`}
            className="carousel-item relative h-full w-full items-center"
          >
            <div className="flex w-14 justify-start">
              {index > 0 && (
                <Link
                  href={`#image-${index - 1}`}
                  className={`btn btn-circle ${fullScreenClassesButton}`}
                >
                  ❮
                </Link>
              )}
            </div>
            <div
              className={`relative flex-grow rounded-2xl border-2 border-white bg-black px-2 ${fullScreenClassesImg}`}
            >
              <div className="absolute left-0 top-0 z-50">
                <MaxMinButton
                  maximized={fullScreen}
                  onClick={() => setFullScreen((prev) => !prev)}
                />
              </div>
              <Image
                src={imageUrl}
                className="rounded-2xl object-contain"
                fill={true}
                alt="Diary image"
              />
            </div>
            <div className="flex w-14 justify-end">
              {index < imageUrls.length - 1 && (
                <Link
                  href={`#image-${index + 1}`}
                  className={`btn btn-circle ${fullScreenClassesButton}`}
                >
                  ❯
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
