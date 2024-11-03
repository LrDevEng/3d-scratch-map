import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import {
  createUserInsecure,
  getUserInsecure,
} from '../../../../../database/users';
import {
  type User,
  userSchemaRegister,
} from '../../../../../migrations/00000-createTableUsers';

export type RegisterResponseBody =
  | {
      user: User;
    }
  | {
      errors: { message: string }[];
    };

export async function POST(
  request: Request,
): Promise<NextResponse<RegisterResponseBody>> {
  // 1. Get the user data from the request
  const requestBody = await request.json();

  // 2. Validate the user data with zod
  const result = userSchemaRegister.safeParse(requestBody);

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

  // 3. Check if user already exist in the database
  const user = await getUserInsecure(result.data.email);

  if (user) {
    return NextResponse.json(
      {
        errors: [
          {
            message: `Email: ${result.data.email} is already registered.`,
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // 4. Hash the plain password from the user
  const passwordHash = await bcrypt.hash(result.data.password, 12);

  // 5. Save the user information with the hashed password in the database
  const newUser = await createUserInsecure(
    result.data.email,
    result.data.givenName,
    result.data.familyName,
    passwordHash,
  );

  if (!newUser) {
    return NextResponse.json(
      {
        errors: [
          {
            message: 'Registration failed',
          },
        ],
      },
      {
        status: 400,
      },
    );
  }

  // 9. Return the new user information
  return NextResponse.json({ user: newUser });
}
