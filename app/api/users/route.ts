import { NextResponse } from 'next/server';
import {
  searchUsersInsecure,
  updateUser,
  updateUserInfo,
} from '../../../database/users';
import type { User } from '../../../migrations/00000-createTableUsers';
import {
  userSchemaProfilePicture,
  userSchemaSearch,
  userSchemaUpdate,
} from '../../../migrations/00000-createTableUsers';
import { checkAuthentication } from '../../../util/auth';

export type UserResponseBodyUpdate =
  | {
      user: User;
    }
  | {
      error: string;
    };

export type UserResponseBodySearch =
  | {
      users: Omit<User, 'familyName'>[] | undefined;
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
  const { user, sessionTokenCookie } = await checkAuthentication(undefined);

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

export async function PATCH(
  request: Request,
): Promise<NextResponse<UserResponseBodyUpdate>> {
  // 1. Get the user data from the request
  const body = await request.json();

  // 2. Validate user data with zod
  const result = userSchemaUpdate.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain updated user info: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token and user from the session cookie
  const { user, sessionTokenCookie } = await checkAuthentication(undefined);

  // 4. Update user
  const updatedUser = await updateUserInfo(sessionTokenCookie.value, {
    id: user.id,
    email: result.data.email,
    givenName: result.data.givenName,
    familyName: result.data.familyName,
  });

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

export async function POST(
  request: Request,
): Promise<NextResponse<UserResponseBodySearch>> {
  // 1. Get the search data from the request
  const body = await request.json();

  // 2. Validate user data with zod
  const result = userSchemaSearch.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: `Request does not contain search term: ${result.error.message}`,
      },
      {
        status: 400,
      },
    );
  }

  // 3. Get the token from the session cookie
  await checkAuthentication(undefined);

  // 4. Get users based on search term
  const users = await searchUsersInsecure(result.data.searchTerm);

  // 6. Return the found users
  return NextResponse.json({ users: users });
}
