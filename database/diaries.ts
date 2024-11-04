import { cache } from 'react';
import { type Session } from '../migrations/00001-createTableSessions';
import { type Journey } from '../migrations/00002-createTableJourneys';
import { type Diary } from '../migrations/00003-createTableDiaries';
import { sql } from './connect';

export const createDiary = cache(
  async (
    sessionToken: Session['token'],
    journeyId: Journey['id'],
    title: Diary['title'],
    dateStart: Diary['dateStart'],
    thoughts: Diary['thoughts'],
  ) => {
    const [diary] = await sql<Diary[]>`
      INSERT INTO
        diaries (
          journey_id,
          title,
          date_start,
          thoughts
        ) (
          SELECT
            journeys.user_id,
            ${journeyId},
            ${title},
            ${dateStart},
            ${thoughts}
          FROM
            journeys
          WHERE
            journeys.user_id = sessions.user_id
            AND sessions.token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        journeys.*
    `;

    return diary;
  },
);
