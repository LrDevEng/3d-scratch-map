import type { Sql } from 'postgres';
import { z } from 'zod';
import type { User } from './00000-createTableUsers';
import type { DiaryImage } from './00004-createTableDiaryImages';

export const likeSchema = z.object({
  diaryImageId: z.number(),
  userId: z.number(),
});

export type Like = {
  diaryImageId: DiaryImage['id'];
  userId: User['id'];
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE likes (
      diary_image_id integer NOT NULL REFERENCES diary_images (id) ON DELETE cascade,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      PRIMARY KEY (diary_image_id, user_id)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE likes`;
}
