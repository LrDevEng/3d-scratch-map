'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import type { Journey } from '../../../../migrations/00002-createTableJourneys';
import AddButton from '../../../components/AddButton';
import BackButton from '../../../components/BackButton';
import EditButton from '../../../components/EditButton';
import HorizontalDivider from '../../../components/HorizontalDivider';

type Props = {
  journey: Journey;
  country: string;
};

export default function JourneyCardLarge({ journey, country }: Props) {
  const router = useRouter();

  const [showAddDiary, setShowAddDiary] = useState(false);

  return (
    <div className="mx-8 mt-24 w-full">
      <div className="flex justify-between">
        <BackButton onClick={() => router.replace(`/my-globe/${country}`)} />
        <h1 className="text-center">{journey.title}</h1>
        <EditButton />
      </div>
      <div className="mt-2 flex justify-between">
        <div>From: {journey.dateStart.toDateString()}</div>
        <div>To: {journey.dateEnd.toDateString()}</div>
      </div>
      <HorizontalDivider />
      <div className="mt-4 flex">
        <div className="rounded-2xl border-2 border-white">
          <Image
            src="/images/logo-terra-scratch-4.png"
            alt="logo"
            width={200}
            height={200}
          />
        </div>
        <div className="mx-8 text-justify">{journey.summary}</div>
      </div>
      <h2>Diaries</h2>
      <div className="flex items-center">
        <HorizontalDivider />
        <AddButton
          open={showAddDiary}
          onClick={() => setShowAddDiary((prev) => !prev)}
        />
        <HorizontalDivider />
      </div>
    </div>
  );
}
