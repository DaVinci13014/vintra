"use client";

import { motion } from "framer-motion";
import {
  BellRing,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type {
  NotificationCenterData,
  NotificationFilter,
  NotificationListItem,
} from "@/entities/notification";
import {
  deleteAllNotifications,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
  openNotification,
} from "@/features/notifications/client";
import { Button } from "@/shared/ui";

const FILTERS: Array<{ value: NotificationFilter; label: string }> = [
  { value: "ALL", label: "Toutes" },
  { value: "UNREAD", label: "Non lues" },
  { value: "GOAL", label: "Objectifs" },
  { value: "SAVINGS", label: "Épargne" },
  { value: "RECOMMENDATION", label: "Conseils" },
  { value: "SYSTEM", label: "Système" },
  { value: "SECURITY", label: "Sécurité" },
];

const TYPE_LABELS = {
  GOAL: "Objectif",
  SAVINGS: "Épargne",
  RECOMMENDATION: "Conseil",
  SYSTEM: "Système",
  SECURITY: "Sécurité",
} as const;

const TYPE_ICONS = {
  GOAL: Target,
  SAVINGS: PiggyBank,
  RECOMMENDATION: Sparkles,
  SYSTEM: BellRing,
  SECURITY: ShieldCheck,
} as const;

export function NotificationCenter({ data }: { data: NotificationCenterData }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isPending, startTransition] = useTransition();

  function run(
    action: () => Promise<{ success: boolean; error?: { message: string } }>,
    success: string,
  ) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const response = await action();
        if (!response.success) {
          setError(response.error?.message ?? "Cette action n’a pas pu être effectuée.");
          return;
        }
        setMessage(success);
        setConfirmClear(false);
        router.refresh();
      } catch {
        setError("La connexion au serveur a été interrompue. Réessayez.");
      }
    });
  }

  function open(notification: NotificationListItem) {
    setError(null);
    startTransition(async () => {
      try {
        const response = await openNotification(notification.id);
        if (!response.success) {
          setError(response.error.message);
          return;
        }
        router.push(response.data.destination);
      } catch {
        setError("La notification n’a pas pu être ouverte. Réessayez.");
      }
    });
  }

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand">Votre activité</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Notifications
          </h1>
          <p className="mt-3 text-secondary-text">
            {data.unreadCount > 0
              ? `${data.unreadCount} élément${data.unreadCount > 1 ? "s" : ""} à consulter.`
              : "Tout est à jour."}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={isPending || data.unreadCount === 0}
          onClick={() =>
            run(markAllNotificationsRead, "Toutes les notifications ont été marquées comme lues.")
          }
        >
          <CheckCheck size={18} aria-hidden="true" />
          Tout marquer comme lu
        </Button>
      </div>

      <nav className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filtres des notifications">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={`/notifications?filter=${filter.value}`}
            aria-current={data.filter === filter.value ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
              data.filter === filter.value
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-border bg-card text-secondary-text hover:text-foreground"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </nav>

      {(message || error) && (
        <p
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-danger/30 bg-danger/10 text-danger"
              : "border-success/30 bg-success/10 text-success"
          }`}
          role="status"
        >
          {error ?? message}
        </p>
      )}

      <section
        className="mt-6 grid gap-3"
        aria-label="Liste des notifications"
        aria-busy={isPending}
      >
        {data.notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface p-10 text-center sm:p-14">
            <BellRing className="mx-auto text-brand" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Aucune notification.</h2>
            <p className="mt-2 text-secondary-text">Tout est à jour.</p>
          </div>
        ) : (
          data.notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              disabled={isPending}
              onOpen={() => open(notification)}
              onRead={() =>
                run(() => markNotificationRead(notification.id), "Notification marquée comme lue.")
              }
              onDelete={() =>
                run(() => deleteNotification(notification.id), "Notification supprimée.")
              }
            />
          ))
        )}
      </section>

      {data.pageCount > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
          <PaginationLink
            page={data.page - 1}
            filter={data.filter}
            disabled={data.page === 1}
            label="Page précédente"
            icon={ChevronLeft}
          />
          <span className="text-sm text-secondary-text">
            Page {data.page} sur {data.pageCount}
          </span>
          <PaginationLink
            page={data.page + 1}
            filter={data.filter}
            disabled={data.page === data.pageCount}
            label="Page suivante"
            icon={ChevronRight}
          />
        </nav>
      )}

      {data.total > 0 && (
        <div className="mt-12 border-t border-border pt-6 text-center">
          {confirmClear ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="w-full text-sm text-secondary-text">
                La suppression est définitive. Confirmer ?
              </p>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => setConfirmClear(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-danger hover:bg-danger/10"
                disabled={isPending}
                onClick={() =>
                  run(deleteAllNotifications, "Toutes les notifications ont été supprimées.")
                }
              >
                Supprimer définitivement
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="min-h-11 rounded-xl px-4 text-sm text-danger transition hover:bg-danger/10"
              onClick={() => setConfirmClear(true)}
            >
              Supprimer toutes les notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
  disabled,
  onOpen,
  onRead,
  onDelete,
}: {
  notification: NotificationListItem;
  disabled: boolean;
  onOpen: () => void;
  onRead: () => void;
  onDelete: () => void;
}) {
  const Icon = TYPE_ICONS[notification.type];
  const unread = notification.status === "UNREAD";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 sm:p-6 ${
        unread ? "border-brand/30 bg-brand/5" : "border-border bg-surface"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-card text-brand">
          <Icon size={20} aria-hidden="true" />
          {unread && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-background bg-brand"
              aria-label="Non lue"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-brand">{TYPE_LABELS[notification.type]}</span>
            <span className="text-muted">{formatDate(notification.createdAt)}</span>
            {notification.priority === "HIGH" && (
              <span className="rounded-full bg-danger/10 px-2 py-1 font-medium text-danger">
                Important
              </span>
            )}
          </div>
          <h2 className={`mt-2 text-lg ${unread ? "font-semibold" : "font-medium"}`}>
            {notification.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary-text">{notification.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" disabled={disabled} onClick={onOpen}>
              Ouvrir
            </Button>
            {unread && (
              <Button type="button" size="sm" variant="ghost" disabled={disabled} onClick={onRead}>
                <Check size={16} aria-hidden="true" />
                Marquer comme lue
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-danger hover:bg-danger/10"
              disabled={disabled}
              onClick={onDelete}
              aria-label={`Supprimer « ${notification.title} »`}
            >
              <Trash2 size={16} aria-hidden="true" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PaginationLink({
  page,
  filter,
  disabled,
  label,
  icon: Icon,
}: {
  page: number;
  filter: NotificationFilter;
  disabled: boolean;
  label: string;
  icon: typeof ChevronLeft;
}) {
  if (disabled) {
    return (
      <span className="grid size-11 place-items-center rounded-xl border border-border text-muted opacity-40">
        <Icon size={18} aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <Link
      href={`/notifications?filter=${filter}&page=${page}`}
      className="grid size-11 place-items-center rounded-xl border border-border bg-card text-secondary-text transition hover:text-foreground"
      aria-label={label}
    >
      <Icon size={18} aria-hidden="true" />
    </Link>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
