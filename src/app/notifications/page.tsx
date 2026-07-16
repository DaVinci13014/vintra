import { redirect } from "next/navigation";

import { requireSession } from "@/features/auth/server";
import { getNotifications, notificationListInputSchema } from "@/features/notifications";
import { NotificationCenter } from "@/features/notifications/ui";
import { NotificationsLayout } from "@/widgets/notifications";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const session = await requireSession();
  if (!session.user.emailVerified) redirect("/verification-email");
  const params = await searchParams;
  const parsedParams = notificationListInputSchema.safeParse({
    page: params.page ?? "1",
    filter: params.filter ?? "ALL",
  });
  if (!parsedParams.success) redirect("/notifications");
  const data = await getNotifications(session.user.id, parsedParams.data);
  if (!data) redirect("/onboarding");
  if (Number(params.page ?? "1") > data.pageCount) {
    redirect(`/notifications?filter=${data.filter}&page=${data.pageCount}`);
  }

  return (
    <NotificationsLayout>
      <NotificationCenter data={data} />
    </NotificationsLayout>
  );
}
