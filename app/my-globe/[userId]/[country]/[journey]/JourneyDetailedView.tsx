'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { Journey } from '../../../../../migrations/00002-createTableJourneys';
import type { Diary } from '../../../../../migrations/00003-createTableDiaries';
import type { DiaryImage } from '../../../../../migrations/00004-createTableDiaryImages';
import type { Like } from '../../../../../migrations/00006-createTableDiaryImageLikes';
import type { UserComment } from '../../../../../migrations/00007-createTableComments';
import AddButton from '../../../../components/AddButton';
import BackButton from '../../../../components/BackButton';
import CloseButton from '../../../../components/CloseButton';
import HorizontalDivider from '../../../../components/HorizontalDivider';
import DiaryForm from './DiaryForm';
import DiaryView from './DiaryView';

type Props = {
  journey: Journey;
  diaries: Diary[];
  diaryImages: DiaryImage[];
  diaryComments: UserComment[];
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
  diaryComments,
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
    <div className="relative mx-8 w-full">
      <div className="sticky z-40 w-full pb-2 pl-2 pt-6">
        <CloseButton onClick={() => router.push(`/my-globe/${globeUserId}`)} />
      </div>
      <div className="mt-24 w-full">
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
          <div className="relative z-10 flex w-full items-center justify-center bg-black bg-opacity-50">
            <div className="absolute left-0 top-0">
              <div className="pl-2">
                <BackButton
                  data-test-id="go-back-to-journey-button"
                  onClick={() =>
                    router.replace(`/my-globe/${globeUserId}/${country}`)
                  }
                />
              </div>
            </div>
            <h1 className="w-fit" data-test-id="journey-details-title">
              {journey.title}
            </h1>
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
              data-test-id="add-diary-button"
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

        {!showDiaryForm.show && personalGlobe && diaries.length === 0 && (
          <div className="mt-4">
            <svg
              className="mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V6M5 12l7-7 7 7" />
            </svg>
            <h3 className="mt-2 text-center">
              Create your first diary entry here.
            </h3>
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
                  diaryComments={diaryComments.filter(
                    (diaryComment) => diaryComment.diaryId === diary.id,
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
    </div>
  );
}
