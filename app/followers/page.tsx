import { getFollowerUsers, getFollowingUsers } from '../../database/followers';
import { checkAuthorization } from '../../util/auth';
import FollowersAccepted from './FollowersAccepted';
import FollowersPending from './FollowersPending';
import FollowingAccepted from './FollowingAccepted';
import FollowingPending from './FollowingPending';
import SearchFriends from './SearchFollowers';

export default async function Followers() {
  const { user, sessionTokenCookie } = await checkAuthorization(`/followers`);

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
    <div className="relative mt-24 flex w-full flex-col items-center px-8">
      Friends
      <SearchFriends
        followingIds={[
          ...followingUsers.map((followingUser) => followingUser.id),
          user.id,
        ]}
      />
      {followingUsersPending.length > 0 && (
        <FollowingPending followingUsers={followingUsersPending} />
      )}
      {followingUsersAccepted.length > 0 && (
        <FollowingAccepted followingUsers={followingUsersAccepted} />
      )}
      {followerUsersPending.length > 0 && (
        <FollowersPending followerUsers={followerUsersPending} />
      )}
      {followerUsersAccepted.length > 0 && (
        <FollowersAccepted
          followerUsers={followerUsersAccepted}
          followingUsers={followingUsers}
        />
      )}
    </div>
  );
}
