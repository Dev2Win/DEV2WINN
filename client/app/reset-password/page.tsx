import { redirect } from 'next/navigation';
import { PasswordResetConfirmForm } from '../../components/PasswordResetConfirmForm';
import { getOptionalServerSession } from '../../lib/server-session';

export default async function ResetPasswordPage() {
  const session = await getOptionalServerSession();
  if (session.user) {
    redirect('/dashboard');
  }
  return <PasswordResetConfirmForm />;
}
