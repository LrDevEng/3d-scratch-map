import { cache } from 'react';
import type { FollowingUser } from '../migrations/00000-createTableUsers';
import { type User } from '../migrations/00000-createTableUsers';
import { type Session } from '../migrations/00001-createTableSessions';
import { type Follower } from '../migrations/00005-createTableFollowers';
import { sql } from './connect';

export const followRequest = cache(
  async (sessionToken: Session['token'], userId2: User['id']) => {
    const [follower] = await sql<Follower[]>`
      INSERT INTO
        followers (user_id1, user_id2, status) (
          SELECT
            sessions.user_id,
            ${userId2},
            ${0}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        followers.id,
        followers.user_id1,
        followers.user_id2,
        followers.status
    `;

    return follower;
  },
);

export const acceptFollowRequest = cache(
  async (sessionToken: Session['token'], userId: User['id']) => {
    const [follower] = await sql<Follower[]>`
      UPDATE followers
      SET
        status = ${1}
      WHERE
        id = (
          SELECT
            f.id
          FROM
            followers f
            JOIN sessions s ON f.user_id2 = s.user_id
          WHERE
            s.token = ${sessionToken}
            AND s.expiry_timestamp > now()
            AND f.user_id1 = ${userId}
            AND status = ${0}
        )
      RETURNING
        followers.id,
        followers.user_id1,
        followers.user_id2,
        followers.status
    `;
    return follower;
  },
);

export const getFollowing = cache(async (sessionToken: Session['token']) => {
  const followers = await sql<Follower[]>`
    SELECT
      f.*
    FROM
      followers f
      JOIN users u ON f.user_id1 = u.id
      JOIN sessions s ON u.id = s.user_id
    WHERE
      s.token = ${sessionToken}
      AND s.expiry_timestamp > now()
  `;
  return followers;
});

export const getFollowingUsers = cache(
  async (sessionToken: Session['token']) => {
    const followingUsers = await sql<FollowingUser[]>`
      SELECT
        u2.id,
        u2.email,
        u2.given_name,
        u2.image_url,
        f.status
      FROM
        followers f
        JOIN users u1 ON f.user_id1 = u1.id
        JOIN users u2 ON f.user_id2 = u2.id
        JOIN sessions s ON u1.id = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
    `;
    return followingUsers;
  },
);

export const getFollowingUser = cache(
  async (sessionToken: Session['token'], followingUserId: User['id']) => {
    const [followingUser] = await sql<FollowingUser[]>`
      SELECT
        u2.id,
        u2.email,
        u2.given_name,
        u2.image_url,
        f.status
      FROM
        followers f
        JOIN users u1 ON f.user_id1 = u1.id
        JOIN users u2 ON f.user_id2 = u2.id
        JOIN sessions s ON u1.id = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
        AND u2.id = ${followingUserId}
    `;
    return followingUser;
  },
);

export const getFollowers = cache(async (sessionToken: Session['token']) => {
  const followers = await sql<Follower[]>`
    SELECT
      f.*
    FROM
      followers f
      JOIN users u ON f.user_id2 = u.id
      JOIN sessions s ON u.id = s.user_id
    WHERE
      s.token = ${sessionToken}
      AND s.expiry_timestamp > now()
  `;
  return followers;
});

export const getFollowerUsers = cache(
  async (sessionToken: Session['token']) => {
    const followingUsers = await sql<FollowingUser[]>`
      SELECT
        u1.id,
        u1.email,
        u1.given_name,
        u1.image_url,
        f.status
      FROM
        followers f
        JOIN users u1 ON f.user_id1 = u1.id
        JOIN users u2 ON f.user_id2 = u2.id
        JOIN sessions s ON u2.id = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
    `;
    return followingUsers;
  },
);

export const deleteFollowerUser = cache(
  async (sessionToken: Session['token'], userId: User['id']) => {
    const [followerUser] = await sql<Follower[]>`
      DELETE FROM followers
      WHERE
        followers.user_id1 = ${userId}
        AND followers.user_id2 = (
          SELECT
            user_id
          FROM
            sessions
          WHERE
            sessions.token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        *;
    `;
    return followerUser;
  },
);

export const stopFollowingUser = cache(
  async (sessionToken: Session['token'], userId: User['id']) => {
    const [followerUser] = await sql<Follower[]>`
      DELETE FROM followers
      WHERE
        followers.user_id2 = ${userId}
        AND followers.user_id1 = (
          SELECT
            user_id
          FROM
            sessions
          WHERE
            sessions.token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        *;
    `;
    return followerUser;
  },
);
