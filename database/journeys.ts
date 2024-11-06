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
  ) => {
    const [journey] = await sql<Journey[]>`
      INSERT INTO
        journeys (
          user_id,
          country_adm0_a3,
          title,
          date_start,
          date_end,
          summary
        ) (
          SELECT
            sessions.user_id,
            ${countryAdm0A3},
            ${title},
            ${dateStart},
            ${dateEnd},
            ${summary}
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
