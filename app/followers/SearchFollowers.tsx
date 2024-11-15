'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { type User } from '../../migrations/00000-createTableUsers';
import type { FollowResponseBodyCud } from '../api/followers/following/[followingId]/route';
import type { UserResponseBodySearch } from '../api/users/route';
import SearchBar from '../components/SearchBar';

type Props = {
  followingIds: number[];
};

export default function SearchFollowers({ followingIds }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUsers, setFoundUsers] = useState<Omit<User, 'familyName'>[]>();

  return (
    <div className="flex flex-col items-center">
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const response = await fetch(`/api/users`, {
            method: 'POST',
            body: JSON.stringify({
              searchTerm,
            }),
          });

          const responseBody: UserResponseBodySearch = await response.json();

          if ('error' in responseBody) {
            toast.error('Error: User search failed.');
          } else if ('users' in responseBody) {
            const users = responseBody.users;
            const filteredUsers = users?.filter(
              (user) => !followingIds.includes(user.id),
            );
            if (filteredUsers && filteredUsers.length > 0) {
              setFoundUsers(filteredUsers);
            } else {
              toast(
                `Info: Already following this user or email - ${searchTerm} - is not registered.`,
              );
            }
          }

          setSearchTerm('');
          router.refresh();
        }}
      >
        <SearchBar
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
      </form>
      {foundUsers && foundUsers.length > 0 && (
        <table className="mt-4">
          <tbody>
            {foundUsers.map((foundUser) => {
              return (
                <tr key={`found-user-${foundUser.id}`}>
                  <td className="py-2">
                    <div className="h-[50px] w-[50px] rounded-full border-2 border-white">
                      <Image
                        className="rounded-full object-contain"
                        src={
                          foundUser.imageUrl
                            ? foundUser.imageUrl
                            : '/icons/userIcon.svg'
                        }
                        alt="profile picture"
                        height={50}
                        width={50}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">{foundUser.givenName}</td>
                  <td className="py-2">{foundUser.email}</td>
                  <td className="px-4 py-2">
                    <button
                      className="btn btn-ghost"
                      onClick={async () => {
                        const response = await fetch(
                          `/api/followers/following/${foundUser.id}`,
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

                        setSearchTerm('');
                        setFoundUsers([]);

                        router.refresh();
                      }}
                    >
                      follow
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
