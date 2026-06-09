import { ProfileWorkspace } from '../../../components/ProfileWorkspace';
import { requireServerSession } from '../../../lib/server-session';

export default async function ProfilePage() {
  const session = await requireServerSession();
  return <ProfileWorkspace user={session.user} csrfToken={session.csrfToken} />;
}
