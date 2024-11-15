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

  // Create notification trigger
  await sql`
    CREATE
    OR REPLACE function notify_follower_update () returns trigger AS $$
    BEGIN
      PERFORM pg_notify('follower_updates', json_build_object(
        'operation', TG_OP,
        'id', CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        'user_id1', CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id1 ELSE NEW.user_id1 END,
        'user_id2', CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id2 ELSE NEW.user_id2 END,
        'status', CASE WHEN TG_OP = 'DELETE' THEN OLD.status ELSE NEW.status END
      )::text);
      RETURN NEW;
    END;
    $$ language plpgsql;
  `;

  // Attach the trigger to the followers table
  await sql`
    CREATE TRIGGER follower_update_trigger
    AFTER insert
    OR
    UPDATE
    OR delete ON followers FOR each ROW
    EXECUTE function notify_follower_update ();
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TRIGGER if EXISTS follower_update_trigger ON followers`;
  await sql`DROP FUNCTION if EXISTS notify_follower_update`;
  await sql`DROP TABLE followers`;
}
