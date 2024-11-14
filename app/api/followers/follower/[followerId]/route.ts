import { NextResponse } from 'next/server';
import {
  acceptFollowRequest,
  deleteFollowerUser,
} from '../../../../../database/followers';
import { checkAuthentication } from '../../../../../util/auth';
import type { FollowResponseBodyCud } from '../../following/[followingId]/route';

type FollowerParams = {
  params: Promise<{
    followerId: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: FollowerParams,
): Promise<NextResponse<FollowResponseBodyCud>> {
  // 1. Get the token from the cookie
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Accept the request
  const newFollower = await acceptFollowRequest(
    sessionTokenCookie.value,
    Number((await params).followerId),
  );

  // 4. If the update fails, return an error
  if (!newFollower) {
    return NextResponse.json(
      { error: 'Failed to accept follower request.' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the new follower
  return NextResponse.json({ follower: newFollower });
}

export async function DELETE(
  request: Request,
  { params }: FollowerParams,
): Promise<NextResponse<FollowResponseBodyCud>> {
  // 1. Get the token and user from the session cookie
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Delete the follower
  const deletedFollower = await deleteFollowerUser(
    sessionTokenCookie.value,
    Number((await params).followerId),
  );

  // 3. If follower deletion fails, return an error
  if (!deletedFollower) {
    return NextResponse.json(
      {
        error: 'Follower not found or not authorized to delete follower.',
      },
      {
        status: 404,
      },
    );
  }

  // 4. Return deleted follower
  return NextResponse.json({ follower: deletedFollower });
}
