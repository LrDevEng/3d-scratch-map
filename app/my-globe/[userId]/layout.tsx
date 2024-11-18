import Link from 'next/link';
import type React from 'react';
import { getFollowingUser } from '../../../database/followers';
import {
  getJourneys,
  getJourneysByFollowingId,
} from '../../../database/journeys';
import { checkAuthentication } from '../../../util/auth';
import { getCountries } from '../../../util/localdata';
import { validateUrlParam } from '../../../util/validation';
import ResizableLayout from './ResizableLayout';

type Props = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
};

export default async function GlobeLayout({ children, params }: Props) {
  const { userId } = await params;
  const { user, sessionTokenCookie } = await checkAuthentication(
    `/my-globe/${userId}`,
  );

  // Check authentication in case a user tries to access the globe data of another user
  let personalGlobe = true;
  let journeys;
  let followingUser;
  if (user.id !== Number(userId)) {
    // Validate userId
    if (!validateUrlParam('userId', userId)) {
      return (
        <div className="relative flex h-full w-full flex-col items-center bg-[#0f0f0f]">
          <h1 className="my-16">Access denied!</h1>
          <Link href={`/my-globe/${user.id}`}>Return home.</Link>
        </div>
      );
    }

    followingUser = await getFollowingUser(
      sessionTokenCookie.value,
      Number(userId),
    );

    if (!followingUser || followingUser.status === 0) {
      return (
        <div className="relative flex h-full w-full flex-col items-center bg-[#0f0f0f]">
          <h1 className="my-16">Access denied!</h1>
          <Link href={`/my-globe/${user.id}`}>Return home.</Link>
        </div>
      );
    }
    // Get journeys of following user
    journeys = await getJourneysByFollowingId(
      sessionTokenCookie.value,
      followingUser.id,
    );
    personalGlobe = false;
  } else {
    // Get own journeys
    journeys = await getJourneys(sessionTokenCookie.value);
  }

  const countryData = await getCountries();
  const visitedCountries = new Set<string>();
  journeys.forEach((journey) => visitedCountries.add(journey.countryAdm0A3));

  return (
    <div className="relative flex h-full w-full">
      <ResizableLayout
        children={children}
        countryData={countryData}
        visitedCountries={visitedCountries}
        personalGlobe={personalGlobe}
        followingUser={followingUser}
      />
    </div>
  );
}
