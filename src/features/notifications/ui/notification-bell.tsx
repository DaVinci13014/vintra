"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getUnreadNotificationCount } from "@/features/notifications/client";

const POLL_INTERVAL = 30_000;

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let active = true;

    async function refreshCount() {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await getUnreadNotificationCount();
        if (active && response.success) setCount(response.data.count);
      } catch {
        return;
      }
    }

    const interval = window.setInterval(refreshCount, POLL_INTERVAL);
    document.addEventListener("visibilitychange", refreshCount);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshCount);
    };
  }, []);

  return (
    <Link
      href="/notifications"
      className="relative grid size-11 place-items-center rounded-xl border border-border bg-card text-muted transition hover:text-foreground"
      aria-label={
        count > 0
          ? `${count} notification${count > 1 ? "s" : ""} non lue${count > 1 ? "s" : ""}`
          : "Notifications"
      }
    >
      <Bell size={19} aria-hidden="true" />
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </Link>
  );
}
