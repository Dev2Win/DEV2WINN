import { AppShell } from '../../components/AppShell';
import { requireServerSession } from '../../lib/server-session';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireServerSession();
  return (
    <AppShell user={session.user} csrfToken={session.csrfToken}>
      {children}
    </AppShell>
  );
}
