import Image from 'next/image';
import React from 'react';
import type { Journey } from '../../../migrations/00002-createTableJourneys';
import HorizontalDivider from '../../components/HorizontalDivider';

type Props = {
  journey: Journey;
  reverse?: boolean;
};

export default function JourneyCardCompact({
  journey,
  reverse = false,
}: Props) {
  const flexDirection = reverse ? 'flex-row-reverse' : 'flex-row';

  return (
    <button className="w-full">
      <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
        <div className={`card-body ${flexDirection}`}>
          <div className="h-auto w-1/4 rounded-2xl border-2 border-white">
            <Image
              src="/images/logo-terra-scratch-4.png"
              alt="logo"
              width={200}
              height={200}
            />
          </div>
          <div className="mx-8 w-3/4">
            <h3>{journey.title}</h3>
            <div className="mt-2 flex justify-between">
              <div>From: {journey.dateStart.toDateString()}</div>
              <div>To: {journey.dateEnd.toDateString()}</div>
            </div>
            <HorizontalDivider />
            <div className="mt-4 text-justify">{journey.summary}</div>
          </div>
        </div>
      </div>
    </button>
  );
}
