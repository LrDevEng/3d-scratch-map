import { NextResponse } from 'next/server';
import { createJourney, getJourneys } from '../../../database/journeys';
import type { Journey } from '../../../migrations/00002-createTableJourneys';
import { journeySchema } from '../../../migrations/00002-createTableJourneys';
import { checkAuthentication } from '../../../util/auth';
import { getCookie } from '../../../util/cookies';

export type JourneyResponseBodyCud =
  | {
      journey: Journey;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<JourneyResponseBodyCud>> {
  // 1. Get the journey data from the request
  const body = await request.json();

  // 2. Validate journey data with zod
  const result = journeySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain journey object: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token from the cookie
  const sessionTokenCookie = await getCookie('sessionToken');

  // 4. Create the journey
  const newJourney =
    sessionTokenCookie &&
    (await createJourney(
      sessionTokenCookie,
      result.data.countryAdm0A3,
      result.data.title,
      result.data.dateStart,
      result.data.dateEnd,
      result.data.summary,
      result.data.imageUrl,
    ));

  // 5. If the journey creation fails, return an error
  if (!newJourney) {
    return NextResponse.json(
      { error: 'Journey not created or access denied creating journey' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new journey
  return NextResponse.json({ journey: newJourney });
}

export type JourneyResponseBodyGet = {
  journeys: Journey[];
};

export async function GET(): Promise<NextResponse<JourneyResponseBodyGet>> {
  // 1. Get the token from the cookie
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Get journeys
  const journeys = await getJourneys(sessionTokenCookie.value);

  // 3. Return journeys
  return NextResponse.json({ journeys: journeys });
}
