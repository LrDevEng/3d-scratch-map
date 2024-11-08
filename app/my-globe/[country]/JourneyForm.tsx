'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type Journey } from '../../../migrations/00002-createTableJourneys';
import DeleteButton from '../../components/DeleteButton';
import { createOrUpdateJourney, deleteJourney } from './actions';

type Props = {
  selectedCountryAdm0A3: string;
  journey: Journey | undefined;
  onSubmit?: () => void;
  onDelete?: () => void;
};

export default function JourneyForm({
  selectedCountryAdm0A3,
  journey,
  onSubmit,
  onDelete,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summary, setSummary] = useState('');
  const [imgUrl, setImgUrl] = useState<string | null>();

  useEffect(() => {
    if (journey) {
      setTitle(journey.title);
      setStartDate(journey.dateStart);
      setEndDate(journey.dateEnd);
      setSummary(journey.summary);
      setImgUrl(journey.imageUrl);
    }
  }, [journey]);

  // Clean up freeing memory
  useEffect(() => {
    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [imgUrl]);

  return (
    <div className="mb-8">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const journeyId = journey?.id || undefined;

          await createOrUpdateJourney(
            journeyId,
            selectedCountryAdm0A3,
            title,
            startDate,
            endDate,
            summary,
          );

          if (onSubmit) {
            onSubmit();
          }
          router.refresh();
        }}
        className="card my-8 w-full min-w-32 max-w-[800px] bg-neutral text-neutral-content"
      >
        <div className="card-body items-center text-center">
          {imgUrl && (
            <div className="relative h-[150px] w-full">
              <Image
                className="rounded-lg object-contain"
                src={imgUrl}
                alt="journey title image"
                fill={true}
              />
            </div>
          )}
          <div className="form-control mt-2 w-full">
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              className="file-input file-input-primary"
              placeholder="choose title image"
              required
              onChange={(event) => {
                const file = event.target.files
                  ? event.target.files[0]
                  : undefined;
                if (file) {
                  setImgUrl(URL.createObjectURL(file));
                } else {
                  setImgUrl(null);
                }
              }}
            />
          </div>

          <div className="form-control mt-2 w-full">
            <input
              placeholder="journey title"
              className="input input-bordered w-full text-center"
              required
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </div>

          <div className="flex w-full">
            <div className="form-control mt-2 w-full">
              <label className="label flex">
                <div className="label-text mx-4 text-left text-neutral-content">
                  From
                </div>
                <input
                  type="date"
                  className="input input-bordered flex-grow"
                  required
                  value={dayjs(startDate).format('YYYY-MM-DD')}
                  onChange={(event) =>
                    setStartDate(new Date(event.currentTarget.value))
                  }
                />
              </label>
            </div>

            <div className="form-control mt-2 w-full">
              <label className="label flex">
                <div className="label-text mx-4 text-left text-neutral-content">
                  To
                </div>
                <input
                  type="date"
                  className="input input-bordered flex-grow"
                  required
                  value={dayjs(endDate).format('YYYY-MM-DD')}
                  onChange={(event) =>
                    setEndDate(new Date(event.currentTarget.value))
                  }
                />
              </label>
            </div>
          </div>

          <div className="form-control mt-2 w-full">
            <textarea
              placeholder="brief summary of the journey (max. 2000 characters)"
              className="textarea textarea-bordered min-h-40 w-full"
              required
              value={summary}
              onChange={(event) => setSummary(event.currentTarget.value)}
            />
          </div>

          <div className="card-actions mt-8 w-full justify-end">
            <button className="btn btn-primary w-full">save</button>
          </div>
        </div>
      </form>
      {journey && (
        <DeleteButton
          onClick={async () => {
            await deleteJourney(journey.id);
            if (onDelete) {
              onDelete();
            }
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
