import type { Sql } from 'postgres';
import { z } from 'zod';

export const diarySchema = z.object({
  journeyId: z.number().int(),
  title: z.string().min(3).max(150),
  startDate: z.coerce.date(),
  thoughts: z.string(),
});

export type Diary = {
  id: number;
  journeyId: number;
  title: string;
  startDate: Date;
  thoughts: string;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE diaries (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      journey_id integer NOT NULL REFERENCES journeys (id) ON DELETE cascade,
      title varchar(150) NOT NULL,
      date_start date NOT NULL,
      thoughts text NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE diaries`;
}
