-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GOAL', 'SAVINGS', 'RECOMMENDATION', 'SYSTEM', 'SECURITY');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'NOTIFICATION_OPENED';
ALTER TYPE "AuditAction" ADD VALUE 'NOTIFICATION_CLICKED';
ALTER TYPE "AuditAction" ADD VALUE 'NOTIFICATION_DELETED';
ALTER TYPE "AuditAction" ADD VALUE 'NOTIFICATION_READ';
ALTER TYPE "AuditAction" ADD VALUE 'NOTIFICATION_SETTINGS_UPDATED';

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "priority" "NotificationPriority" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "actionUrl" VARCHAR(500),
    "dedupeKey" VARCHAR(255),
    "readAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "pushSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "goalProgressPush" BOOLEAN NOT NULL DEFAULT true,
    "recommendationsPush" BOOLEAN NOT NULL DEFAULT true,
    "weeklySummaryPush" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "endpoint" VARCHAR(2048) NOT NULL,
    "p256dh" VARCHAR(255) NOT NULL,
    "auth" VARCHAR(255) NOT NULL,
    "expirationTime" TIMESTAMP(3),
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_profileId_status_createdAt_idx" ON "notifications"("profileId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_profileId_type_createdAt_idx" ON "notifications"("profileId", "type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_profileId_dedupeKey_key" ON "notifications"("profileId", "dedupeKey");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_profileId_key" ON "notification_preferences"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_endpoint_key" ON "push_subscriptions"("endpoint");

-- CreateIndex
CREATE INDEX "push_subscriptions_profileId_idx" ON "push_subscriptions"("profileId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
