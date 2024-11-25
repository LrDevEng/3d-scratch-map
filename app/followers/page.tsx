import { getFollowerUsers, getFollowingUsers } from '../../database/followers';
import { checkAuthentication } from '../../util/auth';
import FollowersAccepted from './FollowersAccepted';
import FollowersPending from './FollowersPending';
import FollowingAccepted from './FollowingAccepted';
import FollowingPending from './FollowingPending';
import SearchFollowers from './SearchFollowers';

export const metadata = {
  title: 'Followers',
  description: 'Follow your friends on their travel adventures.',
};

export default async function Followers() {
  const { user, sessionTokenCookie } = await checkAuthentication(`/followers`);

  // Following users
  const followingUsers = await getFollowingUsers(sessionTokenCookie.value);
  // Following users pending
  const followingUsersPending = followingUsers.filter(
    (followingUser) => followingUser.status === 0,
  );
  // Following users accepted
  const followingUsersAccepted = followingUsers.filter(
    (followingUser) => followingUser.status === 1,
  );

  // Follower users
  const followerUsers = await getFollowerUsers(sessionTokenCookie.value);
  // Follower users pending
  const followerUsersPending = followerUsers.filter(
    (followerUser) => followerUser.status === 0,
  );
  // Follower users accepted
  const followerUsersAccepted = followerUsers.filter(
    (followerUser) => followerUser.status === 1,
  );

  return (
    <div
      className="relative pt-24 flex w-full flex-col items-center px-8 min-h-full"
      style={{
        backgroundImage: "url('/images/bg-image.jpg')",
        backgroundSize: '700px 700px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* <FollowerUpdates currentUserId={user.id} /> */}
      <div className="mb-8">
        <h2 className="mb-4 text-center">Search friends</h2>
        <SearchFollowers
          followingIds={[
            ...followingUsers.map((followingUser) => followingUser.id),
            user.id,
          ]}
        />
      </div>
      <div>
        <FollowingAccepted followingUsers={followingUsersAccepted} />
        {followingUsersPending.length > 0 && (
          <FollowingPending followingUsers={followingUsersPending} />
        )}

        <FollowersAccepted
          followerUsers={followerUsersAccepted}
          followingUsers={followingUsers}
        />
        {followerUsersPending.length > 0 && (
          <FollowersPending followerUsers={followerUsersPending} />
        )}
      </div>
    </div>
  );
}
