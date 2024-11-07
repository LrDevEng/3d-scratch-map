import { cache } from 'react';
import { type Session } from '../migrations/00001-createTableSessions';
import { type Journey } from '../migrations/00002-createTableJourneys';
import { type Diary } from '../migrations/00003-createTableDiaries';
import { sql } from './connect';

export const getDiaries = cache(
  async (sessionToken: string, journeyId: number) => {
    const diaries = await sql<Diary[]>`
      SELECT
        diaries.*
      FROM
        diaries
        INNER JOIN (
          journeys
          INNER JOIN sessions ON (
            sessions.token = ${sessionToken}
            AND sessions.user_id = journeys.user_id
            AND expiry_timestamp > now()
          )
        ) ON (
          journeys.id = ${journeyId}
          AND diaries.journey_id = journeys.id
        )
      ORDER BY
        diaries.date_start DESC
    `;
    return diaries;
  },
);

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
            journeys.id,
            ${title},
            ${dateStart},
            ${thoughts}
          FROM
            journeys
            INNER JOIN sessions ON (
              sessions.token = ${sessionToken}
              AND sessions.expiry_timestamp > now()
              AND journeys.user_id = sessions.user_id
              AND journeys.id = ${journeyId}
            )
        )
      RETURNING
        diaries.*
    `;

    return diary;
  },
);

export const updateDiary = cache(
  async (sessionToken: Session['token'], updatedDiary: Diary) => {
    const [diary] = await sql<Diary[]>`
      UPDATE diaries
      SET
        title = ${updatedDiary.title},
        date_start = ${updatedDiary.dateStart},
        thoughts = ${updatedDiary.thoughts}
      FROM
        sessions
        INNER JOIN journeys ON (
          sessions.token = ${sessionToken}
          AND sessions.expiry_timestamp > now()
          AND journeys.user_id = sessions.user_id
          AND journeys.id = ${updatedDiary.journeyId}
        )
      WHERE
        sessionjourneys.journey_id = journeys.id
      RETURNING
        diaries.*
    `;
    return diary;
  },
);
