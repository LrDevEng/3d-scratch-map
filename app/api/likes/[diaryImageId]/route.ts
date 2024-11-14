import { NextResponse } from 'next/server';
import {
  createLike,
  createPersonalLike,
  deleteLike,
  deletePersonalLike,
} from '../../../../database/likes';
import {
  type Like,
  likeSchemaPersonal,
} from '../../../../migrations/00006-createTableDiaryImageLikes';
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
  // 1. Get the user id from the request
  const body = await request.json();

  // 2. Validate the user id with zod
  const result = likeSchemaPersonal.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain user id: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Check authentication
  const { user, sessionTokenCookie } = await checkAuthentication(undefined);

  // 4. Create the like
  let newLike;
  if (user.id === result.data.journeyUserId) {
    console.log('Personal like');
    newLike = await createPersonalLike(
      sessionTokenCookie.value,
      Number((await params).diaryImageId),
    );
  } else {
    console.log('Other like');
    newLike = await createLike(
      sessionTokenCookie.value,
      Number((await params).diaryImageId),
    );
  }

  // 5. If the creation of the new like fails, return an error
  if (!newLike) {
    return NextResponse.json(
      { error: 'Like not created or access denied creating like.' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new like
  return NextResponse.json({ like: newLike });
}

export async function DELETE(
  request: Request,
  { params }: LikeParams,
): Promise<NextResponse<LikeResponseBodyCud>> {
  // 1. Get the user id from the request
  const body = await request.json();

  // 2. Validate the user id with zod
  const result = likeSchemaPersonal.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain user id: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Check authentication
  const { user, sessionTokenCookie } = await checkAuthentication(undefined);

  // 4. Delete like
  let deletedLike;
  if (user.id === result.data.journeyUserId) {
    deletedLike = await deletePersonalLike(
      sessionTokenCookie.value,
      Number((await params).diaryImageId),
    );
  } else {
    deletedLike = await deleteLike(
      sessionTokenCookie.value,
      Number((await params).diaryImageId),
    );
  }

  // 5. If the deletion of the like fails, return an error
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

  // 6. Return deleted like
  return NextResponse.json({ like: deletedLike });
}
