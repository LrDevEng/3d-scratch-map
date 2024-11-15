import { NextResponse } from 'next/server';
import {
  followRequest,
  stopFollowingUser,
} from '../../../../../database/followers';
import type { Follower } from '../../../../../migrations/00005-createTableFollowers';
import { checkAuthentication } from '../../../../../util/auth';

type FollowingParams = {
  params: Promise<{
    followingId: string;
  }>;
};

export type FollowResponseBodyCud =
  | {
      follower: Follower;
    }
  | {
      error: string;
    };

export async function POST(
  request: Request,
  { params }: FollowingParams,
): Promise<NextResponse<FollowResponseBodyCud>> {
  // 1. Get the token from the cookie
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Create the follower
  const newFollower = await followRequest(
    sessionTokenCookie.value,
    Number((await params).followingId),
  );

  // 3. If the creation of the new follower fails, return an error
  if (!newFollower) {
    return NextResponse.json(
      { error: 'Follower not created or access denied creating follower.' },
      {
        status: 400,
      },
    );
  }

  // 4. Return the new follower
  return NextResponse.json({ follower: newFollower });
}

export async function DELETE(
  request: Request,
  { params }: FollowingParams,
): Promise<NextResponse<FollowResponseBodyCud>> {
  // 1. Get the token and user from the session cookie
  const { sessionTokenCookie } = await checkAuthentication(undefined);

  // 2. Stop following
  const deletedFollower = await stopFollowingUser(
    sessionTokenCookie.value,
    Number((await params).followingId),
  );

  // 3. If stop following fails, return an error
  if (!deletedFollower) {
    return NextResponse.json(
      {
        error: 'Stop following failed or not authorized to stop following.',
      },
      {
        status: 404,
      },
    );
  }

  // 4. Return deleted follower
  return NextResponse.json({ follower: deletedFollower });
}
