export const NOTIFICATION_PAGE_SIZE = 20;
export const MAX_ACTIVE_NOTIFICATIONS = 100;

export const NOTIFICATION_FILTERS = [
  "ALL",
  "UNREAD",
  "GOAL",
  "SAVINGS",
  "RECOMMENDATION",
  "SYSTEM",
  "SECURITY",
] as const;

export type NotificationFilter = (typeof NOTIFICATION_FILTERS)[number];

export type NotificationListItem = {
  id: string;
  title: string;
  description: string;
  type: "GOAL" | "SAVINGS" | "RECOMMENDATION" | "SYSTEM" | "SECURITY";
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "UNREAD" | "READ";
  actionUrl: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationCenterData = {
  filter: NotificationFilter;
  page: number;
  pageCount: number;
  total: number;
  unreadCount: number;
  notifications: NotificationListItem[];
};

export type NotificationEventInput = {
  profileId: string;
  title: string;
  description: string;
  type: "GOAL" | "SAVINGS" | "RECOMMENDATION" | "SYSTEM" | "SECURITY";
  priority: "LOW" | "MEDIUM" | "HIGH";
  actionUrl?: string;
  dedupeKey?: string;
};
