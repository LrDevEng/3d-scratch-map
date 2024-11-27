import { NextResponse } from 'next/server';
import { createCommentInsecure } from '../../../../database/comments';
import { getFollowingUser } from '../../../../database/followers';
import {
  type Comment,
  commentSchema,
} from '../../../../migrations/00007-createTableComments';
import { checkAuthentication } from '../../../../util/auth';

type CommentParams = {
  params: Promise<{
    journeyUserId: string;
  }>;
};

export type CommentResponseBodyCud =
  | {
      comment: Comment;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
  { params }: CommentParams,
): Promise<NextResponse<CommentResponseBodyCud>> {
  // 1. Authenticate user
  const { user, sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Check user authorization for endpoint
  const endpointUserId = Number((await params).journeyUserId);
  if (endpointUserId !== user.id) {
    const followingUser = await getFollowingUser(
      sessionTokenCookie.value,
      endpointUserId,
    );
    if (!followingUser || followingUser.status !== 1) {
      return NextResponse.json(
        { error: 'Not authorized to create comment.' },
        {
          status: 404,
        },
      );
    }
  }

  // 3. Get the comment data from the request
  const body = await request.json();

  // 4. Validate comment data with zod
  const result = commentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain comment object: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 5. Create the comment
  const newComment =
    sessionTokenCookie.value &&
    (await createCommentInsecure(
      result.data.userId,
      result.data.diaryId,
      result.data.post,
    ));

  // 6. If the comment creation fails, return an error
  if (!newComment) {
    return NextResponse.json(
      { error: 'Comment not created or access denied creating comment.' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new comment
  return NextResponse.json({ comment: newComment });
}
