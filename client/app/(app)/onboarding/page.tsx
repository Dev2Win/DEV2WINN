import { OnboardingWizard } from '../../../components/OnboardingWizard';
import { requireServerSession } from '../../../lib/server-session';

export default async function OnboardingPage() {
  const session = await requireServerSession();
  return <OnboardingWizard user={session.user} csrfToken={session.csrfToken} />;
}
