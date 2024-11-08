'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { Journey } from '../../../../migrations/00002-createTableJourneys';
import type { Diary } from '../../../../migrations/00003-createTableDiaries';
import AddButton from '../../../components/AddButton';
import BackButton from '../../../components/BackButton';
import EditButton from '../../../components/EditButton';
import HorizontalDivider from '../../../components/HorizontalDivider';
import DiaryForm from './DiaryForm';
import DiaryView from './DiaryView';

type Props = {
  journey: Journey;
  diaries: Diary[];
  country: string;
};

type ShowDiaryForm = {
  show: boolean;
  diaryToEdit: Diary | undefined;
};

export default function JourneyDetailedView({
  journey,
  diaries,
  country,
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
          <Image
            className="object-cover"
            src="/images/logo-terra-scratch-4.png"
            alt="logo"
            fill={true}
          />
        </div>
        <div className="relative z-10 flex justify-between bg-black bg-opacity-50">
          <BackButton onClick={() => router.replace(`/my-globe/${country}`)} />
          <h1 className="text-center">{journey.title}</h1>
          <EditButton />
        </div>
        <div className="relative z-10 flex justify-between bg-black bg-opacity-50 pt-2">
          <div>From: {journey.dateStart.toDateString()}</div>
          <div>To: {journey.dateEnd.toDateString()}</div>
        </div>
        <div className="relative z-10">
          <HorizontalDivider />
        </div>
        <div className="relative z-10 flex bg-black bg-opacity-50 pt-4">
          <div className="mx-8 bg-black bg-opacity-50 text-justify">
            {journey.summary}
          </div>
        </div>
      </div>
      <h2 className="mt-8 text-center">Diaries</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        <AddButton
          open={showDiaryForm.show}
          onClick={() =>
            setShowDiaryForm((prev) => ({
              show: !prev.show,
              diaryToEdit: undefined,
            }))
          }
        />
        <HorizontalDivider />
      </div>

      {showDiaryForm.show && (
        <div className="flex justify-center">
          <DiaryForm
            journeyId={journey.id}
            diary={showDiaryForm.diaryToEdit}
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
                diary={diary}
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
