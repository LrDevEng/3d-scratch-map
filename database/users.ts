import { cache } from 'react';
import { type User } from '../migrations/00000-createTableUsers';
import { type Session } from '../migrations/00001-createTableSessions';
import { sql } from './connect';

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const getUser = cache(async (sessionToken: Session['token']) => {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.email,
      users.given_name,
      users.family_name,
      users.image_url
    FROM
      users
      INNER JOIN sessions ON (
        sessions.user_id = users.id
        AND sessions.expiry_timestamp > now()
      )
    WHERE
      sessions.token = ${sessionToken}
  `;

  return user;
});

export const updateUser = cache(
  async (
    sessionToken: Session['token'],
    userId: User['id'],
    imageUrl: User['imageUrl'],
  ) => {
    const [user] = await sql<User[]>`
      UPDATE users
      SET
        image_url = ${imageUrl}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND users.id = ${userId}
      RETURNING
        users.id,
        users.email,
        users.given_name,
        users.family_name,
        users.image_url
    `;

    return user;
  },
);

export const getUserInsecure = cache(async (email: User['email']) => {
  const [user] = await sql<User[]>`
    SELECT
      id,
      email,
      given_name,
      family_name,
      image_url
    FROM
      users
    WHERE
      email = ${email}
  `;

  return user;
});

export const getUserWithPasswordHashInsecure = cache(
  async (email: User['email']) => {
    const [user] = await sql<UserWithPasswordHash[]>`
      SELECT
        *
      FROM
        users
      WHERE
        email = ${email}
    `;

    return user;
  },
);

export const createUserInsecure = cache(
  async (
    email: User['email'],
    givenName: User['givenName'],
    familyName: User['familyName'],
    passwordHash: UserWithPasswordHash['passwordHash'],
  ) => {
    const [user] = await sql<User[]>`
      INSERT INTO
        users (
          email,
          given_name,
          family_name,
          password_hash
        )
      VALUES
        (
          ${email},
          ${givenName},
          ${familyName},
          ${passwordHash}
        )
      RETURNING
        users.id,
        users.email,
        users.given_name,
        users.family_name,
        users.image_url
    `;

    return user;
  },
);
