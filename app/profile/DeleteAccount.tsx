'use client';

import { useState } from 'react';
import DeleteUserButton from './DeleteUserButton';

export default function DeleteAccount() {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <div className="w-full mt-4">
      {!showDeleteButton && (
        <button
          data-test-id="profile-page-delete-account-button"
          className="btn btn-warning w-full"
          onClick={() => setShowDeleteButton(true)}
        >
          Delete Account
        </button>
      )}
      {showDeleteButton && <DeleteUserButton />}
      {showDeleteButton && (
        <button
          className="btn btn-primary w-full mt-4"
          onClick={() => setShowDeleteButton(false)}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
