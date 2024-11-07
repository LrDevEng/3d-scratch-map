import { NextResponse } from 'next/server';
import { createJourney, updateJourney } from '../../../../database/journeys';
import type { Journey } from '../../../../migrations/00002-createTableJourneys';
import { journeySchema } from '../../../../migrations/00002-createTableJourneys';
import { checkAuthorization } from '../../../../util/auth';
import { getCookie } from '../../../../util/cookies';
import { type JourneyResponseBodyCud } from '../route';

type JourneyParams = {
  params: Promise<{
    journeyId: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: JourneyParams,
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

  // 3. Get the token and user from the session cookie
  const { user, sessionTokenCookie } = await checkAuthorization(undefined);

  // 4. Update journey
  const updatedJourney =
    sessionTokenCookie &&
    (await updateJourney(sessionTokenCookie.value, user.id, {
      id: Number((await params).journeyId),
      title: result.data.title,
      dateStart: result.data.dateStart,
      dateEnd: result.data.dateEnd,
      summary: result.data.summary,
      imageUrl: result.data.imageUrl || null,
    }));

  // 5. If the note creation fails, return an error
  if (!updatedJourney) {
    return NextResponse.json(
      { error: 'Journey not created or access denied creating journey' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new journey
  return NextResponse.json({ journey: updatedJourney });
}
