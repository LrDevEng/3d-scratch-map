'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  currentUserId: number;
};

export default function FollowerUpdates({ currentUserId }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Event source to listen for server sent event (sse)
    const eventSource = new EventSource(
      `/api/followers/updates/${currentUserId}`,
    );

    // Handle incoming messages
    eventSource.onmessage = function (event) {
      console.log('Follower update received:', event.data);
      router.refresh();
    };

    // Handle incoming errors
    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
    };

    // Clean up
    return () => {
      eventSource.close();
    };
  }, [currentUserId, router]);
  return <div />;
}
