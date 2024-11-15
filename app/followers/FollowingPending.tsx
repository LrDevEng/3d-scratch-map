'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { FollowingUser } from '../../migrations/00000-createTableUsers';
import type { FollowResponseBodyCud } from '../api/followers/following/[followingId]/route';

type Props = {
  followingUsers: FollowingUser[];
};

export default function FollowingPending({ followingUsers }: Props) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col">
      <table>
        <tbody>
          {followingUsers.map((followingUser) => {
            return (
              <tr key={`found-user-${followingUser.id}`}>
                <td className="w-[60px] py-2">
                  <div className="h-[50px] w-[50px] rounded-full border-2 border-white">
                    <Image
                      className="rounded-full object-contain"
                      src={
                        followingUser.imageUrl
                          ? followingUser.imageUrl
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
                    {followingUser.givenName}
                  </div>
                </td>
                <td className="w-48 py-2">
                  <div className="w-48 overflow-hidden text-ellipsis">
                    {followingUser.email}
                  </div>
                </td>
                <td className="w-72 px-4 py-2">
                  <button
                    className="btn btn-ghost"
                    onClick={async () => {
                      const response = await fetch(
                        `/api/followers/following/${followingUser.id}`,
                        {
                          method: 'DELETE',
                        },
                      );

                      const responseBody: FollowResponseBodyCud =
                        await response.json();

                      if ('error' in responseBody) {
                        toast.error('Error: Revoking request failed.');
                      } else if ('follower' in responseBody) {
                        toast.success('Success: Revoked follower request.');
                      }

                      router.refresh();
                    }}
                  >
                    revoke request
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
