import type { Sql } from 'postgres';
import { z } from 'zod';
import type { User } from './00000-createTableUsers';

export const commentSchema = z.object({
  diaryId: z.number(),
  userId: z.number(),
  post: z.string().max(255),
});

export type Comment = {
  id: number;
  diaryId: number;
  userId: number;
  post: string;
  createdAt: Date;
};

export type UserComment = Comment & {
  givenName: User['givenName'];
  imageUrl: User['imageUrl'];
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE comments (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      diary_id integer NOT NULL REFERENCES diary_images (id) ON DELETE cascade,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      post varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE comments`;
}
