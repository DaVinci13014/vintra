export default function NotificationsLoading() {
  return (
    <main className="min-h-svh animate-pulse bg-background px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="h-12 w-72 rounded-xl bg-card" />
        <div className="h-10 w-full rounded-xl bg-card sm:w-3/4" />
        <div className="h-40 rounded-2xl bg-card" />
        <div className="h-40 rounded-2xl bg-card" />
        <div className="h-40 rounded-2xl bg-card" />
      </div>
    </main>
  );
}
