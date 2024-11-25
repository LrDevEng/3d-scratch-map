'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { deleteAccount } from './actions';

export default function DeleteUserButton() {
  const router = useRouter();

  return (
    <form className="w-full">
      <button
        className="btn btn-error w-full"
        data-test-id="profile-page-confirm-deletion"
        formAction={async () => {
          if (await deleteAccount()) {
            router.replace('/');
            toast.success('Success: Account deleted.');
          } else {
            toast.error('Error: Not able to delte account.');
          }
        }}
      >
        Confirm
      </button>
    </form>
  );
}
