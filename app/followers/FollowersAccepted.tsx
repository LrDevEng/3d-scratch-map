'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { FollowerUser } from '../../migrations/00000-createTableUsers';
import { type FollowingUser } from '../../migrations/00000-createTableUsers';
import type { FollowResponseBodyCud } from '../api/followers/following/[followingId]/route';
import HorizontalDivider from '../components/HorizontalDivider';

type Props = {
  followerUsers: FollowerUser[];
  followingUsers: FollowingUser[];
};

export default function FollowersAccepted({
  followerUsers,
  followingUsers,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full items-center">
        <HorizontalDivider />
        <h3 className="mx-4 text-nowrap">your followers</h3>
        <HorizontalDivider />
      </div>
      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {followerUsers.map((followerUser) => {
            return (
              <tr key={`found-user-${followerUser.id}`}>
                <td className="py-2">
                  <div className="h-[50px] w-[50px] rounded-full border-2 border-white">
                    <Image
                      className="rounded-full object-contain"
                      src={
                        followerUser.imageUrl
                          ? followerUser.imageUrl
                          : '/icons/userIcon.svg'
                      }
                      alt="profile picture"
                      height={50}
                      width={50}
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{followerUser.givenName}</td>
                <td className="py-2">{followerUser.email}</td>
                <td className="px-4 py-2">
                  <button
                    className="btn btn-ghost"
                    onClick={async () => {
                      const response = await fetch(
                        `/api/followers/follower/${followerUser.id}`,
                        {
                          method: 'DELETE',
                        },
                      );

                      const responseBody: FollowResponseBodyCud =
                        await response.json();

                      if ('error' in responseBody) {
                        toast.error('Error: Removing follower failed.');
                      } else if ('follower' in responseBody) {
                        toast.success('Success: Follower removed.');
                      }

                      router.refresh();
                    }}
                  >
                    remove
                  </button>
                </td>
                {!followingUsers.some(
                  (followingUser) => followingUser.id === followerUser.id,
                ) && (
                  <td>
                    <button
                      className="btn btn-ghost"
                      onClick={async () => {
                        const response = await fetch(
                          `/api/followers/following/${followerUser.id}`,
                          {
                            method: 'POST',
                          },
                        );

                        const responseBody: FollowResponseBodyCud =
                          await response.json();

                        if ('error' in responseBody) {
                          toast.error('Error: Follow request failed.');
                        } else if ('follower' in responseBody) {
                          toast.success('Success: Follow request send.');
                        }

                        router.refresh();
                      }}
                    >
                      follow
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
