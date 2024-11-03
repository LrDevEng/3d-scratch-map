'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { getSafeReturnToPath } from '../../util/validation';
import ErrorMessage from '../components/ErrorMessage';
import { type LoginResponseBody } from './(auth)/api/log-in/route';
import { type RegisterResponseBody } from './(auth)/api/register/route';

type Props = {
  isLogIn?: boolean;
  returnTo?: string | string[];
};

export default function RegisterLogIn({ isLogIn = false, returnTo }: Props) {
  const [email, setEmail] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();
  const title = isLogIn ? 'log in' : 'register';
  const redirectText = isLogIn ? 'create account?' : 'already have an account?';
  const redirectButtonText = isLogIn ? 'register' : 'log in';
  const redirectRoute = isLogIn ? '/register' : '/log-in';

  // Log in request
  async function logIn() {
    const response = await fetch('api/log-in', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data: LoginResponseBody = await response.json();
    return data;
  }

  // Register request
  async function register() {
    if (password !== passwordRepeat) {
      // Set error if passwords do not match
      return {
        errors: [{ message: 'Passwords must match.' }],
      };
    }

    const response = await fetch('api/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        givenName,
        familyName,
        password,
      }),
    });

    const data: RegisterResponseBody = await response.json();
    return data;
  }

  // Handle form submit
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = isLogIn ? await logIn() : await register();

    if ('errors' in data) {
      setErrors(data.errors);
      return;
    }

    router.push(getSafeReturnToPath(returnTo) || `/my-globe/${data.user.id}`);

    // router.refresh();
  }

  return (
    <div className="card my-8 w-full min-w-32 bg-neutral text-neutral-content">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>

        <form
          className="w-full"
          onSubmit={async (event) => await handleSubmit(event)}
        >
          {!isLogIn && (
            <div className="input input-bordered mt-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                className="grow"
                placeholder="name"
                value={givenName}
                onChange={(event) => setGivenName(event.currentTarget.value)}
                required
              />
            </div>
          )}

          {!isLogIn && (
            <div className="input input-bordered mt-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>

              <input
                className="grow"
                placeholder="surname"
                value={familyName}
                onChange={(event) => setFamilyName(event.currentTarget.value)}
                required
              />
            </div>
          )}

          <div className="input input-bordered mt-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              className="grow"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
            />
          </div>

          <div className="input input-bordered mt-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
            />
          </div>

          {!isLogIn && (
            <div className="input input-bordered mt-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                className="grow"
                placeholder="repeat password"
                value={passwordRepeat}
                onChange={(event) =>
                  setPasswordRepeat(event.currentTarget.value)
                }
                required
              />
            </div>
          )}

          {/* Display error messages */}
          <div className="mt-8">
            {errors.map((error) => (
              <div key={`error-${error.message}`}>
                <ErrorMessage>{error.message.toLowerCase()}</ErrorMessage>
              </div>
            ))}
          </div>

          <div className="card-actions mt-8 w-full justify-end">
            <button className="btn btn-primary w-full">continue</button>
          </div>
        </form>
        <div className="text-sm">
          <p className="inline">{redirectText}</p>
          <button
            className="btn btn-link"
            onClick={() => router.push(redirectRoute)}
          >
            {redirectButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
