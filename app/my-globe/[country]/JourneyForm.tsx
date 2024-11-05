'use client';

import { useRouter } from 'next/navigation';

export default function JourneyForm() {
  const router = useRouter();

  return (
    <form className="card my-8 w-full min-w-32 max-w-[800px] bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="form-control mt-2 w-full">
          <input
            placeholder="journey title"
            className="input input-bordered w-full text-center"
          />
        </div>

        <div className="form-control mt-2 w-full">
          <label className="label flex">
            <div className="label-text mx-4 w-20 text-left text-neutral-content">
              End Date
            </div>
            <input type="date" className="input input-bordered flex-grow" />
          </label>
        </div>

        <div className="form-control mt-2 w-full">
          <label className="label flex">
            <div className="label-text mx-4 w-20 text-left text-neutral-content">
              Start Date
            </div>
            <input type="date" className="input input-bordered flex-grow" />
          </label>
        </div>

        <div className="form-control mt-2 w-full">
          <textarea
            placeholder="brief summary of the journey (max. 2000 characters)"
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="card-actions mt-8 w-full justify-end">
          <button className="btn btn-primary w-full">create</button>
        </div>
      </div>
    </form>
  );
}
