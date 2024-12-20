'use client';

import { useRouter } from 'next/navigation';

export default function CreateAccount() {
  const router = useRouter();

  return (
    <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title">Join the community</h2>
        <p>create your account for free</p>
        <div className="card-actions mt-8 w-full justify-end">
          <button
            className="btn btn-primary w-full"
            onClick={() => router.push('/register')}
            data-test-id="landing-page-register-button"
          >
            Register
          </button>
        </div>
        <div className="text-sm">
          Already have an accout?
          <button
            className="btn btn-link"
            onClick={() => router.push('/log-in')}
            data-test-id="landing-page-login-button"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
