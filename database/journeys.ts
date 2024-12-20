import { cache } from 'react';
import { type Session } from '../migrations/00001-createTableSessions';
import { type Journey } from '../migrations/00002-createTableJourneys';
import { sql } from './connect';

export const getJourney = cache(
  async (sessionToken: string, journeyId: number) => {
    const [journey] = await sql<Journey[]>`
      SELECT
        journeys.*
      FROM
        journeys
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = journeys.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        journeys.id = ${journeyId}
    `;
    return journey;
  },
);

export const getJourneyByFollowingId = cache(
  async (sessionToken: string, journeyId: number, followingUserId: number) => {
    const [journey] = await sql<Journey[]>`
      SELECT
        j.*
      FROM
        journeys j
        JOIN users u ON j.user_id = u.id
        JOIN followers f ON u.id = f.user_id2
        JOIN sessions s ON f.user_id1 = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND j.user_id = ${followingUserId}
        AND j.id = ${journeyId}
      ORDER BY
        j.date_start DESC,
        j.date_end DESC
    `;
    return journey;
  },
);

export const getJourneys = cache(async (sessionToken: string) => {
  const journeys = await sql<Journey[]>`
    SELECT
      journeys.*
    FROM
      journeys
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND sessions.user_id = journeys.user_id
        AND expiry_timestamp > now()
      )
    ORDER BY
      journeys.date_start DESC,
      journeys.date_end DESC
  `;
  return journeys;
});

export const getJourneysByFollowingId = cache(
  async (sessionToken: string, followingUserId: number) => {
    const journeys = await sql<Journey[]>`
      SELECT
        j.*
      FROM
        journeys j
        JOIN users u ON j.user_id = u.id
        JOIN followers f ON u.id = f.user_id2
        JOIN sessions s ON f.user_id1 = s.user_id
      WHERE
        s.token = ${sessionToken}
        AND j.user_id = ${followingUserId}
      ORDER BY
        j.date_start DESC,
        j.date_end DESC
    `;
    return journeys;
  },
);

export const getJourneysForCountry = cache(
  async (sessionToken: string, countryAdm0A3: string) => {
    const journeys = await sql<Journey[]>`
      SELECT
        journeys.*
      FROM
        journeys
        INNER JOIN sessions ON (
          sessions.token = ${sessionToken}
          AND sessions.user_id = journeys.user_id
          AND expiry_timestamp > now()
        )
      WHERE
        journeys.country_adm0_a3 = ${countryAdm0A3}
      ORDER BY
        journeys.date_start
    `;
    return journeys;
  },
);

export const createJourney = cache(
  async (
    sessionToken: Session['token'],
    countryAdm0A3: Journey['countryAdm0A3'],
    title: Journey['title'],
    dateStart: Journey['dateStart'],
    dateEnd: Journey['dateEnd'],
    summary: Journey['summary'],
    imageUrl: Journey['imageUrl'],
  ) => {
    const [journey] = await sql<Journey[]>`
      INSERT INTO
        journeys (
          user_id,
          country_adm0_a3,
          title,
          date_start,
          date_end,
          summary,
          image_url
        ) (
          SELECT
            sessions.user_id,
            ${countryAdm0A3},
            ${title},
            ${dateStart},
            ${dateEnd},
            ${summary},
            ${imageUrl}
          FROM
            sessions
          WHERE
            token = ${sessionToken}
            AND sessions.expiry_timestamp > now()
        )
      RETURNING
        journeys.*
    `;

    return journey;
  },
);

export const updateJourney = cache(
  async (
    sessionToken: Session['token'],
    userId: number,
    updatedJourney: Omit<Omit<Journey, 'userId'>, 'countryAdm0A3'>,
  ) => {
    const [journey] = await sql<Journey[]>`
      UPDATE journeys
      SET
        title = ${updatedJourney.title},
        date_start = ${updatedJourney.dateStart},
        date_end = ${updatedJourney.dateEnd},
        summary = ${updatedJourney.summary},
        image_url = ${updatedJourney.imageUrl}
      FROM
        sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND journeys.id = ${updatedJourney.id}
        AND journeys.user_id = ${userId}
      RETURNING
        journeys.*
    `;
    return journey;
  },
);

export const deleteJourney = cache(
  async (sessionToken: Session['token'], userId: number, journeyId: number) => {
    const [journey] = await sql<Journey[]>`
      DELETE FROM journeys USING sessions
      WHERE
        sessions.token = ${sessionToken}
        AND sessions.expiry_timestamp > now()
        AND journeys.id = ${journeyId}
        AND journeys.user_id = ${userId}
      RETURNING
        journeys.*
    `;

    return journey;
  },
);
