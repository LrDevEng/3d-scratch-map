import toast from 'react-hot-toast';
import type { DiaryResponseBodyCud } from '../../../../api/diaries/route';

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
}

export async function deleteDiary(diaryId: number) {
  const response = await fetch(`/api/diaries/${diaryId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const responseBody: DiaryResponseBodyCud = await response.json();

    if ('error' in responseBody) {
      console.log(responseBody.error);
      toast.error('Error: Failed to delete diary.');
      return;
    }
  } else {
    toast.success('Success: Diary deleted.');
  }
}
