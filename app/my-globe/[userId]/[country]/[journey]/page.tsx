import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import {
  getDiaries,
  getDiariesByFollowingId,
} from '../../../../../database/diaries';
import {
  getDiaryImages,
  getDiaryImagesByFollowingId,
} from '../../../../../database/diaryImages';
import {
  getJourney,
  getJourneyByFollowingId,
} from '../../../../../database/journeys';
import { getLikesInsecure } from '../../../../../database/likes';
import type { DiaryImage } from '../../../../../migrations/00004-createTableDiaryImages';
import type { Like } from '../../../../../migrations/00006-createTableDiaryImageLikes';
import { checkAuthentication } from '../../../../../util/auth';
import { validateUrlParam } from '../../../../../util/validation';
import JourneyDetailedView from './JourneyDetailedView';

type Props = {
  params: Promise<{ userId: string; country: string; journey: string }>;
};

export default async function JourneyDetailed(props: Props) {
  const { userId, country, journey } = await props.params;
  const { user, sessionTokenCookie } = await checkAuthentication(
    `/my-globe/${userId}/${country}/${journey}`,
  );

  // Validate url params
  if (
    !validateUrlParam('country', country) ||
    !validateUrlParam('userId', userId) ||
    !validateUrlParam('journey', journey)
  ) {
    return (
      <div className="relative flex h-full w-full flex-col items-center bg-[#0f0f0f]">
        <h1 className="my-16">Journey does not exist or access denied!</h1>
        <Link href={`/my-globe/${user.id}`}>Return home.</Link>
      </div>
    );
  }

  // Get specfic journey
  let specificJourney;
  if (user.id === Number(userId)) {
    specificJourney = await getJourney(
      sessionTokenCookie.value,
      Number(journey),
    );
  } else {
    specificJourney = await getJourneyByFollowingId(
      sessionTokenCookie.value,
      Number(journey),
      Number(userId),
    );
  }

  // Check journey result and redirect if necessary
  if (
    !specificJourney ||
    specificJourney.countryAdm0A3 !== country.toUpperCase()
  ) {
    redirect(`/my-globe/${userId}/${country}`);
  }

  // Get diaries, diary images and diary image likes
  let personalGlobe = true;
  let diaries;
  let diaryImages: DiaryImage[] = [];
  let diaryImageLikes: Like[] = [];
  if (user.id === Number(userId)) {
    diaries = await getDiaries(sessionTokenCookie.value, specificJourney.id);
    for (const diary of diaries) {
      diaryImages = [
        ...diaryImages,
        ...(await getDiaryImages(sessionTokenCookie.value, diary.id)),
      ];
    }
    for (const diaryImage of diaryImages) {
      diaryImageLikes = [
        ...diaryImageLikes,
        ...(await getLikesInsecure(diaryImage.id)),
      ];
    }
  } else {
    diaries = await getDiariesByFollowingId(
      sessionTokenCookie.value,
      specificJourney.id,
      Number(userId),
    );
    console.log('Follower journey page diaries: ', diaries);
    for (const diary of diaries) {
      diaryImages = [
        ...diaryImages,
        ...(await getDiaryImagesByFollowingId(
          sessionTokenCookie.value,
          diary.id,
          Number(userId),
        )),
      ];
    }
    for (const diaryImage of diaryImages) {
      diaryImageLikes = [
        ...diaryImageLikes,
        ...(await getLikesInsecure(diaryImage.id)),
      ];
    }
    personalGlobe = false;
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] w-full overflow-y-auto">
      <JourneyDetailedView
        journey={specificJourney}
        diaries={diaries}
        diaryImages={diaryImages}
        diaryImageLikes={diaryImageLikes}
        country={country}
        globeUserId={userId}
        currentUserId={user.id}
        personalGlobe={personalGlobe}
      />
    </div>
  );
}
