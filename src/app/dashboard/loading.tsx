export default function DashboardLoading() {
  return (
    <main className="min-h-svh animate-pulse bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="h-12 w-72 rounded-2xl bg-card" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-36 rounded-2xl bg-card" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="h-72 rounded-3xl bg-card" />
          <div className="h-72 rounded-3xl bg-card" />
        </div>
      </div>
    </main>
  );
}
