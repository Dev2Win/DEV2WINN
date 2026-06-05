export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-extrabold text-purple-1">Dev2Win v2</h1>
      <p className="text-gray-600">
        Client scaffold is up. The v1 design will be ported here (see{' '}
        <code>legacy/</code> and <code>task.md</code> Phase 2).
      </p>
      <a
        className="text-sm font-medium text-purple-1 underline"
        href="http://localhost:4000/health"
      >
        Check server health →
      </a>
    </main>
  );
}
