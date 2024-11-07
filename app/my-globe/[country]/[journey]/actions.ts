import type { DiaryResponseBodyCud } from '../../../api/diaries/route';

export async function createOrUpdateDiary(
  journeyId: number,
  title: string,
  dateStart: Date,
  thoughts: string,
) {
  const response = await fetch('/api/diaries', {
    method: 'POST',
    body: JSON.stringify({
      journeyId,
      title,
      dateStart,
      thoughts,
    }),
  });

  if (!response.ok) {
    const responseBody: DiaryResponseBodyCud = await response.json();

    if ('error' in responseBody) {
      // TODO: Use toast instead of showing
      // this below creation / update form
      console.log(responseBody.error);
      return;
    }
  }
}

// export async function deleteJourney(journeyId: number) {
//   const response = await fetch(`/api/journeys/${journeyId}`, {
//     method: 'DELETE',
//   });

//   if (!response.ok) {
//     const responseBody: JourneyResponseBodyCud = await response.json();

//     if ('error' in responseBody) {
//       // TODO: Use toast instead of showing
//       // this below creation / update form
//       console.log(responseBody.error);
//       return;
//     }
//   }
// }
