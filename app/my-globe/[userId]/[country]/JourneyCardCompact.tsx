'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import type { Journey } from '../../../../migrations/00002-createTableJourneys';
import EditButton from '../../../components/EditButton';
import HorizontalDivider from '../../../components/HorizontalDivider';

type Props = {
  journey: Journey;
  reverse?: boolean;
  selectedCountryAdm0A3: string;
  userId: string;
  personalGlobe: boolean;
  onEdit?: () => void;
};

export default function JourneyCardCompact({
  journey,
  selectedCountryAdm0A3,
  reverse = false,
  userId,
  personalGlobe,
  onEdit = () => {},
}: Props) {
  const flexDirection = reverse ? 'flex-row-reverse' : 'flex-row';

  return (
    <div className="w-full">
      <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
        <div className="card-body flex-row p-4">
          <Link
            data-test-id={`journey-card-compact-${selectedCountryAdm0A3.toLowerCase()}-${journey.title}`}
            className={`flex flex-grow items-center ${flexDirection}`}
            href={`/my-globe/${userId}/${selectedCountryAdm0A3.toLowerCase()}/${journey.id}`}
          >
            <div className="relative mr-8 h-full w-1/2 rounded-xl border-2 border-white">
              {journey.imageUrl ? (
                <Image
                  className="rounded-xl object-cover"
                  src={journey.imageUrl}
                  alt="journey title image"
                  fill={true}
                  sizes="(max-width: 400px)"
                />
              ) : (
                <Image
                  className="rounded-xl object-cover"
                  src="/images/logo-terra-scratch-4.png"
                  alt="journey title image"
                  fill={true}
                  sizes="(max-width: 400px)"
                />
              )}
            </div>
            <div className="mr-8 w-1/2">
              <h3>{journey.title}</h3>
              <div className="mt-2 flex justify-between">
                <div>From: {journey.dateStart.toDateString()}</div>
                <div>To: {journey.dateEnd.toDateString()}</div>
              </div>
              <HorizontalDivider />
              <div className="mt-4 text-justify">{journey.summary}</div>
            </div>
          </Link>

          {personalGlobe && (
            <EditButton
              className="self-center"
              onClick={onEdit}
              data-test-id="edit-journey-button"
            />
          )}
        </div>
      </div>
    </div>
  );
}
