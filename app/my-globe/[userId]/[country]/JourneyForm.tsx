'use client';

import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { type Journey } from '../../../../migrations/00002-createTableJourneys';
import DeleteButton from '../../../components/DeleteButton';
import LoadingRing from '../../../components/LoadingRing';
import { askGemini, uploadImage } from './actions';
import { createOrUpdateJourney, deleteJourney } from './journeyApiCalls';

type Props = {
  selectedCountryAdm0A3: string;
  selectedCountryName: string;
  journey: Journey | undefined;
  onSubmit?: () => void;
  onDelete?: () => void;
};

export default function JourneyForm({
  selectedCountryAdm0A3,
  selectedCountryName,
  journey,
  onSubmit,
  onDelete,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summary, setSummary] = useState('');
  const [aiSupport, setAiSupport] = useState(false);
  const [aiBuzzWords, setAiBuzzWords] = useState(selectedCountryName);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [imgToUpload, setImgToUpload] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (journey) {
      setTitle(journey.title);
      setStartDate(journey.dateStart);
      setEndDate(journey.dateEnd);
      setSummary(journey.summary);
      setImgUrl(journey.imageUrl ? journey.imageUrl : undefined);
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

  if (loading) {
    return (
      <div className="mb-8">
        <LoadingRing />
      </div>
    );
  }

  return (
    <div className="mx-auto mb-8 w-full">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          // Set loading state
          setLoading(true);

          // Try to upload image to cloudinary and set current image url to new url if successful
          let currentImgUrl = null;
          if (imgToUpload) {
            console.log('Trying to upload picture.');
            currentImgUrl = await uploadImage(imgToUpload);
            if (!currentImgUrl) {
              console.log('Image upload failed.');
              toast.error('Error: Failed to upload journey title image.');
            }
          }

          // If no upload was requested or upload failed retreive old image url from journey
          if (!currentImgUrl && journey?.imageUrl) {
            currentImgUrl = journey.imageUrl;
          }

          const journeyId = journey?.id || undefined;
          const response = await createOrUpdateJourney(
            journeyId,
            selectedCountryAdm0A3,
            title,
            startDate,
            endDate,
            summary,
            currentImgUrl,
          );

          if ('error' in response) {
            console.log('Error creating or updating journey: ', response.error);
            toast.error('Error: Failed to create/update journey.');
          } else if ('journey' in response) {
            console.log(
              'Journey sucessfully created or updated: ',
              response.journey,
            );
            toast.success('Success: Journey created/updated.');
          }

          if (onSubmit) {
            onSubmit();
          }
          setLoading(false);
          router.refresh();
        }}
        className="card mx-auto my-8 w-full min-w-32 max-w-[1000px] bg-neutral text-neutral-content"
      >
        <div className="card-body items-center text-center">
          {!imgUrl && <div>Chose title image</div>}
          {imgUrl && (
            <div className="relative h-[150px] w-full">
              <Image
                className="rounded-lg object-contain"
                src={imgUrl}
                alt="journey title image"
                fill={true}
                sizes="(max-width: 20vw)"
              />
            </div>
          )}
          <div className="form-control mt-2 w-full">
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .webp"
              className="file-input file-input-primary"
              placeholder="choose title image"
              onChange={(event) => {
                const file = event.target.files
                  ? event.target.files[0]
                  : undefined;
                if (file) {
                  setImgUrl(URL.createObjectURL(file));
                  setImgToUpload(file);
                } else {
                  setImgUrl(undefined);
                  setImgToUpload(undefined);
                }
              }}
            />
          </div>
          <div className="form-control mt-2 w-full">
            <input
              data-test-id="journey-form-title"
              placeholder="Journey title"
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
                  data-test-id="journey-form-start-date"
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
                  data-test-id="journey-form-end-date"
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
            <label className="label flex justify-start">
              <div className="label-text mx-4 text-left text-neutral-content">
                Get AI inspiration
              </div>
              <input
                type="checkbox"
                checked={aiSupport}
                onChange={() => {
                  setAiSupport(!aiSupport);
                }}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          {aiSupport && (
            <div className="form-control mt-2 w-full">
              <div className="label flex items-center">
                <div className="label-text mx-4 text-left text-neutral-content flex-1">
                  Enter buzz words for the AI generator:
                </div>
                <button
                  className="btn btn-primary mt-4 mb-4 flex-1"
                  onClick={async (event) => {
                    event.preventDefault();
                    const prompt = aiBuzzWords;
                    setAiBuzzWords(selectedCountryName);
                    const aiSummary = await askGemini(prompt);
                    setSummary((prev) => `${prev} ${aiSummary}`);
                  }}
                >
                  Generate summary
                </button>
              </div>
              <textarea
                data-test-id="journey-form-ai-buzz-words"
                placeholder="buzz words"
                className="textarea textarea-bordered min-h-20 w-full"
                required
                value={aiBuzzWords}
                onChange={(event) => setAiBuzzWords(event.currentTarget.value)}
              />
            </div>
          )}

          <div className="form-control mt-2 w-full">
            <textarea
              data-test-id="journey-form-summary"
              placeholder="Brief summary of the journey (max. 2000 characters)"
              className="textarea textarea-bordered min-h-40 w-full"
              required
              value={summary}
              onChange={(event) => setSummary(event.currentTarget.value)}
            />
          </div>
          <div className="card-actions mt-8 w-full justify-end">
            <button
              className="btn btn-primary w-full"
              data-test-id="journey-form-save-button"
            >
              Save
            </button>
          </div>
        </div>
      </form>
      {journey && (
        <DeleteButton
          data-test-id="journey-form-delete-button"
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
