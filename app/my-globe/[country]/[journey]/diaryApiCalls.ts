import type { DiaryResponseBodyCud } from '../../../api/diaries/route';

export async function createOrUpdateDiary(
  diaryId: number | undefined,
  journeyId: number,
  title: string,
  dateStart: Date,
  thoughts: string,
) {
  let response;

  if (diaryId) {
    response = await fetch(`/api/diaries/${diaryId}`, {
      method: 'PUT',
      body: JSON.stringify({
        journeyId,
        title,
        dateStart,
        thoughts,
      }),
    });
  } else {
    response = await fetch('/api/diaries', {
      method: 'POST',
      body: JSON.stringify({
        journeyId,
        title,
        dateStart,
        thoughts,
      }),
    });
  }

  const responseBody: DiaryResponseBodyCud = await response.json();
  return responseBody;

  // if (!response.ok) {
  //   const responseBody: DiaryResponseBodyCud = await response.json();

  //   if ('error' in responseBody) {
  //     // TODO: Use toast instead of showing
  //     // this below creation / update form
  //     console.log(responseBody.error);
  //     return;
  //   }
  // }
}

export async function deleteDiary(diaryId: number) {
  const response = await fetch(`/api/diaries/${diaryId}`, {
    method: 'DELETE',
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
