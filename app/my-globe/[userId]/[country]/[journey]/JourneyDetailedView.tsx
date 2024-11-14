'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { Journey } from '../../../../../migrations/00002-createTableJourneys';
import type { Diary } from '../../../../../migrations/00003-createTableDiaries';
import type { DiaryImage } from '../../../../../migrations/00004-createTableDiaryImages';
import type { Like } from '../../../../../migrations/00006-createTableDiaryImageLikes';
import AddButton from '../../../../components/AddButton';
import BackButton from '../../../../components/BackButton';
import EditButton from '../../../../components/EditButton';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import DiaryForm from './DiaryForm';
import DiaryView from './DiaryView';

type Props = {
  journey: Journey;
  diaries: Diary[];
  diaryImages: DiaryImage[];
  diaryImageLikes: Like[];
  country: string;
  globeUserId: string;
  currentUserId: number;
  personalGlobe: boolean;
};

type ShowDiaryForm = {
  show: boolean;
  diaryToEdit: Diary | undefined;
};

export default function JourneyDetailedView({
  journey,
  diaries,
  diaryImages,
  diaryImageLikes,
  country,
  globeUserId,
  currentUserId,
  personalGlobe,
}: Props) {
  const router = useRouter();

  const [showDiaryForm, setShowDiaryForm] = useState<ShowDiaryForm>({
    show: false,
    diaryToEdit: undefined,
  });

  return (
    <div className="mx-8 mt-24 w-full">
      <div className="relative">
        <div className="absolute z-0 h-full w-full rounded-2xl opacity-60">
          {journey.imageUrl ? (
            <Image
              className="rounded-2xl object-cover"
              src={journey.imageUrl}
              alt="logo"
              fill={true}
              sizes="(max-width: 50vw)"
            />
          ) : (
            <Image
              className="rounded-2xl object-cover"
              src="/images/logo-terra-scratch-4.png"
              alt="logo"
              fill={true}
              sizes="(max-width: 50vw)"
            />
          )}
        </div>
        <div className="relative z-10 flex justify-between bg-black bg-opacity-50">
          <BackButton
            onClick={() =>
              router.replace(`/my-globe/${globeUserId}/${country}`)
            }
          />
          <h1 className="text-center">{journey.title}</h1>
          <EditButton />
        </div>
        <div className="relative z-10 flex justify-between bg-black bg-opacity-50 pt-2">
          <div className="pl-4">From: {journey.dateStart.toDateString()}</div>
          <div className="pr-4">To: {journey.dateEnd.toDateString()}</div>
        </div>
        <div className="relative z-10">
          <HorizontalDivider />
        </div>
        <div className="relative z-10 flex bg-black bg-opacity-50 pb-4 pt-4">
          <div className="mx-8 text-justify">{journey.summary}</div>
        </div>
      </div>
      <h2 className="mt-8 text-center">Diaries</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        {personalGlobe && (
          <AddButton
            open={showDiaryForm.show}
            onClick={() =>
              setShowDiaryForm((prev) => ({
                show: !prev.show,
                diaryToEdit: undefined,
              }))
            }
          />
        )}
        <HorizontalDivider />
      </div>

      {showDiaryForm.show && personalGlobe && (
        <div className="flex justify-center">
          <DiaryForm
            journeyId={journey.id}
            diary={showDiaryForm.diaryToEdit}
            diaryImageUrls={diaryImages
              .filter(
                (diaryImage) =>
                  diaryImage.diaryId === showDiaryForm.diaryToEdit?.id,
              )
              .map((diaryImage) => diaryImage.imageUrl)}
            onSubmit={() =>
              setShowDiaryForm((prev) => ({
                show: !prev.show,
                diaryToEdit: undefined,
              }))
            }
            onDelete={() =>
              setShowDiaryForm((prev) => ({
                show: !prev.show,
                diaryToEdit: undefined,
              }))
            }
          />
        </div>
      )}
      {!showDiaryForm.show &&
        diaries.map((diary) => {
          return (
            <div key={`diary-${diary.id}`}>
              <DiaryView
                journeyUserId={journey.userId}
                currentUserId={currentUserId}
                diary={diary}
                diaryImages={diaryImages.filter(
                  (diaryImage) => diaryImage.diaryId === diary.id,
                )}
                diaryImageLikes={diaryImageLikes}
                personalGlobe={personalGlobe}
                onEdit={() =>
                  setShowDiaryForm((prev) => ({
                    show: !prev.show,
                    diaryToEdit: diary,
                  }))
                }
              />
            </div>
          );
        })}
    </div>
  );
}
