'use client';

import { useState } from 'react';
import DeleteUserButton from './DeleteUserButton';

export default function DeleteAccount() {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  return (
    <div>
      {!showDeleteButton && (
        <button
          data-test-id="profile-page-delete-account-button"
          className="btn btn-ghost"
          onClick={() => setShowDeleteButton(true)}
        >
          Delete Account
        </button>
      )}
      {showDeleteButton && <DeleteUserButton />}
      {showDeleteButton && (
        <button
          className="btn btn-ghost"
          onClick={() => setShowDeleteButton(false)}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
