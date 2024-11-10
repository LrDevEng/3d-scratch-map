import { NextResponse } from 'next/server';
import { createDiaryImage } from '../../../database/diaryImages';
import type { DiaryImage } from '../../../migrations/00004-createTableDiaryImages';
import { diaryImageSchema } from '../../../migrations/00004-createTableDiaryImages';
import { getCookie } from '../../../util/cookies';

export type DiaryImageResponseBodyCud =
  | {
      diaryImage: DiaryImage;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
): Promise<NextResponse<DiaryImageResponseBodyCud>> {
  // 1. Get the diary image data from the request
  const body = await request.json();

  // 2. Validate diary image data with zod
  const result = diaryImageSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain diary image object: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token from the cookie
  const sessionTokenCookie = await getCookie('sessionToken');

  // 4. Create the diary image
  const newDiaryImage =
    sessionTokenCookie &&
    (await createDiaryImage(
      sessionTokenCookie,
      result.data.diaryId,
      result.data.imageUrl,
      result.data.longitude,
      result.data.latitude,
      result.data.dateShot,
    ));

  // 5. If the diary image creation fails, return an error
  if (!newDiaryImage) {
    return NextResponse.json(
      {
        error: 'Diary image not created or access denied creating diary image',
      },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new diary image
  return NextResponse.json({ diaryImage: newDiaryImage });
}
