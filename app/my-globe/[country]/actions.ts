import type { JourneyResponseBodyCud } from '../../api/journeys/route';

export async function createOrUpdateJourney(
  journeyId: number | undefined,
  countryAdm0A3: string,
  title: string,
  dateStart: Date,
  dateEnd: Date,
  summary: string,
) {
  let response;
  if (journeyId) {
    response = await fetch(`/api/journeys/${journeyId}`, {
      method: 'PUT',
      body: JSON.stringify({
        countryAdm0A3,
        title,
        dateStart,
        dateEnd,
        summary,
      }),
    });
  } else {
    response = await fetch('/api/journeys', {
      method: 'POST',
      body: JSON.stringify({
        countryAdm0A3,
        title,
        dateStart,
        dateEnd,
        summary,
      }),
    });
  }

  if (!response.ok) {
    const responseBody: JourneyResponseBodyCud = await response.json();

    if ('error' in responseBody) {
      // TODO: Use toast instead of showing
      // this below creation / update form
      console.log(responseBody.error);
      return;
    }
  }
}

export async function deleteJourney(journeyId: number) {
  const response = await fetch(`/api/journeys/${journeyId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const responseBody: JourneyResponseBodyCud = await response.json();

    if ('error' in responseBody) {
      // TODO: Use toast instead of showing
      // this below creation / update form
      console.log(responseBody.error);
      return;
    }
  }
}

export async function uploadJourneyImage() {}
