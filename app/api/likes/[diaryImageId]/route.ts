import { NextResponse } from 'next/server';
import { createLike, deleteLike } from '../../../../database/likes';
import type { Like } from '../../../../migrations/00006-createTableDiaryImageLikes';
import { checkAuthentication } from '../../../../util/auth';

type LikeParams = {
  params: Promise<{
    diaryImageId: string;
  }>;
};

export type LikeResponseBodyCud =
  | {
      like: Like;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
  { params }: LikeParams,
): Promise<NextResponse<LikeResponseBodyCud>> {
  // 1. Check authentication
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Create the like
  const newLike = await createLike(
    sessionTokenCookie.value,
    Number((await params).diaryImageId),
  );

  // 3. If the creation of the new like fails, return an error
  if (!newLike) {
    return NextResponse.json(
      { error: 'Like not created or access denied creating like.' },
      {
        status: 400,
      },
    );
  }

  // 4. Return the new like
  return NextResponse.json({ like: newLike });
}

export async function DELETE(
  request: Request,
  { params }: LikeParams,
): Promise<NextResponse<LikeResponseBodyCud>> {
  // 1. Check authentication
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Delete like
  const deletedLike = await deleteLike(
    sessionTokenCookie.value,
    Number((await params).diaryImageId),
  );

  // 3. If the deletion of the like fails, return an error
  if (!deletedLike) {
    return NextResponse.json(
      {
        error: 'Like not deleted or access denied deleting like.',
      },
      {
        status: 404,
      },
    );
  }

  // 4. Return deleted like
  return NextResponse.json({ like: deletedLike });
}
