'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import type { Journey } from '../../../migrations/00002-createTableJourneys';
import EditButton from '../../components/EditButton';
import HorizontalDivider from '../../components/HorizontalDivider';

type Props = {
  journey: Journey;
  reverse?: boolean;
  selectedCountryAdm0A3: string;
  onEdit?: () => void;
};

export default function JourneyCardCompact({
  journey,
  selectedCountryAdm0A3,
  reverse = false,
  onEdit = () => {},
}: Props) {
  const flexDirection = reverse ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className="w-full">
      <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
        <div className="card-body flex-row p-4">
          <Link
            className={`flex flex-grow items-center ${flexDirection}`}
            href={`/my-globe/${selectedCountryAdm0A3.toLowerCase()}/${journey.id}`}
          >
            <div className="mr-8 max-h-[200px] w-1/4 rounded-2xl border-2 border-white">
              <Image
                src="/images/logo-terra-scratch-4.png"
                alt="logo"
                width={200}
                height={200}
              />
            </div>
            <div className="mr-8 w-3/4">
              <h3>{journey.title}</h3>
              <div className="mt-2 flex justify-between">
                <div>From: {journey.dateStart.toDateString()}</div>
                <div>To: {journey.dateEnd.toDateString()}</div>
              </div>
              <HorizontalDivider />
              <div className="mt-4 text-justify">{journey.summary}</div>
            </div>
          </Link>

          <EditButton className="self-center" onClick={onEdit} />
        </div>
      </div>
    </div>
  );
}
