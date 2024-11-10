'use client';

import React from 'react';
import type { Diary } from '../../../../migrations/00003-createTableDiaries';
import EditButton from '../../../components/EditButton';
import HorizontalDivider from '../../../components/HorizontalDivider';
import ImageCarousel from '../../../components/ImageCarousel';

type Props = {
  diary: Diary;
  onEdit?: () => void;
};

export default function DiaryView({ diary, onEdit = () => {} }: Props) {
  return (
    <div className="w-full">
      <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
        <div className="card-body flex-row p-4">
          <div className="mr-8 w-3/4">
            <ImageCarousel
              diaryId={diary.id}
              imageUrls={[
                '/images/logo-terra-scratch-4.png',
                '/images/logo-terra-scratch-2.png',
              ]}
            />
          </div>
          <div className="mr-8 w-1/4">
            <h3>{diary.title}</h3>

            <div>Date: {diary.dateStart.toDateString()}</div>

            <HorizontalDivider />
            <div className="mt-4 text-justify">{diary.thoughts}</div>
          </div>

          <EditButton className="self-center" onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}
