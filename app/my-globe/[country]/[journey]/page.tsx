import { redirect } from 'next/navigation';
import React from 'react';
import { getJourney } from '../../../../database/journeys';
import { checkAuthorization } from '../../../../util/auth';
import JourneyCardLarge from './JourneyCardLarge';

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

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[300px] w-full overflow-y-auto">
      <JourneyCardLarge journey={specificJourney} country={country} />
    </div>
  );
}
