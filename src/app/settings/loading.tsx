export default function SettingsLoading() {
  return (
    <main className="min-h-svh animate-pulse bg-background px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="h-80 rounded-3xl bg-card" />
        <div className="space-y-5">
          <div className="h-36 rounded-3xl bg-card" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-32 rounded-2xl bg-card" />
            <div className="h-32 rounded-2xl bg-card" />
            <div className="h-32 rounded-2xl bg-card" />
            <div className="h-32 rounded-2xl bg-card" />
          </div>
        </div>
      </div>
    </main>
  );
}
