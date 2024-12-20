import LogoutButton from '../(home)/(auth)/logout/LogoutButton';
import { checkAuthentication } from '../../util/auth';
import Footer from '../components/Footer';
import DeleteAccount from './DeleteAccount';
import ProfilePicture from './ProfilePicture';

export const metadata = {
  title: 'Profile',
  description:
    'Your personal profile page to edit settings and update account related information.',
};

export default async function Profile() {
  const { user } = await checkAuthentication(`/profile`);
  const profileImgSrc = user.imageUrl ? user.imageUrl : '/icons/userIcon.svg';

  return (
    <div className="flex flex-col h-full">
      <div
        className="relative px-8 pt-24 flex flex-col items-center flex-grow"
        style={{
          backgroundImage: "url('/images/bg-image.jpg')",
          backgroundSize: '700px 700px',
          backgroundRepeat: 'repeat',
        }}
      >
        <ProfilePicture profileImgSrc={profileImgSrc} />
        <div>
          <table>
            <tbody>
              <tr>
                <td className="pt-4">Email:</td>
                <td className="pl-8 pt-4">{user.email}</td>
              </tr>
              <tr>
                <td className="pt-4">Name:</td>
                <td className="pl-8 pt-4">{user.givenName}</td>
              </tr>
              <tr>
                <td className="pt-4">Surname:</td>
                <td className="pl-8 pt-4">{user.familyName}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8">
            <LogoutButton />
            <DeleteAccount />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
