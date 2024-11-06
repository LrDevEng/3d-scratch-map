import { NextResponse } from 'next/server';
import { createJourney } from '../../../database/journeys';
import type { Journey } from '../../../migrations/00002-createTableJourneys';
import { journeySchema } from '../../../migrations/00002-createTableJourneys';
import { getCookie } from '../../../util/cookies';

export type CreateJourneyResponseBodyPost =
  | {
      journey: Journey;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<CreateJourneyResponseBodyPost>> {
  // 1. Get the journey data from the request
  const body = await request.json();

  // 2. Validate journey data with zod
  const result = journeySchema.safeParse(body);

  if (!result.success) {
    console.log('Post api journeys body: ', body);
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
    ));

  // 5. If the note creation fails, return an error
  if (!newJourney) {
    return NextResponse.json(
      { error: 'Journey not created or access denied creating note' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new journey
  return NextResponse.json({ journey: newJourney });
}
