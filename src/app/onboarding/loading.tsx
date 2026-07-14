export default function OnboardingLoading() {
  return (
    <main className="min-h-svh bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="mb-12 h-2 rounded-full bg-card" />
        <div className="min-h-[520px] rounded-3xl border border-border bg-surface p-8">
          <div className="mb-8 size-11 rounded-xl bg-card" />
          <div className="h-4 w-28 rounded bg-card" />
          <div className="mt-4 h-10 w-4/5 rounded bg-card" />
          <div className="mt-3 h-5 w-2/3 rounded bg-card" />
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="h-14 rounded-2xl bg-card" />
            <div className="h-14 rounded-2xl bg-card" />
          </div>
        </div>
      </div>
    </main>
  );
}
