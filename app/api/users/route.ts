import { NextResponse } from 'next/server';
import { updateUser } from '../../../database/users';
import type { User } from '../../../migrations/00000-createTableUsers';
import { userSchemaProfilePicture } from '../../../migrations/00000-createTableUsers';
import { checkAuthorization } from '../../../util/auth';

export type UserResponseBodyUpdate =
  | {
      user: User;
    }
  | {
      error: string;
    };

export async function PUT(
  request: Request,
): Promise<NextResponse<UserResponseBodyUpdate>> {
  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate user data with zod
  const result = userSchemaProfilePicture.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain user profile picture url: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token and user from the session cookie
  const { user, sessionTokenCookie } = await checkAuthorization(undefined);

  // 4. Update user
  const updatedUser = await updateUser(
    sessionTokenCookie.value,
    user.id,
    result.data.imageUrl,
  );

  // 5. If the user update fails, return an error
  if (!updatedUser) {
    return NextResponse.json(
      { error: 'User not updated or access denied updating user' },
      {
        status: 400,
      },
    );
  }

  // 6. Return the updated user
  return NextResponse.json({ user: updatedUser });
}
