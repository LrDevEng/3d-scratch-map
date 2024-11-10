import type { DiaryImageResponseBodyCud } from '../../../api/diaryImages/route';

export async function createDiaryImage(
  diaryId: number,
  imageUrl: string,
  longitude: number | null,
  latitude: number | null,
  dateShot: Date | null,
) {
  const response = await fetch('/api/diaryImages', {
    method: 'POST',
    body: JSON.stringify({
      diaryId,
      imageUrl,
      longitude,
      latitude,
      dateShot,
    }),
  });

  if (!response.ok) {
    const responseBody: DiaryImageResponseBodyCud = await response.json();

    if ('error' in responseBody) {
      // TODO: Use toast instead of showing
      // this below creation / update form
      console.log(responseBody.error);
      return;
    }
  }
}
