import { cache } from 'react';
import { type Session } from '../migrations/00001-createTableSessions';
import { type Diary } from '../migrations/00003-createTableDiaries';
import { type DiaryImage } from '../migrations/00004-createTableDiaryImages';
import { sql } from './connect';

export const getDiaryImages = cache(
  async (sessionToken: string, diaryId: number) => {
    const diaryImages = await sql<DiaryImage[]>`
      SELECT
        di.*
      FROM
        diary_images di
        JOIN diaries d ON di.diary_id = d.id
        JOIN journeys j ON d.journey_id = j.id
        JOIN users u ON j.user_id = u.id
        JOIN sessions s ON u.id = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND s.expiry_timestamp > now()
        AND d.id = ${diaryId}
    `;
    return diaryImages;
  },
);

export const createDiaryImage = cache(
  async (
    sessionToken: Session['token'],
    diaryId: Diary['id'],
    imageUrl: DiaryImage['imageUrl'],
    longitude: DiaryImage['longitude'],
    latitude: DiaryImage['latitude'],
    dateShot: DiaryImage['dateShot'],
  ) => {
    // const dateShotInsert = dateShot ? dateShot : new Date();
    const [diaryImage] = await sql<DiaryImage[]>`
      INSERT INTO
        diary_images (
          diary_id,
          image_url,
          longitude,
          latitude,
          date_shot
        ) (
          SELECT
            d.id,
            ${imageUrl},
            ${longitude},
            ${latitude},
            ${dateShot}
          FROM
            (
              journeys j
              JOIN sessions s ON (
                s.token = ${sessionToken}
                AND s.expiry_timestamp > now()
                AND j.user_id = s.user_id
              )
              JOIN diaries d ON j.id = d.journey_id
            )
          WHERE
            d.id = ${diaryId}
        )
      RETURNING
        diary_images.*
    `;

    return diaryImage;
  },
);
