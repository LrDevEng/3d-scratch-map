import { cache } from 'react';
import { type Session } from '../migrations/00001-createTableSessions';
import type { DiaryImage } from '../migrations/00004-createTableDiaryImages';
import { type Like } from '../migrations/00006-createTableDiaryImageLikes';
import { sql } from './connect';

export const getLikesInsecure = cache(
  async (diaryImageId: DiaryImage['id']) => {
    const likes = await sql<Like[]>`
      SELECT
        likes.*
      FROM
        likes
      WHERE
        likes.diary_image_id = ${diaryImageId}
    `;

    return likes;
  },
);

export const createLike = cache(
  async (sessionToken: Session['token'], diaryImageId: DiaryImage['id']) => {
    const [like] = await sql<Like[]>`
      INSERT INTO
        likes (diary_image_id, user_id) (
          SELECT
            ${diaryImageId},
            s.user_id
          FROM
            sessions s
            JOIN followers f ON s.user_id = f.user_id1
            JOIN journeys j ON f.user_id2 = j.user_id
            JOIN diaries d ON j.id = d.journey_id
            JOIN diary_images di ON d.id = di.diary_id
          WHERE
            s.token = ${sessionToken}
            AND s.expiry_timestamp > now()
            AND di.id = ${diaryImageId}
        )
      RETURNING
        likes.diary_image_id,
        likes.user_id
    `;

    return like;
  },
);

export const createPersonalLike = cache(
  async (sessionToken: Session['token'], diaryImageId: DiaryImage['id']) => {
    const [like] = await sql<Like[]>`
      INSERT INTO
        likes (diary_image_id, user_id) (
          SELECT
            ${diaryImageId},
            s.user_id
          FROM
            sessions s
            JOIN journeys j ON s.user_id = j.user_id
            JOIN diaries d ON j.id = d.journey_id
            JOIN diary_images di ON d.id = di.diary_id
          WHERE
            s.token = ${sessionToken}
            AND s.expiry_timestamp > now()
            AND di.id = ${diaryImageId}
        )
      RETURNING
        likes.diary_image_id,
        likes.user_id
    `;

    return like;
  },
);

export const deleteLike = cache(
  async (sessionToken: Session['token'], diaryImageId: DiaryImage['id']) => {
    const [like] = await sql<Like[]>`
      DELETE FROM likes USING sessions s,
      followers f,
      journeys j,
      diaries d,
      diary_images di,
      likes l
      WHERE
        s.user_id = f.user_id1
        AND f.user_id2 = j.user_id
        AND j.id = d.journey_id
        AND d.id = di.diary_id
        AND di.id = likes.diary_image_id
        AND s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
        AND di.id = ${diaryImageId}
        AND l.diary_image_id = ${diaryImageId}
      RETURNING
        likes.*;
    `;

    return like;
  },
);

export const deletePersonalLike = cache(
  async (sessionToken: Session['token'], diaryImageId: DiaryImage['id']) => {
    const [like] = await sql<Like[]>`
      DELETE FROM likes USING sessions s,
      journeys j,
      diaries d,
      diary_images di,
      likes l
      WHERE
        s.user_id = j.user_id
        AND j.id = d.journey_id
        AND d.id = di.diary_id
        AND di.id = likes.diary_image_id
        AND s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
        AND di.id = ${diaryImageId}
        AND l.diary_image_id = ${diaryImageId}
      RETURNING
        likes.*;
    `;

    return like;
  },
);
