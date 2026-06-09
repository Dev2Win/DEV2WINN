import { redirect } from 'next/navigation';
import { AuthForm } from '../../components/AuthForm';
import { getOptionalServerSession } from '../../lib/server-session';

export default async function SignupPage() {
  const session = await getOptionalServerSession();
  if (session.user) {
    redirect('/dashboard');
  }
  return <AuthForm mode="signup" />;
}
