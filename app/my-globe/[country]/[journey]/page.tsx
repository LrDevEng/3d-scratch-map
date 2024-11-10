import { redirect } from 'next/navigation';
import React from 'react';
import { getDiaries } from '../../../../database/diaries';
import { getDiaryImages } from '../../../../database/diaryImages';
import { getJourney } from '../../../../database/journeys';
import type { DiaryImage } from '../../../../migrations/00004-createTableDiaryImages';
import { checkAuthorization } from '../../../../util/auth';
import JourneyDetailedView from './JourneyDetailedView';

type Props = {
  params: Promise<{ country: string; journey: string }>;
};

export default async function JourneyDetailed(props: Props) {
  const { country, journey } = await props.params;
  const { sessionTokenCookie } = await checkAuthorization(
    `/my-globe/${country}/${journey}`,
  );

  const specificJourney = await getJourney(
    sessionTokenCookie.value,
    Number(journey),
  );

  if (
    !specificJourney ||
    specificJourney.countryAdm0A3 !== country.toUpperCase()
  ) {
    redirect(`/my-globe/${country}`);
  }

  const diaries = await getDiaries(
    sessionTokenCookie.value,
    specificJourney.id,
  );

  let diaryImages: DiaryImage[] = [];
  for (const diary of diaries) {
    diaryImages = [
      ...diaryImages,
      ...(await getDiaryImages(sessionTokenCookie.value, diary.id)),
    ];
  }

  console.log(diaryImages);

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] w-full overflow-y-auto">
      <JourneyDetailedView
        journey={specificJourney}
        diaries={diaries}
        diaryImages={diaryImages}
        country={country}
      />
    </div>
  );
}
