import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getUserWithPasswordHashInsecure } from '../../../../../database/users';
import {
  type User,
  userSchemaLogIn,
} from '../../../../../migrations/00000-createTableUsers';

export type LoginResponseBody =
  | {
      user: User;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<NextResponse<LoginResponseBody>> {
  // 1. Get the user data from the request
  const requestBody = await request.json();

  // 2. Validate the user data with zod
  const result = userSchemaLogIn.safeParse(requestBody);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => {
      const field = issue.path[0] ? `${issue.path[0].toString()}: ` : '';
      return {
        message: `${field} ${issue.message}`,
      };
    });

    return NextResponse.json(
      { errors: errors },
      {
        status: 400,
      },
    );
  }

  // 3. Verify the user credentials
  const userWithPasswordHash = await getUserWithPasswordHashInsecure(
    result.data.email,
  );

  if (!userWithPasswordHash) {
    return NextResponse.json(
      {
        errors: [
          {
            message: `Invalid email or password.`,
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // 4. Validate the user password by comparing with hashed password
  const isPasswordValid = await bcrypt.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );

  if (!isPasswordValid) {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Invalid email or password.',
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // 8. Return the user information without password hash
  return NextResponse.json({
    user: {
      id: userWithPasswordHash.id,
      email: userWithPasswordHash.email,
      givenName: userWithPasswordHash.givenName,
      familyName: userWithPasswordHash.familyName,
    },
  });
}
