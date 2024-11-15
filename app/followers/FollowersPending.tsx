'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { FollowerUser } from '../../migrations/00000-createTableUsers';
import { type FollowResponseBodyCud } from '../api/followers/following/[followingId]/route';

type Props = {
  followerUsers: FollowerUser[];
};

export default function FollowersPending({ followerUsers }: Props) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      <table>
        <tbody>
          {followerUsers.map((followerUser) => {
            return (
              <tr key={`found-user-${followerUser.id}`}>
                <td className="w-[60px] py-2">
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
                <td className="w-24 overflow-ellipsis px-4 py-2">
                  <div className="w-24 overflow-hidden text-ellipsis">
                    {followerUser.givenName}
                  </div>
                </td>
                <td className="w-48 py-2">
                  <div className="w-48 overflow-hidden text-ellipsis">
                    {followerUser.email}
                  </div>
                </td>
                <td className="w-36 px-4 py-2">
                  <button
                    className="btn btn-ghost"
                    onClick={async () => {
                      const response = await fetch(
                        `/api/followers/follower/${followerUser.id}`,
                        {
                          method: 'PUT',
                        },
                      );

                      const responseBody: FollowResponseBodyCud =
                        await response.json();

                      if ('error' in responseBody) {
                        toast.error(
                          'Error: Accepting follower request failed.',
                        );
                      } else if ('follower' in responseBody) {
                        toast.success('Success: Follower request accepted.');
                      }

                      router.refresh();
                    }}
                  >
                    accept
                  </button>
                </td>
                <td className="w-36">
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
                        toast.error('Error: Rejecting follower failed.');
                      } else if ('follower' in responseBody) {
                        toast.success('Success: Follower rejected.');
                      }

                      router.refresh();
                    }}
                  >
                    reject
                  </button>
                </td>
                <td className="w-24 py-2 text-end text-[#66b14e]">pending</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
