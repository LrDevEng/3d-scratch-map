import type { Sql } from 'postgres';
import { z } from 'zod';

export const diaryImageSchema = z.object({
  diaryId: z.number().int(),
  imageUrl: z.string(),
  longitude: z.number().nullable(),
  latitude: z.number().nullable(),
  dateShot: z.coerce.date().nullable(),
});

export type DiaryImage = {
  id: number;
  diaryId: number;
  imageUrl: string;
  longitude: number | null;
  latitude: number | null;
  dateShot: Date | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE diary_images (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      diary_id integer NOT NULL REFERENCES diaries (id) ON DELETE cascade,
      image_url varchar NOT NULL,
      longitude double precision,
      latitude double precision,
      date_shot date
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE diary_images`;
}
