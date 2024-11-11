import type { Sql } from 'postgres';
import { z } from 'zod';

export const journeySchema = z.object({
  countryAdm0A3: z.string().min(3).max(3),
  title: z.string().min(3).max(150),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  summary: z.string().max(2000),
  imageUrl: z.string().nullable(),
});

export type Journey = {
  id: number;
  userId: number;
  countryAdm0A3: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  summary: string;
  imageUrl: string | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE journeys (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id) ON DELETE cascade,
      country_adm0_a3 varchar NOT NULL,
      title varchar(150) NOT NULL,
      date_start date NOT NULL,
      date_end date NOT NULL,
      summary varchar(2000) NOT NULL,
      image_url varchar
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE journeys`;
}
