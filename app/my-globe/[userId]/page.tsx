import { checkAuthentication } from '../../../util/auth';

export const metadata = {
  title: 'Globe',
  description: 'Look at our planet. What an amazing place.',
};

export default async function Globe() {
  await checkAuthentication('/');
}
