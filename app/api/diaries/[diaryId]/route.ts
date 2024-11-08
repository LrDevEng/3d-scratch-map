import { NextResponse } from 'next/server';
import { deleteDiary, updateDiary } from '../../../../database/diaries';
import { diarySchema } from '../../../../migrations/00003-createTableDiaries';
import { checkAuthorization } from '../../../../util/auth';
import type { DiaryResponseBodyCud } from '../route';

type DiaryParams = {
  params: Promise<{
    diaryId: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: DiaryParams,
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

  // 3. Get the token and user from the session cookie
  const { user, sessionTokenCookie } = await checkAuthorization(undefined);

  // 4. Update diary
  const updatedDiary = await updateDiary(sessionTokenCookie.value, user.id, {
    id: Number((await params).diaryId),
    title: result.data.title,
    dateStart: result.data.dateStart,
    thoughts: result.data.thoughts,
  });

  // 5. If the diary update fails, return an error
  if (!updatedDiary) {
    return NextResponse.json(
      { error: 'Diary not updated or access denied creating diary' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new journey
  return NextResponse.json({ diary: updatedDiary });
}

export async function DELETE(
  request: Request,
  { params }: DiaryParams,
): Promise<NextResponse<DiaryResponseBodyCud>> {
  // 1. Get the token and user from the session cookie
  const { user, sessionTokenCookie } = await checkAuthorization(undefined);

  // 2. Delete the diary#
  const deletedDiary = await deleteDiary(
    sessionTokenCookie.value,
    user.id,
    Number((await params).diaryId),
  );

  // 3. If the diary deletion fails, return an error
  if (!deletedDiary) {
    return NextResponse.json(
      {
        error: 'Diary not found or not authorized to delete diary',
      },
      {
        status: 404,
      },
    );
  }

  // 4. Return deleted journey
  return NextResponse.json({ diary: deletedDiary });
}
