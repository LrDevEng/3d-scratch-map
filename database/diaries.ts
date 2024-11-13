import { cache } from 'react';
import { type Session } from '../migrations/00001-createTableSessions';
import { type Journey } from '../migrations/00002-createTableJourneys';
import { type Diary } from '../migrations/00003-createTableDiaries';
import { sql } from './connect';

export const getDiaries = cache(
  async (sessionToken: string, journeyId: number) => {
    const diaries = await sql<Diary[]>`
      SELECT
        d.*
      FROM
        diaries d
        JOIN journeys j ON d.journey_id = j.id
        JOIN users u ON j.user_id = u.id
        JOIN sessions s ON u.id = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
        AND j.id = ${journeyId}
      ORDER BY
        d.date_start DESC
    `;
    return diaries;
  },
);

export const getDiariesByFollowingId = cache(
  async (sessionToken: string, journeyId: number, followingId: number) => {
    const diaries = await sql<Diary[]>`
      SELECT
        d.*
      FROM
        diaries d
        JOIN journeys j ON d.journey_id = j.id
        JOIN followers f ON j.user_id = f.user_id2
        JOIN sessions s ON f.user_id1 = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
        AND j.id = ${journeyId}
        AND f.user_id2 = ${followingId}
      ORDER BY
        d.date_start DESC
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
  async (
    sessionToken: Session['token'],
    userId: number,
    updatedDiary: Omit<Diary, 'journeyId'>,
  ) => {
    const [diary] = await sql<Diary[]>`
      UPDATE diaries
      SET
        title = ${updatedDiary.title},
        date_start = ${updatedDiary.dateStart},
        thoughts = ${updatedDiary.thoughts}
      WHERE
        id = ${updatedDiary.id}
        AND id IN (
          SELECT
            d.id
          FROM
            diaries d
            JOIN journeys j ON d.journey_id = j.id
            JOIN users u ON j.user_id = u.id
            JOIN sessions s ON u.id = s.user_id
          WHERE
            s.token = ${sessionToken}
            AND s.expiry_timestamp > now()
            AND u.id = ${userId}
        )
      RETURNING
        diaries.*
    `;
    return diary;
  },
);

export const deleteDiary = cache(
  async (sessionToken: Session['token'], userId: number, diaryId: number) => {
    const [diary] = await sql<Diary[]>`
      DELETE FROM diaries USING sessions,
      journeys
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND diaries.id = ${diaryId}
        AND ${userId} IN (
          SELECT
            journeys.user_id
          FROM
            diaries
            JOIN journeys ON diaries.journey_id = journeys.id
        )
      RETURNING
        diaries.*
    `;

    return diary;
  },
);
