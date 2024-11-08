import { NextResponse } from 'next/server';
import { deleteJourney, updateJourney } from '../../../../database/journeys';
import { journeySchema } from '../../../../migrations/00002-createTableJourneys';
import { checkAuthorization } from '../../../../util/auth';
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
  const updatedJourney = await updateJourney(
    sessionTokenCookie.value,
    user.id,
    {
      id: Number((await params).journeyId),
      title: result.data.title,
      dateStart: result.data.dateStart,
      dateEnd: result.data.dateEnd,
      summary: result.data.summary,
      imageUrl: result.data.imageUrl || null,
    },
  );

  // 5. If the journey update fails, return an error
  if (!updatedJourney) {
    return NextResponse.json(
      { error: 'Journey not updated or access denied creating journey' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new journey
  return NextResponse.json({ journey: updatedJourney });
}

export async function DELETE(
  request: Request,
  { params }: JourneyParams,
): Promise<NextResponse<JourneyResponseBodyCud>> {
  // 1. Get the token and user from the session cookie
  const { user, sessionTokenCookie } = await checkAuthorization(undefined);

  // 2. Delete the journey
  const deletedJourney = await deleteJourney(
    sessionTokenCookie.value,
    user.id,
    Number((await params).journeyId),
  );

  // 3. If the journey deletion fails, return an error
  if (!deletedJourney) {
    return NextResponse.json(
      {
        error: 'Journey not found or not authorized to delete journey',
      },
      {
        status: 404,
      },
    );
  }

  // 4. Return deleted journey
  return NextResponse.json({ journey: deletedJourney });
}
