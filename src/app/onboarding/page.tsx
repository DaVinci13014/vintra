import { EmailVerificationGate, SignOutButton } from "@/features/auth";
import { requireSession } from "@/features/auth/server";
import { getOnboardingState, OnboardingFlow } from "@/processes/onboarding";
import { Logo } from "@/shared/ui";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await requireSession();

  if (!session.user.emailVerified) {
    return (
      <main className="flex min-h-svh flex-col bg-background px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <Logo priority />
          <SignOutButton />
        </header>
        <EmailVerificationGate email={session.user.email} />
      </main>
    );
  }

  const initialState = await getOnboardingState(session.user.id);
  if (initialState.completed) redirect("/dashboard");

  return (
    <main className="flex min-h-svh flex-col bg-background px-4 pb-6 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <Logo priority />
        <SignOutButton />
      </header>
      <OnboardingFlow initialState={initialState} firstName={session.user.firstName} />
    </main>
  );
}
