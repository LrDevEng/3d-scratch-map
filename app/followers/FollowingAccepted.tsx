'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { FollowingUser } from '../../migrations/00000-createTableUsers';
import type { FollowResponseBodyCud } from '../api/followers/following/[followingId]/route';
import HorizontalDivider from '../components/HorizontalDivider';

type Props = {
  followingUsers: FollowingUser[];
};

export default function FollowingAccepted({ followingUsers }: Props) {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full items-center">
        <HorizontalDivider />
        <h3 className="mx-4 text-nowrap">you are following</h3>
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
          {followingUsers.map((followingUser) => {
            return (
              <tr key={`found-user-${followingUser.id}`}>
                <td className="py-2">
                  <Link href={`/my-globe/${followingUser.id}`}>
                    <div className="duration-250 relative h-[50px] w-[50px] rounded-full border-2 border-white transition-all hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.5)]">
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
                  </Link>
                </td>
                <td className="px-4 py-2">{followingUser.givenName}</td>
                <td className="py-2">{followingUser.email}</td>

                <td className="px-4 py-2">
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
                        toast.error('Error: Stop following failed.');
                      } else if ('follower' in responseBody) {
                        toast.success('Success: Stoped following user.');
                      }

                      router.refresh();
                    }}
                  >
                    stop following
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
