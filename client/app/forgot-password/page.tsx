import { redirect } from 'next/navigation';
import { PasswordResetRequestForm } from '../../components/PasswordResetRequestForm';
import { getOptionalServerSession } from '../../lib/server-session';

export default async function ForgotPasswordPage() {
  const session = await getOptionalServerSession();
  if (session.user) {
    redirect('/dashboard');
  }
  return <PasswordResetRequestForm />;
}
