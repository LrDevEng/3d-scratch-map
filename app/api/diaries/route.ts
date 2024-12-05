import { NextResponse } from 'next/server';
import { createDiary, getDiaries } from '../../../database/diaries';
import type { Diary } from '../../../migrations/00003-createTableDiaries';
import { diarySchema } from '../../../migrations/00003-createTableDiaries';
import { checkAuthentication } from '../../../util/auth';
import { getCookie } from '../../../util/cookies';

export type DiaryResponseBodyCud =
  | {
      diary: Diary;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<DiaryResponseBodyCud>> {
  // 1. Get the diary data from the request
  const body = await request.json();

  // 2. Validate diary data with zod
  const result = diarySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain diary object: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token from the cookie
  const sessionTokenCookie = await getCookie('sessionToken');

  // 4. Create the diary
  const newDiary =
    sessionTokenCookie &&
    (await createDiary(
      sessionTokenCookie,
      result.data.journeyId,
      result.data.title,
      result.data.dateStart,
      result.data.thoughts,
    ));

  // 5. If the diary creation fails, return an error
  if (!newDiary) {
    return NextResponse.json(
      { error: 'Diary not created or access denied creating diary' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new diary
  return NextResponse.json({ diary: newDiary });
}

type GetDiariesParams = {
  params: Promise<{
    journeyId: string;
  }>;
};

export type DiaryResponseBodyGet = {
  diaries: Diary[];
};

export async function GET(
  request: Request,
  { params }: GetDiariesParams,
): Promise<NextResponse<DiaryResponseBodyGet>> {
  // 1. Get the token from the cookie
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Get diaries
  const diaries = await getDiaries(
    sessionTokenCookie.value,
    Number((await params).journeyId),
  );

  // 3. Return diaries
  return NextResponse.json({ diaries: diaries });
}
