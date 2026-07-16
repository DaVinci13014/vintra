import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getNotificationPreferences } from "@/features/notifications";
import { NotificationPreferences } from "@/features/notifications/ui";
import { SettingsLayout } from "@/widgets/settings";

export default async function NotificationSettingsPage() {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const data = await getNotificationPreferences(session.user.id);
  if (!data) redirect("/onboarding");

  return (
    <SettingsLayout active="notifications" user={session.user}>
      <p className="text-sm font-medium text-brand">Notifications</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        Choisir vos alertes
      </h1>
      <p className="mt-3 max-w-2xl text-secondary-text">
        Les notifications In-App restent disponibles dans votre centre. Le Push est facultatif et
        contrôlé par appareil.
      </p>
      <div className="mt-8">
        <NotificationPreferences initialValues={data} />
      </div>
    </SettingsLayout>
  );
}
