"use client";

import { BellRing, LockKeyhole, Send, ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";

import {
  disablePushNotifications,
  enablePushNotifications,
  notificationPreferencesSchema,
  updateNotificationPreferences,
  type NotificationPreferencesInput,
} from "@/features/notifications/client";
import { Button } from "@/shared/ui";

type InitialValues = NotificationPreferencesInput & {
  pushEnabled: boolean;
  pushAvailable: boolean;
  publicKey: string | null;
};

const OPTIONS = [
  {
    key: "goalProgressPush",
    title: "Progression des objectifs",
    description: "Jalons importants et objectif terminé.",
  },
  {
    key: "recommendationsPush",
    title: "Nouvelles recommandations",
    description: "Nouveaux conseils liés à votre budget.",
  },
  {
    key: "weeklySummaryPush",
    title: "Résumé hebdomadaire",
    description: "Un point synthétique sur votre progression.",
  },
] as const;

export function NotificationPreferences({ initialValues }: { initialValues: InitialValues }) {
  const [values, setValues] = useState<NotificationPreferencesInput>({
    goalProgressPush: initialValues.goalProgressPush,
    recommendationsPush: initialValues.recommendationsPush,
    weeklySummaryPush: initialValues.weeklySummaryPush,
  });
  const [pushEnabled, setPushEnabled] = useState(initialValues.pushEnabled);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle(key: keyof NotificationPreferencesInput) {
    const previous = values;
    const next = { ...values, [key]: !values[key] };
    const parsed = notificationPreferencesSchema.safeParse(next);
    if (!parsed.success) return;

    setValues(parsed.data);
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const response = await updateNotificationPreferences(parsed.data);
        if (!response.success) {
          setValues(previous);
          setError(response.error.message);
          return;
        }
        setMessage("Préférences enregistrées.");
      } catch {
        setValues(previous);
        setError("La connexion au serveur a été interrompue. Réessayez.");
      }
    });
  }

  function enablePush() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        if (
          !initialValues.publicKey ||
          !("Notification" in window) ||
          !("serviceWorker" in navigator) ||
          !("PushManager" in window)
        ) {
          setError("Les notifications Push ne sont pas disponibles sur ce navigateur.");
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setError("Autorisez les notifications dans votre navigateur pour activer le Push.");
          return;
        }
        const registration = await navigator.serviceWorker.register("/notification-sw.js");
        const existing = await registration.pushManager.getSubscription();
        const subscription =
          existing ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: decodeVapidKey(initialValues.publicKey),
          }));
        const response = await enablePushNotifications(subscription.toJSON());
        if (!response.success) {
          setError(response.error.message);
          return;
        }
        setPushEnabled(true);
        setMessage("Notifications Push activées sur cet appareil.");
      } catch {
        setError("Les notifications Push n’ont pas pu être activées sur cet appareil.");
      }
    });
  }

  function disablePush() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      let response: Awaited<ReturnType<typeof disablePushNotifications>>;
      try {
        response = await disablePushNotifications();
      } catch {
        setError("La connexion au serveur a été interrompue. Réessayez.");
        return;
      }
      if (!response.success) {
        setError(response.error.message);
        return;
      }
      try {
        const registration = await navigator.serviceWorker.getRegistration("/notification-sw.js");
        const subscription = await registration?.pushManager.getSubscription();
        await subscription?.unsubscribe();
      } catch {
        // Le serveur est déjà désabonné ; la souscription locale expirera sans nouvel envoi.
      }
      setPushEnabled(false);
      setMessage("Notifications Push désactivées.");
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
              <BellRing size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications Push</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-secondary-text">
                Recevez les événements importants même lorsque Vintra n’est pas ouvert.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant={pushEnabled ? "secondary" : "primary"}
            disabled={isPending || !initialValues.pushAvailable}
            onClick={pushEnabled ? disablePush : enablePush}
          >
            <Send size={17} aria-hidden="true" />
            {pushEnabled ? "Désactiver" : "Activer sur cet appareil"}
          </Button>
        </div>
        {!initialValues.pushAvailable && (
          <p className="mt-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            Le service Push doit être configuré pour cet environnement.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <Send className="text-brand" size={19} aria-hidden="true" />
          <h2 className="font-semibold">Alertes facultatives</h2>
        </div>
        <div className="mt-5 divide-y divide-border">
          {OPTIONS.map((option) => (
            <div
              key={option.key}
              className="flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0"
            >
              <div>
                <h3 className="text-sm font-medium">{option.title}</h3>
                <p className="mt-1 text-sm leading-6 text-secondary-text">{option.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={values[option.key]}
                aria-label={option.title}
                disabled={isPending}
                onClick={() => toggle(option.key)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition focus-visible:ring-2 focus-visible:ring-brand ${
                  values[option.key] ? "bg-brand" : "bg-elevated"
                }`}
              >
                <span
                  className={`absolute top-1 size-5 rounded-full bg-white transition ${
                    values[option.key] ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-brand/30 bg-brand/10 p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-background/60 text-brand">
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">Alertes de sécurité</h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 px-2 py-1 text-xs text-brand">
                <LockKeyhole size={12} aria-hidden="true" /> Obligatoires
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-secondary-text">
              Les connexions et modifications sensibles restent toujours signalées. Cette catégorie
              ne peut pas être désactivée séparément.
            </p>
          </div>
        </div>
      </section>

      {(message || error) && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-danger/30 bg-danger/10 text-danger"
              : "border-success/30 bg-success/10 text-success"
          }`}
          role="status"
        >
          {error ?? message}
        </p>
      )}
    </div>
  );
}

function decodeVapidKey(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}
