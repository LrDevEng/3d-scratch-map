'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  currentUserId: number;
};

export default function FollowerUpdates({ currentUserId }: Props) {
  const router = useRouter();
  const [trigger, setTrigger] = useState(false);

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

    // Renew connection every 55 seconds
    const timer = setTimeout(() => {
      eventSource.close();
      setTrigger(!trigger);
    }, 55000);

    // Clean up
    return () => {
      eventSource.close();
      clearTimeout(timer);
    };
  }, [currentUserId, router, trigger]);
  return <div />;
}
