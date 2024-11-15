import { checkAuthentication } from '../../../util/auth';

export default async function Globe() {
  await checkAuthentication('/');
}
