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

    eventSource.onmessage = function (event) {
      // Handle the incoming update (for example, log it)
      console.log('Follower update received:', event.data);
      // You can update your state here or trigger any side-effects
      router.refresh();
    };

    // Handle errors (optional)
    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
    };
  }, [currentUserId, router]);
  return <div />;
}
