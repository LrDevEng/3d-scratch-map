import { cache } from 'react';
import { type User } from '../migrations/00000-createTableUsers';
import type { Diary } from '../migrations/00003-createTableDiaries';
import type {
  Comment,
  UserComment,
} from '../migrations/00007-createTableComments';
import { sql } from './connect';

export const createCommentInsecure = cache(
  async (userId: User['id'], diaryId: Diary['id'], post: string) => {
    const [comment] = await sql<Comment[]>`
      INSERT INTO
        comments (diary_id, user_id, post)
      VALUES
        (
          ${diaryId},
          ${userId},
          ${post}
        )
      RETURNING
        comments.*
    `;

    return comment;
  },
);

export const getUserCommentsInsecure = cache(async (diaryId: Diary['id']) => {
  const comments = await sql<UserComment[]>`
    SELECT
      comments.id,
      comments.diary_id,
      comments.user_id,
      comments.post,
      comments.created_at,
      users.given_name,
      users.image_url
    FROM
      comments
      JOIN users ON comments.user_id = users.id
    WHERE
      comments.diary_id = ${diaryId}
    ORDER BY
      comments.created_at DESC
  `;

  return comments;
});
