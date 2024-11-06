'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import type { CreateJourneyResponseBodyPost } from '../../api/journeys/route';
import { useSelectedCountry } from '../../stores/useCountry';

export default function JourneyForm() {
  const selectedCountryAdm0A3 = useSelectedCountry(
    (state) => state.countryAdm0A3,
  );
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [summary, setSummary] = useState('');

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const response = await fetch('/api/journeys', {
          method: 'POST',
          body: JSON.stringify({
            countryAdm0A3: selectedCountryAdm0A3,
            title: title,
            dateStart: startDate,
            dateEnd: endDate,
            summary: summary,
          }),
        });

        if (!response.ok) {
          const responseBody: CreateJourneyResponseBodyPost =
            await response.json();

          if ('error' in responseBody) {
            // TODO: Use toast instead of showing
            // this below creation / update form
            console.log(responseBody.error);
            return;
          }
        }
      }}
      className="card my-8 w-full min-w-32 max-w-[800px] bg-neutral text-neutral-content"
    >
      <div className="card-body items-center text-center">
        <div className="form-control mt-2 w-full">
          <input
            placeholder="journey title"
            className="input input-bordered w-full text-center"
            required
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
        </div>

        <div className="form-control mt-2 w-full">
          <label className="label flex">
            <div className="label-text mx-4 w-20 text-left text-neutral-content">
              Start Date
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
            <div className="label-text mx-4 w-20 text-left text-neutral-content">
              End Date
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

        <div className="form-control mt-2 w-full">
          <textarea
            placeholder="brief summary of the journey (max. 2000 characters)"
            className="textarea textarea-bordered w-full"
            required
            value={summary}
            onChange={(event) => setSummary(event.currentTarget.value)}
          />
        </div>

        <div className="card-actions mt-8 w-full justify-end">
          <button className="btn btn-primary w-full">create</button>
        </div>
      </div>
    </form>
  );
}
