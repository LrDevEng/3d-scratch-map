import type { Sql } from 'postgres';
import { z } from 'zod';
import type { User } from './00000-createTableUsers';

export const followerSchema = z.object({
  userId1: z.number(),
  userId2: z.number(),
  status: z.number(),
});

export type Follower = {
  id: number;
  userId1: User['id'];
  userId2: User['id'];
  status: number;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE followers (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id1 integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      user_id2 integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      status integer NOT NULL,
      CONSTRAINT unique_followers UNIQUE (user_id1, user_id2)
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE followers`;
}
