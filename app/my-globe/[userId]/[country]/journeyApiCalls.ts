import toast from 'react-hot-toast';
import type { JourneyResponseBodyCud } from '../../../api/journeys/route';

export async function createOrUpdateJourney(
  journeyId: number | undefined,
  countryAdm0A3: string,
  title: string,
  dateStart: Date,
  dateEnd: Date,
  summary: string,
  imageUrl: string | null,
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
        imageUrl,
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
        imageUrl,
      }),
    });
  }

  const responseBody: JourneyResponseBodyCud = await response.json();
  return responseBody;
}

export async function deleteJourney(journeyId: number) {
  const response = await fetch(`/api/journeys/${journeyId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const responseBody: JourneyResponseBodyCud = await response.json();

    if ('error' in responseBody) {
      console.log('Delete journey error: ', responseBody.error);
      toast.error('Error: Failed to delete journey.');
      return;
    } else {
      toast.success('Success: Journey deleted.');
    }
  }
}
