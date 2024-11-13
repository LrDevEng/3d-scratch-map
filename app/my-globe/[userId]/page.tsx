import { checkAuthorization } from '../../../util/auth';

export default async function Globe() {
  await checkAuthorization('/my-globe');
}
